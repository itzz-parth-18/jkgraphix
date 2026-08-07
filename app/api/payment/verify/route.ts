import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PaymentStatus,
  Prisma,
} from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment signature.",
        },
        { status: 400 }
      );
    }

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

    const cart = user?.cart;

if (!cart) {
  return NextResponse.json(
    {
      success: false,
      message: "Cart not found.",
    },
    { status: 404 }
  );
}

if (cart.items.length === 0) {
  return NextResponse.json(
    {
      success: false,
      message: "Cart is empty.",
    },
    { status: 400 }
  );
}

    const subtotal = cart.items.reduce(
      (total, item) =>
        total +
        Number(item.product.basePrice) *
          item.quantity,
      0
    );

    const shippingCost = 0;
    const totalAmount = subtotal + shippingCost;

    const orderNumber = `JKG-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Date.now()
      .toString()
      .slice(-6)}`;

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


const customerEmail =
  cart.email ?? session.user.email;

if (!customerEmail) {
  return NextResponse.json(
    {
      success: false,
      message: "Customer email not found.",
    },
    { status: 400 }
  );
}

    const order = await prisma.$transaction(
      async (tx) => {
        const createdOrder =
          await tx.order.create({
            data: {
              orderNumber,
              paymentStatus:
                PaymentStatus.PAID,

              customerName: cart.fullName ?? "",

              customerEmail,

              customerPhone:
                cart.phone,

              shippingAddress,

              addressLine1:
                cart.addressLine1,

              addressLine2:
                cart.addressLine2,

              city: cart.city,

              state: cart.state,

              pinCode:
                cart.pinCode,

              country:
                cart.country,

              subtotal,

              shippingCost,

              totalAmount,

              razorpayOrderId:
                razorpay_order_id,

              razorpayPaymentId:
                razorpay_payment_id,

              razorpaySignature:
                razorpay_signature,

              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });

        await tx.orderItem.createMany({
          data: cart.items.map(
            (item) => ({
              orderId:
                createdOrder.id,

              productId:
                item.productId,

              productName:
                item.product.name,

              productImage:
                item.product.imageUrl,

              quantity:
                item.quantity,

              unitPrice:
                item.product.basePrice,

              customizations:
  item.customizations as Prisma.InputJsonValue,
            })
          ),
        });

        await tx.cartItem.deleteMany({
          where: {
            cartId: cart!.id,
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

        return createdOrder;
      }
    );

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed.",
      },
      { status: 500 }
    );
  }
}