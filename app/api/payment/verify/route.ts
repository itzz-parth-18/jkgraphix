import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { razorpay } from "@/lib/razorpay";

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a, "utf8");
  const bBuffer = Buffer.from(b, "utf8");

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment verification data.",
        },
        { status: 400 }
      );
    }

    /*
     * IMPORTANT:
     * Find the internal order using the Razorpay order ID AND
     * the authenticated user.
     *
     * We do not trust the browser-supplied order ID as proof
     * of ownership. It is only used to locate the server record.
     */
    const order = await prisma.order.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment order not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Idempotency:
     * If this order was already successfully paid, return the
     * existing order instead of creating/updating it again.
     */
    if (order.paymentStatus === PaymentStatus.PAID) {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
      });
    }

    if (!order.razorpayOrderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment order is not properly initialized.",
        },
        { status: 409 }
      );
    }

    /*
     * Prevent the same Razorpay payment ID from being attached
     * to a different internal order.
     */
    const existingPayment = await prisma.order.findFirst({
      where: {
        razorpayPaymentId: razorpay_payment_id,
        NOT: {
          id: order.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment has already been processed.",
        },
        { status: 409 }
      );
    }

    /*
     * Verify the signature using the Razorpay order ID stored
     * in OUR database.
     */
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(
        `${order.razorpayOrderId}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      !safeCompare(
        expectedSignature,
        razorpay_signature
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment signature.",
        },
        { status: 400 }
      );
    }

    /*
     * Fetch the payment directly from Razorpay.
     *
     * The browser callback says which payment ID was returned,
     * but Razorpay's server API is the authoritative source for
     * payment status and amount.
     */
    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    if (payment.order_id !== order.razorpayOrderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment does not belong to this order.",
        },
        { status: 400 }
      );
    }

    const expectedAmount = Math.round(
      Number(order.totalAmount) * 100
    );

    if (
      Number(payment.amount) !== expectedAmount ||
      payment.currency !== "INR"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment amount or currency mismatch.",
        },
        { status: 400 }
      );
    }

    /*
     * Do not treat an authorized payment as fully paid.
     * Fulfilment should happen only after capture.
     */
    if (payment.status !== "captured") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment has not been captured yet.",
        },
        { status: 409 }
      );
    }

    /*
     * Atomically mark the existing pending order as paid
     * and clear the customer's cart.
     */
    const updatedOrder =
      await prisma.$transaction(async (tx) => {
        const currentOrder =
          await tx.order.findUnique({
            where: {
              id: order.id,
            },
            select: {
              id: true,
              paymentStatus: true,
            },
          });

        if (!currentOrder) {
          throw new Error("Order not found.");
        }

        if (
          currentOrder.paymentStatus ===
          PaymentStatus.PAID
        ) {
          return tx.order.findUniqueOrThrow({
            where: {
              id: order.id,
            },
            select: {
              id: true,
              orderNumber: true,
            },
          });
        }

        const paidOrder =
          await tx.order.update({
            where: {
              id: order.id,
            },
            data: {
              paymentStatus:
                PaymentStatus.PAID,

              razorpayPaymentId:
                razorpay_payment_id,

              razorpaySignature:
                razorpay_signature,
            },
            select: {
              id: true,
              orderNumber: true,
            },
          });

        const cart = await tx.cart.findUnique({
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        });

        if (cart) {
          await tx.cartItem.deleteMany({
            where: {
              cartId: cart.id,
            },
          });

          await tx.cart.update({
            where: {
              id: cart.id,
            },
            data: {
              fullName: null,
              phone: null,
              email: null,
              addressLine1: null,
              addressLine2: null,
              city: null,
              state: null,
              pinCode: null,
              country: null,
            },
          });
        }

        return paidOrder;
      });

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      orderNumber:
        updatedOrder.orderNumber,
    });
  } catch (error) {
    console.error(
      "Payment verification failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed.",
      },
      { status: 500 }
    );
  }
}