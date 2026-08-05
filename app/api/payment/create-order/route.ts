import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { razorpay } from "@/lib/razorpay";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return NextResponse.json(
      { error: "Cart is empty." },
      { status: 400 }
    );
  }

  const amount = cart.items.reduce(
    (total, item) =>
      total +
      Number(item.product.basePrice) * item.quantity,
    0
  );

  const order = await razorpay.orders.create({
  amount: Math.round(amount * 100),
  currency: "INR",
  receipt: cart.id,
});

  return NextResponse.json(order);
}