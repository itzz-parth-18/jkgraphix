"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type CartItem = {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customizations?: Record<string, any>;
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
}: CartDrawerProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleProceedToCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load Razorpay SDK.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId || item.id,
            name: item.name,
            basePrice: item.price,
            quantity: item.quantity,
            imageUrl: item.image,
            customizations: item.customizations || {},
          })),
          customerName: "Parth",
          customerEmail: "parth@example.com",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.razorpayOrderId) {
        alert(data.error || "Order initialization failed!");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Lumière Crafts",
        description: "Customized Keepsake Order",
        order_id: data.razorpayOrderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.dbOrderId,
              }),
            });

            const verifyData = await verifyRes.json().catch(() => null);

            if (verifyRes.ok && verifyData?.success) {
              window.location.href = `/shop/order-success?order_id=${data.dbOrderId || ""}&payment_id=${response.razorpay_payment_id}`;
            } else {
              alert("Verification Failed: " + (verifyData?.error || `HTTP Status ${verifyRes.status}`));
            }
          } catch (verifyError: any) {
            console.error("Verification Error:", verifyError);
            alert("Verification Error: " + verifyError.message);
          }
        },
        prefill: {
          name: "Parth",
          email: "parth@example.com",
        },
        theme: {
          color: "#1c1917",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Checkout failed:", err);
      alert("Something went wrong with checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-espresso/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream border-l border-taupe-border shadow-2xl flex flex-col">
          <div className="p-6 border-b border-taupe-border/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-espresso" />
              <h2 className="font-serif text-lg font-semibold text-espresso">
                Your Gift Cart
              </h2>
              <span className="bg-rose-light text-espresso text-xs font-medium px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-taupe hover:text-espresso transition p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-taupe-light" />
                <p className="font-serif text-lg text-espresso">
                  Your cart is currently empty
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white border border-taupe-border/60 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border border-taupe-border/40"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif font-medium text-sm text-espresso line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-taupe-light hover:text-red-500 transition ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-espresso">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-taupe-border bg-white space-y-4">
              <div className="space-y-2 text-xs text-taupe">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-espresso">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-espresso pt-2 border-t border-taupe-border/40">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={loading}
                className="w-full bg-espresso hover:bg-espresso-hover text-cream py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-soft transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}