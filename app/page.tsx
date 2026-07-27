"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Gift, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream text-espresso">
      {/* Top Brand Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-taupe-border/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-espresso flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose" /> Lumière Crafts
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/shop/custom-memory-box"
              className="text-xs font-semibold text-espresso hover:text-rose transition"
            >
              Shop Memory Box
            </Link>
            <Link
              href="/admin/orders"
              className="bg-espresso text-cream text-xs font-medium px-4 py-2 rounded-lg hover:bg-espresso-hover transition"
            >
              Workshop Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cream-dark/60 border-b border-taupe-border/50 py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-rose-light text-espresso px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-rose" /> Handcrafted Personalizations
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-espresso">
              Gifts engraved with <span className="italic text-rose">their story</span>, not just their name.
            </h1>

            <p className="text-taupe text-base sm:text-lg max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              Transform cherished dates, handwritten notes, and unforgettable photos into timeless heirloom keepsake memory boxes and custom gifts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/shop/custom-memory-box"
                className="w-full sm:w-auto bg-espresso hover:bg-espresso-hover text-cream px-8 py-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-soft transition active:scale-[0.99]"
              >
                Customize Memory Box
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/admin/orders"
                className="w-full sm:w-auto bg-white border border-taupe-border hover:bg-cream-dark text-espresso px-6 py-4 rounded-xl text-sm font-medium flex items-center justify-center transition shadow-sm"
              >
                Workshop Dashboard
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-taupe-border/80">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"
                alt="Handcrafted Custom Gift Memory Box"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-cream/95 backdrop-blur-md p-4 rounded-xl border border-taupe-border/60 flex items-center justify-between">
                <div>
                  <p className="font-serif text-sm font-semibold text-espresso">Walnut Memory Box</p>
                  <p className="text-xs text-taupe">Custom gold leaf engraving</p>
                </div>
                <span className="font-serif font-bold text-sm text-espresso">$48.00</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Features Banner */}
      <section className="py-10 bg-white border-b border-taupe-border/50 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-cream-dark rounded-xl">
              <Gift className="w-6 h-6 text-rose" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-espresso">Live Real-Time Preview</h4>
              <p className="text-xs text-taupe mt-0.5">Instant photo & text previews before ordering</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-cream-dark rounded-xl">
              <Truck className="w-6 h-6 text-rose" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-espresso">Fast Workshop Dispatch</h4>
              <p className="text-xs text-taupe mt-0.5">Handcrafted & shipped in 2–3 business days</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-cream-dark rounded-xl">
              <ShieldCheck className="w-6 h-6 text-rose" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-espresso">Artisan Guarantee</h4>
              <p className="text-xs text-taupe mt-0.5">100% satisfaction on engraving precision</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}