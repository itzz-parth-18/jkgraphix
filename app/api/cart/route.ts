import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/lib/cart";

export async function GET() {
  try {
  const cart = await getCart();

  if (!cart) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json(cart);
} catch (error: any) {
  console.error("POST /api/cart ERROR:");
  console.error(error);

  return NextResponse.json(
    {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
    },
    { status: 500 }
  );
}
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const {
      productId,
      quantity,
      customizations,
    } = body;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        cart: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    let cart = user.cart;

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }

    const existingItems = await prisma.cartItem.findMany({
  where: {
    cartId: cart.id,
    productId,
  },
});

const matchingItem = existingItems.find(
  (item) =>
    JSON.stringify(item.customizations ?? {}) ===
    JSON.stringify(customizations ?? {})
);

if (matchingItem) {
  const updatedItem = await prisma.cartItem.update({
    where: {
      id: matchingItem.id,
    },
    data: {
      quantity: matchingItem.quantity + (quantity ?? 1),
    },
  });

  return NextResponse.json(updatedItem);
}

const cartItem = await prisma.cartItem.create({
  data: {
    cartId: cart.id,
    productId,
    quantity: quantity ?? 1,
    customizations,
  },
});

return NextResponse.json(cartItem);
  } 
  
  catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to add item to cart." },
      { status: 500 }
    );
  }
}