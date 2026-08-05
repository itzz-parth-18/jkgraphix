"use client";

import { useState } from "react";

import ShippingForm from "./ShippingForm";
import OrderSummary from "./OrderSummary";

type Props = {
  cart: any;
};

export default function CheckoutClient({
  cart,
}: Props) {
  const [shippingSaved, setShippingSaved] =
    useState(false);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-2xl border border-[#EFE8E2] bg-white p-8 shadow-sm">
        <ShippingForm
          onSaved={() => setShippingSaved(true)}
        />
      </div>

      <div className="rounded-2xl border border-[#EFE8E2] bg-white p-8 shadow-sm">
        <OrderSummary
          cart={cart}
          shippingSaved={shippingSaved}
        />
      </div>
    </div>
  );
}