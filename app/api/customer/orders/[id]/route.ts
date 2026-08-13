import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: NextRequest,
  { params }: Params
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        customerDeletedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.customerDeletedAt) {
      return NextResponse.json(
        { message: "Order already deleted" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        customerDeletedAt: new Date(),
      },
      select: {
        id: true,
        customerDeletedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Order deleted successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Customer order deletion error:", error);

    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 }
    );
  }
}