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
  const [shippingSaved, setShippingSaved] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);

  function handleShippingSaved(cost: number) {
    setShippingCost(cost);
    setShippingSaved(true);
  }

  return (
    <div className="grid gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      {/* Shipping */}
      <div className="rounded-2xl border border-[#EFE8E2] bg-white p-4 shadow-sm sm:p-6 lg:col-span-2 lg:p-8">
        <ShippingForm
          cart={cart}
          onSaved={handleShippingSaved}
        />
      </div>

      {/* Order Summary */}
      <div className="rounded-2xl border border-[#EFE8E2] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <OrderSummary
          cart={cart}
          shippingSaved={shippingSaved}
          shippingCost={shippingCost}
        />
      </div>
    </div>
  );
}