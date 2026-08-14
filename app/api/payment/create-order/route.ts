import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { PaymentStatus, OrderStatus, Prisma } from "@prisma/client";

function generateOrderNumber() {
  return `JKG-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${Date.now()
    .toString()
    .slice(-6)}`;
}

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cart = await getCart();

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    const subtotal = cart.items.reduce(
      (total, item) =>
        total +
        Number(item.product.basePrice) * item.quantity,
      0
    );

    const shippingCost = 0;
    const totalAmount = subtotal + shippingCost;
    const amountInPaise = Math.round(totalAmount * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const customerEmail =
      cart.email ?? session.user.email;

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email not found." },
        { status: 400 }
      );
    }

    const shippingAddress = [
      cart.addressLine1,
      cart.addressLine2,
      cart.city,
      cart.state,
      cart.pinCode,
      cart.country,
    ]
      .filter(Boolean)
      .join(", ");

    /*
     * Create the internal order first.
     *
     * This gives us a server-side record that binds:
     * authenticated user <-> internal order <-> expected amount
     * before Razorpay checkout begins.
     */
    const pendingOrder = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),

        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,

        customerName: cart.fullName ?? "",
        customerEmail,
        customerPhone: cart.phone,

        shippingAddress,

        addressLine1: cart.addressLine1,
        addressLine2: cart.addressLine2,
        city: cart.city,
        state: cart.state,
        pinCode: cart.pinCode,
        country: cart.country,

        subtotal,
        shippingCost,
        totalAmount,

        user: {
          connect: {
            id: user.id,
          },
        },

        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.imageUrl,
            quantity: item.quantity,
            unitPrice: item.product.basePrice,
            customizations:
              item.customizations as Prisma.InputJsonValue,
          })),
        },
      },
    });

    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: pendingOrder.id,
      });

      await prisma.order.update({
        where: {
          id: pendingOrder.id,
        },
        data: {
          razorpayOrderId: razorpayOrder.id,
        },
      });

      return NextResponse.json({
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: pendingOrder.id,
      });
    } catch (razorpayError) {
      /*
       * Razorpay order creation failed.
       * Keep the internal order as PENDING for audit/debugging,
       * but do not expose internal error details to the client.
       */
      console.error(
        "Razorpay order creation failed:",
        razorpayError
      );

      return NextResponse.json(
        {
          error: "Unable to create payment order.",
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error(
      "Payment order creation failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to create payment order.",
      },
      { status: 500 }
    );
  }
}