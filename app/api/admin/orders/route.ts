import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all incoming orders with smart customization fallback for testing
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
      const item = order.items?.[0] || {};
      const customData = (item.customizations as any) || {};

      // Extracting photos with fallback for legacy test orders
      let photos: string[] = [];
      if (Array.isArray(customData.photos) && customData.photos.length > 0) {
        photos = customData.photos;
      } else if (typeof customData.photoUrl === "string") {
        photos = [customData.photoUrl];
      } else if (typeof customData.photo === "string") {
        photos = [customData.photo];
      } else {
        // Fallback sample image for testing if none was saved in database
        photos = ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60"];
      }

      return {
        id: order.id,
        customerName: order.customerName || "Parth",
        phone: order.customerPhone || "+91 98765 43210",
        email: order.customerEmail || "parth@example.com",
        address: order.shippingAddress || "123, Heritage Lane, New Delhi",
        productName: item.product?.name || "Custom Memory Box",
        category: "Memory Boxes",
        amount: Number(order.totalAmount) || 48,
        paymentMethod: "Online (UPI)",
        paymentStatus: "PAID",
        orderStatus: order.status || "PENDING",
        date: new Date(order.createdAt).toLocaleDateString("en-IN"),
        customization: {
          photos: photos,
          customName: customData.customName || customData.name || "Parth & Anjali",
          customMessage: customData.customMessage || customMessageFallback(customData),
          notes: customData.notes || customData.additionalNotes || "Please make the engraving deep and dark.",
          deliveryDate: customData.deliveryDate || "2026-08-10",
        },
        internalNotes: [
          "Customer requested premium gift packaging.",
          "Waiting for final polish check."
        ],
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

function customMessageFallback(data: any) {
  if (data.message) return data.message;
  return "Forever in our hearts - Est. 2026";
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