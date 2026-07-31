import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function ShopIndexPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-[#1F1816]">Our Collection</h1>
          <p className="text-[#6E625C] mt-2">Explore our custom handcrafted memory boxes and keepsakes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link href="/shop/custom-memory-box" className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm hover:border-[#C89A84] transition block">
            <h3 className="font-serif font-bold text-lg text-[#1F1816]">Custom Walnut Memory Box</h3>
            <p className="text-sm text-[#6E625C] mt-2">Personalized engraving with real-time preview.</p>
            <span className="inline-block mt-4 text-xs font-semibold text-[#C89A84]">Customize & Buy →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}