"use client";

import { useState } from "react";

type Props = {
  orderId: string;
};

export default function CustomerOrderDeleteButton({ orderId }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to remove this order from your account?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(`/api/customer/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete order");
      }

      window.location.reload();
    } catch (error) {
      console.error("Delete order error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete order"
      );
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Removing..." : "Delete Order"}
    </button>
  );
}