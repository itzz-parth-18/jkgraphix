import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function ShopIndexPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      <nav className="sticky top-0 z-40 bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#EFE8E2] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#1F1816] flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#1F1816] text-[#F9F6F2] flex items-center justify-center font-serif font-bold text-xs">JK</div>
            <span>JK Graphix</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84]">Home</Link>
            <Link href="/cart" className="bg-[#1F1816] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#322724] flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Cart
            </Link>
          </div>
        </div>
      </nav>
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