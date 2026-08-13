import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = Promise<{
  id: string;
}>;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        adminDeletedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.adminDeletedAt) {
      return NextResponse.json(
        { message: "Order already deleted by admin" },
        { status: 409 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        adminDeletedAt: new Date(),
        adminDeletedById: admin.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      orderId: updatedOrder.id,
    });
  } catch (error) {
    console.error("Error deleting order:", error);

    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 }
    );
  }
}