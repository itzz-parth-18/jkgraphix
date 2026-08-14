import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch active orders for admin
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const dbOrders = await prisma.order.findMany({
      where: {
        adminDeletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const formattedOrders: any[] = [];
    const formattedConsultations: any[] = [];

    dbOrders.forEach((order) => {
      const item: any = order.items?.[0] || {};
      const customData = (item.customizations as any) || {};

      let photos: string[] = [];
      if (Array.isArray(customData.photos)) {
        photos = customData.photos;
      } else if (typeof customData.photo_upload === "string") {
        photos = [customData.photo_upload];
      } else if (typeof customData.photoUrl === "string") {
        photos = [customData.photoUrl];
      } else if (typeof customData.photo === "string") {
        photos = [customData.photo];
      }

      const productCategory = item.product?.category;
      const categoryName =
        typeof productCategory === "string"
          ? productCategory
          : productCategory?.name || "Uncategorized";

      // Bulletproof check: Look at BOTH the category and the product.
      // Convert to uppercase to handle any Prisma enum variations (like DESIGN_CONSULTATION).
      const pType = String(item.product?.productType || "").toUpperCase();
      const cType = String(productCategory?.type || "").toUpperCase();

      const isConsultation = pType.includes("CONSULTATION") || cType.includes("CONSULTATION");

      if (isConsultation) {
        formattedConsultations.push({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          phone: order.customerPhone || "—",
          email: order.customerEmail || "—",
          // ADD THIS LINE BELOW:
          whatsappNumber: customData.whatsappNumber || customData.whatsapp || customData.phone || "Not provided",
          productName: item.product?.name || "Custom Product",
          category: categoryName,
          description: customData.notes || customData.description || "No description provided",
          referenceImages: photos,
          budget: customData.budget || "Not specified",
          preferredDeliveryDate: customData.deliveryDate || customData.anniversary_date || "Not specified",
          orderStatus: order.status || "PENDING",
          paymentStatus: order.paymentStatus,
          amount: Number(order.totalAmount) || 0,
          date: new Date(order.createdAt).toLocaleDateString("en-IN"),
          internalNotes: [],
        });
      } else {
        formattedOrders.push({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          phone: order.customerPhone || "—",
          email: order.customerEmail || "—",
          address: order.shippingAddress || "—",
          productName: item.product?.name || "Custom Product",
          category: categoryName,
          amount: Number(order.totalAmount) || 0,
          paymentMethod: "Online",
          paymentStatus: order.paymentStatus,
          orderStatus: order.status || "PENDING",
          date: new Date(order.createdAt).toLocaleDateString("en-IN"),
          customization: {
            photos,
            customName:
              customData.customName ||
              customData.name ||
              customData.engraving_names ||
              "",
            customMessage:
              customData.customMessage ||
              customData.message ||
              customData.card_message ||
              "",
            notes: customData.notes || customData.additionalNotes || "",
            deliveryDate: customData.deliveryDate || customData.anniversary_date || "",
          },
          internalNotes: [],
        });
      }
    });

    return NextResponse.json(
      {
        orders: formattedOrders,
        consultations: formattedConsultations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders API:", error);

    return NextResponse.json(
      {
        orders: [],
        consultations: [],
      },
      { status: 500 }
    );
  }
}

// PATCH: Update order status
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { orderId, status, orderStatus } = body;

    const finalStatus = status || orderStatus;

    if (!orderId || !finalStatus) {
      return NextResponse.json(
        { error: "Missing orderId or status" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: finalStatus,
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error updating order status:", error);

    return NextResponse.json(
      { error: error.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}

// DELETE: Soft-delete an order from the admin order list
export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        adminDeletedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.adminDeletedAt) {
      return NextResponse.json(
        { error: "Order has already been deleted by admin" },
        { status: 409 }
      );
    }

    const deletedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        adminDeletedAt: new Date(),
        adminDeletedById: session.user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        order: deletedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting order:", error);

    return NextResponse.json(
      { error: error.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}