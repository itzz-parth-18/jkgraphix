import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPaymentCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { calculateShippingCost } from "@/lib/shipping";
import {
  PaymentStatus,
  OrderStatus,
  Prisma,
} from "@prisma/client";

function generateOrderNumber() {
  return `JKG-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${Date.now()
    .toString()
    .slice(-6)}`;
}

export async function POST() {
  const requestStart = performance.now();

  try {
    /*
     * 1. Authenticate request
     */
    const authStart = performance.now();

    const session = await auth();

    

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /*
     * 2. Fetch only the cart/product data required
     *    for payment and order creation.
     *
     * getPaymentCart() intentionally does NOT fetch
     * product customFields because they are not needed
     * to calculate the payment amount.
     */
    const cartStart = performance.now();

    const cart = await getPaymentCart(session.user.id);

    

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    /*
     * 3. Calculate subtotal from database product prices.
     *
     * Client-side prices are never trusted.
     */
    const calculationStart = performance.now();

    const subtotal = cart.items.reduce(
      (total, item) =>
        total +
        Number(item.product.basePrice) * item.quantity,
      0
    );

    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount." },
        { status: 400 }
      );
    }

    /*
     * Shipping is recalculated on the server.
     *
     * Client-provided shipping cost is never trusted.
     */
    if (!cart.pinCode) {
      return NextResponse.json(
        { error: "Shipping information is incomplete." },
        { status: 400 }
      );
    }

    let shippingCost: number;

    try {
      shippingCost = calculateShippingCost(
        subtotal,
        cart.pinCode
      );
    } catch {
      return NextResponse.json(
        { error: "Invalid shipping PIN Code." },
        { status: 400 }
      );
    }

    const totalAmount = subtotal + shippingCost;
    const amountInPaise = Math.round(
      totalAmount * 100
    );

    

    if (
      !Number.isFinite(amountInPaise) ||
      amountInPaise <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid order amount." },
        { status: 400 }
      );
    }

    /*
     * Customer email comes from the saved cart first,
     * then authenticated session as fallback.
     */
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
     * 4. Create internal order first.
     *
     * The order is bound to:
     *
     * authenticated user
     * server-calculated subtotal
     * server-calculated shipping
     * server-calculated total
     *
     * before Razorpay checkout starts.
     */
    const orderCreateStart = performance.now();

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
            id: session.user.id,
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

    

    /*
     * 5. Create Razorpay order.
     *
     * The amount is calculated entirely on the server.
     */
    const razorpayStart = performance.now();

    try {
      const razorpayOrder =
        await razorpay.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: pendingOrder.id,
        });

      

      /*
       * 6. Store Razorpay order ID against
       *    our internal order.
       */
      const orderUpdateStart = performance.now();

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
       * Razorpay creation failed.
       *
       * Keep the internal order as PENDING for
       * audit/debugging, but don't expose internal
       * error details to the client.
       */
      console.error(
        "Razorpay order creation failed:",
        razorpayError
      );

      

      return NextResponse.json(
        {
          error:
            "Unable to create payment order.",
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
        error:
          "Unable to create payment order.",
      },
      { status: 500 }
    );
  }
}