import Link from "next/link";
import { ArrowLeft, RefreshCcw, XCircle, AlertCircle, CreditCard, Camera } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Read our policies regarding order cancellations, replacements, and refunds for customized products at JK Graphix.",
  openGraph: {
    title: "Refund & Cancellation Policy | JK Graphix",
    description: "Read our policies regarding order cancellations, replacements, and refunds for customized products at JK Graphix.",
    url: "/refund",
  },
};

export default function RefundPolicyPage() {
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
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-16 space-y-10">
        
        {/* Header & Intro */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="font-serif text-4xl font-bold text-[#1F1816] flex items-center justify-center md:justify-start gap-3">
            <RefreshCcw className="w-8 h-8 text-[#C89A84]" /> Refund & Cancellation
          </h1>
          <p className="text-[#6E625C] text-lg leading-relaxed">
            Due to the highly personalized nature of the keepsakes we create at JK Graphix, our refund and cancellation policies are strictly tailored to custom-printing industry standards.
          </p>
        </div>

        {/* Section 1: Cancellations */}
        <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1F1816] flex items-center gap-2">
            <XCircle className="w-6 h-6 text-[#C89A84]" /> 1. Order Cancellations
          </h2>
          
          <div className="space-y-4 text-[#6E625C]">
            <p>
              <strong className="text-[#1F1816]">Before Production (Pending Status):</strong> If you need to cancel an order, please contact us immediately. If your order has not yet entered the design or printing phase, we can cancel the order and issue a full refund.
            </p>
            
            <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl mt-4">
              <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" /> During / After Production
              </h4>
              <p className="text-orange-700/90 text-sm">
                Once an order status shifts to "Designing" or "Printing", raw materials and artisan labor have already been allocated to your specific custom request. Therefore, <strong>orders in production cannot be canceled or refunded under any circumstances.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Replacements & Refunds */}
        <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1F1816] flex items-center gap-2">
            <RefreshCcw className="w-6 h-6 text-[#C89A84]" /> 2. Returns & Replacements
          </h2>
          <p className="text-[#6E625C]">
            Because products are customized with your provided photos and text, we do not accept returns or offer refunds for a "change of mind".
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="border border-green-100 bg-green-50/30 p-5 rounded-2xl space-y-3">
              <h4 className="font-bold text-green-800">✅ Eligible for Replacement</h4>
              <ul className="list-disc pl-5 text-sm text-green-700/90 space-y-2">
                <li>The item arrived physically damaged during transit.</li>
                <li>There is a clear manufacturing defect.</li>
                <li>A printing error occurred on our part (e.g., we printed a different name than what you submitted).</li>
              </ul>
            </div>
            
            <div className="border border-red-100 bg-red-50/30 p-5 rounded-2xl space-y-3">
              <h4 className="font-bold text-red-800">❌ Not Eligible</h4>
              <ul className="list-disc pl-5 text-sm text-red-700/90 space-y-2">
                <li>Spelling or grammatical mistakes submitted by the customer.</li>
                <li>Poor print quality due to uploading low-resolution images.</li>
                <li>Slight color variations between screen display and physical print.</li>
                <li>Delays caused by courier services.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Failed Payments */}
        <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#1F1816] flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#C89A84]" /> 3. Failed or Duplicate Payments
          </h2>
          <p className="text-[#6E625C] leading-relaxed">
            If your payment fails but money is debited from your account, or if a duplicate payment occurs due to network issues, our payment gateway (Razorpay) typically auto-reverses the transaction to your original payment method. This standard banking process usually takes <strong>5-7 business days</strong>.
          </p>
        </section>

        {/* Section 4: Resolution Process */}
        <section className="bg-[#1F1816] text-[#F9F6F2] p-8 md:p-12 rounded-3xl shadow-md space-y-4 flex flex-col items-center text-center">
          <Camera className="w-10 h-10 text-[#C89A84] mb-2" />
          <h2 className="font-serif text-2xl font-bold text-white">How to Request a Resolution</h2>
          <p className="text-gray-300 max-w-2xl text-sm md:text-base leading-relaxed">
            If you believe you are eligible for a replacement due to a defect or transit damage, please contact us within <strong>48 hours of delivery</strong>. Include your Order Number and clear photographs of the unboxing/damage so our artisan team can assist you swiftly.
          </p>
          <a href="mailto:support@jkgraphix.com" className="mt-4 inline-block bg-[#C89A84] text-[#1F1816] px-8 py-3 rounded-xl hover:bg-white transition-colors font-bold">
            Email Support
          </a>
        </section>

      </main>
    </div>
  );
}