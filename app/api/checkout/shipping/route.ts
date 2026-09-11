import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateShippingCost } from "@/lib/shipping";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const {
      fullName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      country,
    } = body;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user?.cart) {
      return NextResponse.json(
        { error: "Cart not found." },
        { status: 404 }
      );
    }

    if (user.cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    /*
     * Validate PIN Code server-side.
     * The client-side validation is useful for UX,
     * but the server must validate it independently.
     */
    if (!/^\d{6}$/.test(String(pinCode ?? "").trim())) {
      return NextResponse.json(
        { error: "Enter a valid PIN Code." },
        { status: 400 }
      );
    }

    /*
     * Calculate subtotal from the server-side cart.
     * Never trust a subtotal supplied by the client.
     */
    const subtotal = user.cart.items.reduce(
      (total, item) =>
        total +
        Number(item.product.basePrice) * item.quantity,
      0
    );

    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return NextResponse.json(
        { error: "Invalid cart amount." },
        { status: 400 }
      );
    }

    /*
     * Calculate shipping entirely on the server.
     *
     * ₹599+ → FREE
     * Below ₹599 → PIN-code based manual rate
     */
    const shippingCost = calculateShippingCost(
      subtotal,
      String(pinCode).trim()
    );

    /*
     * Save the shipping information to the user's cart.
     * Existing checkout behavior is preserved.
     */
    await prisma.cart.update({
      where: {
        id: user.cart.id,
      },
      data: {
        fullName,
        phone,
        email,
        addressLine1,
        addressLine2,
        city,
        state,
        pinCode: String(pinCode).trim(),
        country,
      },
    });

    return NextResponse.json({
      success: true,
      subtotal,
      shippingCost,
      totalAmount: subtotal + shippingCost,
      freeShipping: shippingCost === 0,
    });
  } catch (error) {
    console.error("Shipping information save failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save shipping information.",
      },
      { status: 500 }
    );
  }
}