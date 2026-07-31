import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 mx-auto text-[#C89A84]" />
        <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Your Cart is Empty</h1>
        <p className="text-[#6E625C]">Looks like you haven't added any custom gifts yet.</p>
        <div className="pt-4">
          <Link href="/shop" className="bg-[#1F1816] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-[#322724] transition">
            Browse Collection
          </Link>
        </div>
      </main>
    </div>
  );
}