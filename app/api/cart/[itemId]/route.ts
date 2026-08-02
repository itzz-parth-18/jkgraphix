import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    itemId: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: Params
) 



{
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { itemId } = await params;

  try {
    const body = await request.json();

    const quantity = Math.max(1, Number(body.quantity));

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update quantity.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { itemId } = await params;

  try {
    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to remove cart item.",
      },
      {
        status: 500,
      }
    );
  }
}