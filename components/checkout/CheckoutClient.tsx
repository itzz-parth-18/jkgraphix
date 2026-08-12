"use client";

import { useState, useEffect } from "react";
import ShippingForm from "./ShippingForm";
import OrderSummary from "./OrderSummary";

type Props = {
  cart: any;
};

export default function CheckoutClient({
  cart,
}: Props) {
  const [shippingSaved, setShippingSaved] = useState(false);
  const [prefilledWhatsapp, setPrefilledWhatsapp] = useState("");

  // Product page se save kiya hua WhatsApp number fetch kar rahe hain
  useEffect(() => {
    const savedNumber = localStorage.getItem("checkout_whatsapp");
    if (savedNumber) {
      setPrefilledWhatsapp(savedNumber);
    }
  }, []);

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