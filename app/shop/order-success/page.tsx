"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, Heart, PackageCheck } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "LCM-84920";
  const paymentId = searchParams.get("payment_id") || "pay_P1o9Xz2mK8";

  return (
    <div className="min-h-screen bg-cream py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white border border-taupe-border/80 rounded-2xl p-8 sm:p-10 shadow-soft space-y-8 text-center">
        
        {/* Success Icon Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-sage/10 text-sage rounded-full flex items-center justify-center border border-sage/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-700" />
          </div>
          <span className="text-xs uppercase tracking-widest text-taupe font-medium">
            Payment Confirmed
          </span>
          <h1 className="font-serif text-3xl font-semibold text-espresso">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-taupe max-w-md">
            We’ve received your customized request. Our artisans at Lumière Crafts are preparing your keepsake with love and precision.
          </p>
        </div>

        {/* Order & Payment Receipt Box */}
        <div className="bg-cream-dark/40 border border-taupe-border/50 rounded-xl p-5 text-left space-y-3">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-taupe-border/40">
            <span className="text-taupe">Order Reference</span>
            <span className="font-mono font-semibold text-espresso">{orderId}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-taupe-border/40">
            <span className="text-taupe">Transaction ID</span>
            <span className="font-mono font-medium text-espresso">{paymentId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-taupe">Status</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Processing Order
            </span>
          </div>
        </div>

        {/* What Happens Next Steps */}
        <div className="text-left space-y-4">
          <h3 className="font-serif text-sm font-semibold text-espresso flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-espresso" />
            What Happens Next?
          </h3>
          <ul className="text-xs text-taupe space-y-2.5 list-disc list-inside">
            <li>
              A confirmation email with tax details has been dispatched to your inbox.
            </li>
            <li>
              Custom details review is underway before precision engraving/crafting.
            </li>
            <li>
              Tracking updates will be sent via SMS & email once shipped.
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="flex-1 bg-espresso hover:bg-espresso-hover text-cream py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition active:scale-[0.99] shadow-soft"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 border border-taupe-border bg-white hover:bg-cream-dark/50 text-espresso py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brand Note */}
        <div className="pt-4 border-t border-taupe-border/40 flex items-center justify-center gap-1.5 text-xs text-taupe-light">
          Crafted with care by Lumière Crafts <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center text-espresso font-serif">
          Loading order details...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}