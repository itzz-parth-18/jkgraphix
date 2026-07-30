import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all incoming orders cleanly with type casting
export async function GET() {
  try {
    const dbOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const formattedOrders = dbOrders.map((order) => {
      const item: any = order.items?.[0] || {};
      const customData = (item.customizations as any) || {};

      // Extracting actual photos safely from customizations JSON or item
      let photos: string[] = [];
      if (Array.isArray(customData.photos)) {
        photos = customData.photos;
      } else if (typeof customData.photoUrl === "string") {
        photos = [customData.photoUrl];
      } else if (typeof customData.photo === "string") {
        photos = [customData.photo];
      } else if (Array.isArray(item.photos)) {
        photos = item.photos;
      }

      return {
        id: order.id,
        customerName: order.customerName,
        phone: order.customerPhone || "—",
        email: order.customerEmail || "—",
        address: order.shippingAddress || "—",
        productName: item.product?.name || "Custom Product",
        category: "Memory Boxes",
        amount: Number(order.totalAmount) || 0,
        paymentMethod: "Online",
        paymentStatus: "PAID",
        orderStatus: order.status || "PENDING",
        date: new Date(order.createdAt).toLocaleDateString("en-IN"),
        customization: {
          photos: photos,
          customName: customData.customName || customData.name || "",
          customMessage: customData.customMessage || customData.message || "",
          notes: customData.notes || customData.additionalNotes || "",
          deliveryDate: customData.deliveryDate || "",
        },
        internalNotes: [],
      };
    });

    return NextResponse.json({
      orders: formattedOrders,
      consultations: [],
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders api:", error);
    return NextResponse.json({ orders: [], consultations: [] }, { status: 500 });
  }
}

// PATCH: Update order status
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, orderStatus } = body;
    const finalStatus = status || orderStatus;

    if (!orderId || !finalStatus) {
      return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: finalStatus },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}