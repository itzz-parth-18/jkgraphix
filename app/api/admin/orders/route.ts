import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dbOrders = await (prisma as any).order?.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }).catch(() => []) || [];

    // Debug print in Vercel logs to see exact structure of first order
    if (dbOrders.length > 0) {
      console.log("DEBUG ORDER STRUCTURE:", JSON.stringify(dbOrders[0], null, 2));
    }

    const formattedOrders = dbOrders.map((order: any) => {
      const item = order.items?.[0] || {};
      
      // Gathering all possible photo paths
      let photos: string[] = [];
      const possibleSources = [
        item.photos,
        item.photoUrl,
        item.customization?.photos,
        item.customization?.photo,
        order.photos,
        order.photoUrl,
        order.customization?.photos
      ];

      for (const src of possibleSources) {
        if (Array.isArray(src) && src.length > 0) {
          photos = src;
          break;
        } else if (typeof src === "string" && src.trim() !== "") {
          photos = [src];
          break;
        }
      }

      return {
        id: order.id,
        customerName: order.customerName || order.name || order.shippingAddress?.name || "Customer",
        phone: order.phone || order.shippingAddress?.phone || "—",
        email: order.email || "—",
        address: order.address || order.shippingAddress?.address || "—",
        productName: item.productName || item.name || order.productName || "Custom Keepsake",
        category: item.category || order.category || "Memory Boxes",
        amount: order.totalAmount || order.amount || order.total || 0,
        paymentMethod: order.paymentMethod || "Online",
        paymentStatus: order.paymentStatus || "PAID",
        orderStatus: order.status || order.orderStatus || "PENDING",
        date: new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN"),
        customization: {
          photos: photos,
          customName: item.customName || order.customName || item.customization?.customName,
          customMessage: item.customMessage || order.customMessage || item.customization?.customMessage,
          notes: item.notes || order.notes || item.customization?.notes,
          deliveryDate: item.deliveryDate || order.deliveryDate || item.customization?.deliveryDate,
        },
        internalNotes: order.internalNotes || [],
      };
    });

    return NextResponse.json({
      orders: formattedOrders,
      consultations: [],
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders api:", error);
    return NextResponse.json({ orders: [], consultations: [] }, { status: 200 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, paymentStatus, orderStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (orderStatus) updateData.status = orderStatus;
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