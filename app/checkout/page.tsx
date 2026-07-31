import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl font-bold text-[#1F1816] mb-6">Secure Checkout</h1>
        <div className="bg-white p-8 rounded-2xl border border-[#EFE8E2] shadow-sm">
          <p className="text-[#6E625C]">Checkout form and payment gateway integration ready.</p>
        </div>
      </main>
    </div>
  );
}