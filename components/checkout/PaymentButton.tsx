"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  shippingSaved: boolean;
};

export default function PaymentButton({
  shippingSaved,
}: Props) {
  async function handlePayment() {
    if (!shippingSaved) {
      return;
    }

    try {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
      });

      if (!response.ok) {
  window.location.href = "/checkout/failed";
  return;
}

      const order = await response.json();

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "JK Graphix",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response: any) {
          const verifyResponse = await fetch(
            "/api/payment/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            }
          );

          const result = await verifyResponse.json();

if (result.success) {
  window.location.href = `/checkout/success?order=${result.orderNumber}`;
} else {
  window.location.href = "/checkout/failed";
}
        },

        prefill: {},

        theme: {
          color: "#1F1816",
        },
      });

      razorpay.open();
    } catch (error) {
  console.error(error);
  window.location.href = "/checkout/failed";
}
  }

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={!shippingSaved}
      className={`w-full rounded-xl px-6 py-3 text-white transition ${
        shippingSaved
          ? "bg-[#1F1816] hover:bg-[#2C2320]"
          : "cursor-not-allowed bg-gray-400"
      }`}
    >
      {shippingSaved
        ? "Proceed to Payment"
        : "Save Shipping Information First"}
    </button>
  );
}