import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | JK Graphix",
  description: "Read the terms and conditions for using JK Graphix services and ordering custom products.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      <nav className="sticky top-0 z-40 bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#EFE8E2] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#1F1816] flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#1F1816] text-[#F9F6F2] flex items-center justify-center font-serif font-bold text-xs">JK</div>
            <span>JK Graphix</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </nav>
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-16 space-y-12">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl font-bold text-[#1F1816]">Terms & Conditions</h1>
          <p className="text-[#6E625C] text-lg">
            Please read these terms carefully before using our custom design and printing services.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-8 text-[#6E625C] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">1. General Use</h2>
            <p>By accessing or using our website and services, you agree to comply with and be bound by these terms. You must provide accurate and current information during the account creation and checkout processes.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">2. Customer-Uploaded Content</h2>
            <p>By uploading images, text, or artwork for customization, you confirm that you own the rights to the content or have permission to use it. JK Graphix reserves the right to refuse printing of material that violates copyright laws, is offensive, or goes against our operational guidelines. You retain full ownership of your uploaded files.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">3. Orders and Pricing</h2>
            <p>All prices displayed on the website are subject to change without notice. We reserve the right to cancel or refuse any order due to pricing errors, inventory shortages, or payment issues. In the event of an order cancellation initiated by us, a full refund will be issued.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">4. Product Representations</h2>
            <p>We strive to display colors and customization previews as accurately as possible. However, due to differences in monitor displays and the physical printing process, the final physical product may have slight color variations from what you see on your screen.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">5. Limitation of Liability</h2>
            <p>JK Graphix shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability to you for any damages shall not exceed the amount paid by you for the specific order in question.</p>
          </section>
        </div>
      </main>
    </div>
  );
}