"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CartSync() {
  const router = useRouter();

  useEffect(() => {
    const pendingItem = localStorage.getItem("pending_cart_item");
    if (pendingItem) {
      try {
        const itemData = JSON.parse(pendingItem);
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        }).then((res) => {
          if (res.ok) {
            localStorage.removeItem("pending_cart_item");
            router.refresh(); // Refresh page data to display the synced cart item instantly
          }
        });
      } catch (e) {
        console.error("Failed to sync pending cart item", e);
      }
    }
  }, [router]);

  return null;
}