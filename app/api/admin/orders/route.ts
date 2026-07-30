import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all incoming orders and consultations
export async function GET() {
  try {
    // Fetching orders safely from database if table exists
    const dbOrders = await (prisma as any).order?.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }).catch(() => []) || [];

    // Formatting orders for the frontend dashboard table
    const formattedOrders = dbOrders.map((order: any) => ({
      id: order.id,
      customerName: order.customerName || order.shippingAddress?.name || "Customer",
      phone: order.phone || order.shippingAddress?.phone || "—",
      email: order.email || "—",
      address: order.address || "—",
      productName: order.items?.[0]?.productName || "Custom Keepsake",
      category: order.items?.[0]?.category || "Memory Boxes",
      amount: order.totalAmount || order.amount || 0,
      paymentMethod: order.paymentMethod || "Online",
      paymentStatus: order.paymentStatus || "PAID",
      orderStatus: order.status || order.orderStatus || "PENDING",
      date: new Date(order.createdAt).toLocaleDateString("en-IN"),
      customization: {
        photos: order.items?.[0]?.customization?.photos || [],
        customName: order.items?.[0]?.customization?.customName,
        customMessage: order.items?.[0]?.customization?.customMessage,
        notes: order.items?.[0]?.customization?.notes,
        deliveryDate: order.items?.[0]?.customization?.deliveryDate,
      },
      internalNotes: order.internalNotes || [],
    }));

    // Fetching design consultations if table exists
    const dbConsultations = await (prisma as any).consultation?.findMany({
      orderBy: { createdAt: "desc" },
    }).catch(() => []) || [];

    const formattedConsultations = dbConsultations.map((c: any) => ({
      id: c.id,
      customerName: c.customerName,
      phone: c.phone,
      email: c.email,
      productName: c.productName,
      category: c.category,
      description: c.description,
      referenceImages: c.referenceImages || [],
      budget: c.budget,
      preferredDeliveryDate: c.preferredDeliveryDate,
      additionalNotes: c.additionalNotes,
      discussionStatus: c.discussionStatus || "NEW_REQUEST",
      date: new Date(c.createdAt).toLocaleDateString("en-IN"),
      internalNotes: c.internalNotes || [],
    }));

    return NextResponse.json({
      orders: formattedOrders,
      consultations: formattedConsultations,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders api:", error);
    return NextResponse.json({ orders: [], consultations: [] }, { status: 200 });
  }
}

// PATCH/PUT: Update order status
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await (prisma as any).order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}