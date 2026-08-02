"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

type Cart = {
  id: string;
  items: any[];
};

export default function CartPage() {
  const { status } = useSession();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  
  async function fetchCart() {
  try {
    const res = await fetch("/api/cart");

    if (!res.ok) {
      setCart(null);
      return;
    }

    const data = await res.json();

    setCart(data);
  } finally {
    setLoading(false);
  }
}

async function updateQuantity(
  itemId: string,
  quantity: number
) {
  await fetch(`/api/cart/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity,
    }),
  });

  fetchCart();
}

async function removeItem(itemId: string) {
  await fetch(`/api/cart/${itemId}`, {
    method: "DELETE",
  });

  fetchCart();
}

const items = cart?.items ?? [];

const itemCount = items.reduce(
  (sum, item) => sum + item.quantity,
  0
);

const total = items.reduce(
  (sum, item) =>
    sum +
    Number(item.product.basePrice) * item.quantity,
  0
);

if (loading) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <p className="text-center text-[#6E625C]">
        Loading your cart...
      </p>
    </div>
  );
}

if (!cart || items.length === 0) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <EmptyCart />
    </div>
  );
}

return (
  <div className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="mb-8 text-3xl font-serif font-semibold text-[#1F1816]">
      Shopping Cart
    </h1>

    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CartList
          items={items}
          onIncrease={(id, quantity) =>
            updateQuantity(id, quantity + 1)
          }
          onDecrease={(id, quantity) =>
            updateQuantity(id, Math.max(1, quantity - 1))
          }
          onRemove={removeItem}
        />
      </div>

      <div>
        <CartSummary
          itemCount={itemCount}
          total={total}
          isAuthenticated={status === "authenticated"}
        />
      </div>
    </div>
  </div>
);
}