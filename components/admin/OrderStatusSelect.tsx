"use client";

import { OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  orderId: string;
  currentStatus: OrderStatus;
};

const statuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "DESIGNING",
  "PRINTING",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] =
    useState<OrderStatus>(currentStatus);

  const [loading, setLoading] = useState(false);

  async function updateStatus(
    value: OrderStatus
  ) {
    setLoading(true);

    const response = await fetch(
      `/api/admin/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: value,
        }),
      }
    );

    if (response.ok) {
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="mt-8">

      <label className="mb-2 block text-sm font-medium text-[#1F1816]">
        Update Order Status
      </label>

      <select
        value={status}
        disabled={loading}
        onChange={(e) => {
          const value = e.target.value as OrderStatus;

          setStatus(value);

          updateStatus(value);
        }}
        className="w-full rounded-xl border border-[#D8CFC8] bg-white px-4 py-3"
      >
        {statuses.map((status) => (
          <option
            key={status}
            value={status}
          >
            {status.replaceAll("_", " ")}
          </option>
        ))}
      </select>

    </div>
  );
}