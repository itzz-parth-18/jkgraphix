import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | JK Graphix",
  description: "Learn how JK Graphix collects, uses, and protects your personal information and custom designs.",
};

export default function PrivacyPage() {
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
          <h1 className="font-serif text-4xl font-bold text-[#1F1816]">Privacy Policy</h1>
          <p className="text-[#6E625C] text-lg">
            We respect your privacy and protect your personal photos and customized data with strict security measures.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-8 text-[#6E625C] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and authentication details when you create an account.</li>
              <li><strong>Order Information:</strong> Shipping address, billing details, and contact numbers required to fulfill your orders.</li>
              <li><strong>Customization Data:</strong> Images, text, and design notes you upload specifically for personalizing your products.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">2. How We Use Your Information</h2>
            <p>We use the collected information strictly for business purposes, including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Processing and fulfilling your custom orders.</li>
              <li>Communicating with you regarding order status, design consultations, or customer support.</li>
              <li>Improving our website, services, and overall customer experience.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">3. Payment Processing</h2>
            <p>We do not store your credit card or sensitive payment details on our servers. All online transactions are processed securely through our authorized third-party payment gateway (Razorpay), which adheres to strict industry security standards.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">4. Data Security & File Uploads</h2>
            <p>The photos and designs you upload are stored securely. We only access these files for the purpose of printing and fulfilling your specific order. We do not use your personal uploaded artwork for marketing without your explicit permission.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#1F1816]">5. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or wish to manage your personal data, please reach out to us via our Contact page.</p>
          </section>
        </div>
      </main>
    </div>
  );
}