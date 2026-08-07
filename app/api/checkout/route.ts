import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerEmail, customerName, customerPhone, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    // 1. Calculate prices matching schema Decimal requirements
    const subtotal = items.reduce((acc: number, item: any) => {
      const price = Number(item.basePrice || item.price || item.unitPrice || 0);
      const qty = Number(item.quantity || 1);
      return acc + price * qty;
    }, 0);

    const shippingCost = 0.0;
    const totalAmount = subtotal + shippingCost;

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );
    }

    // 2. Fetch or create a fallback reference product in DB
    let fallbackProduct = await prisma.product.findFirst();

    if (!fallbackProduct) {
      fallbackProduct = await prisma.product.create({
        data: {
          name: "Custom Memory Box",
          slug: `memory-box-${Date.now()}`,
          description: "Handcrafted personalized memory box",
          basePrice: subtotal > 0 ? subtotal : 48.0,
          sku: `SKU-${Date.now()}`,
        },
      });
    }

    // 3. Process each item and ensure product exists in DB
    const orderItemsData = await Promise.all(
      items.map(async (item: any) => {
        let rawCustomizations = item.customizations || {};

        if (typeof rawCustomizations === "string") {
          try {
            rawCustomizations = JSON.parse(rawCustomizations);
          } catch {
            rawCustomizations = {};
          }
        }

        // Check if item.productId exists in DB
        let validProductId = fallbackProduct!.id;
let productName = fallbackProduct!.name;
        if (item.productId && typeof item.productId === "string") {
          const existingProduct = await prisma.product.findUnique({
            where: { id: item.productId },
          });
          if (existingProduct) {
  validProductId = existingProduct.id;
  productName = existingProduct.name;
}
        }

        return {
          product: {
            connect: {
              id: validProductId,
            },
          },

productName,

          quantity: Number(item.quantity || 1),
          unitPrice: Number(item.basePrice || item.price || item.unitPrice || 0),
          customizations: rawCustomizations,
        };
      })
    );

    // 4. Generate unique order number
    const orderNumber = `ORD-${Date.now()}`;

    // 5. Create Order in Database
    const dbOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName || "Guest Customer",
        customerEmail: customerEmail || "guest@example.com",
        customerPhone: customerPhone || null,
        shippingAddress: shippingAddress || "Address not provided",
        subtotal,
        shippingCost,
        totalAmount,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
    });

    // 6. Create Razorpay Order
    const shortReceipt = `rcpt_${Date.now()}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Convert INR to paise
      currency: "INR",
      receipt: shortReceipt,
      notes: {
        dbOrderId: dbOrder.id,
        orderNumber: dbOrder.orderNumber,
      },
    });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: dbOrder.id,
    });
  } catch (error: any) {
    console.error("[RAZORPAY_CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}