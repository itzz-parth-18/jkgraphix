import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
        cart: true,
      },
    });

    if (!user?.cart) {
      return NextResponse.json(
        { error: "Cart not found." },
        { status: 404 }
      );
    }

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
        pinCode,
        country,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save shipping information.",
      },
      { status: 500 }
    );
  }
}