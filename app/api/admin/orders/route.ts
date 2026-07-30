import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all incoming orders and consultations with robust photo extraction
export async function GET() {
  try {
    const dbOrders = await (prisma as any).order?.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }).catch(() => []) || [];

    const formattedOrders = dbOrders.map((order: any) => {
      // Extract photos safely from multiple possible database structures
      const item = order.items?.[0] || {};
      const customization = item.customization || order.customization || {};
      
      let photos: string[] = [];
      if (Array.isArray(customization.photos)) {
        photos = customization.photos;
      } else if (typeof customization.photo === "string") {
        photos = [customization.photo];
      } else if (Array.isArray(item.photos)) {
        photos = item.photos;
      } else if (typeof order.photoUrl === "string") {
        photos = [order.photoUrl];
      }

      return {
        id: order.id,
        customerName: order.customerName || order.shippingAddress?.name || "Customer",
        phone: order.phone || order.shippingAddress?.phone || "—",
        email: order.email || "—",
        address: order.address || order.shippingAddress?.address || "—",
        productName: item.productName || order.productName || "Custom Keepsake",
        category: item.category || order.category || "Memory Boxes",
        amount: order.totalAmount || order.amount || 0,
        paymentMethod: order.paymentMethod || "Online",
        paymentStatus: order.paymentStatus || "PAID",
        orderStatus: order.status || order.orderStatus || "PENDING",
        date: new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN"),
        customization: {
          photos: photos,
          customName: customization.customName || item.customName || order.customName,
          customMessage: customization.customMessage || item.customMessage || order.customMessage,
          notes: customization.notes || item.notes || order.notes,
          deliveryDate: customization.deliveryDate || item.deliveryDate || order.deliveryDate,
        },
        internalNotes: order.internalNotes || [],
      };
    });

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
      referenceImages: c.referenceImages || c.photos || [],
      budget: c.budget,
      preferredDeliveryDate: c.preferredDeliveryDate,
      additionalNotes: c.additionalNotes,
      discussionStatus: c.discussionStatus || "NEW_REQUEST",
      date: new Date(c.createdAt || Date.now()).toLocaleDateString("en-IN"),
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