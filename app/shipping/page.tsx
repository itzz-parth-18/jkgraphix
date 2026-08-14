import Link from "next/link";
import { ArrowLeft, Clock, AlertTriangle, Truck, CheckCircle2, Info, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "Learn about JK Graphix shipping methods, dispatch timelines, and delivery policies across India.",
  openGraph: {
    title: "Shipping & Delivery Policy | JK Graphix",
    description: "Learn about JK Graphix shipping methods, dispatch timelines, and delivery policies across India.",
    url: "/shipping",
  },
};

export default function ShippingPage() {
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
            <Truck className="w-8 h-8 text-[#C89A84]" /> Shipping & Delivery Policy
          </h1>
          <p className="text-[#6E625C] text-lg leading-relaxed">
            At JK Graphix, every personalized gift is made specially for you after your order is placed. Since every product is custom-made, production requires dedicated time before dispatch. 
            <br className="hidden md:block" />
            <span className="text-sm italic mt-2 block">Note: Working days exclude Sundays and public holidays.</span>
          </p>
        </div>

        {/* Section 1: Timeline Table */}
        <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1F1816] flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#C89A84]" /> 1. Shipping Options & Timeline
          </h2>
          <p className="text-[#6E625C]">The total delivery time consists of Production Time (manufacturing) and Transit Time (courier delivery).</p>
          
          <div className="overflow-x-auto rounded-xl border border-[#EFE8E2]">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#F9F6F2] border-b border-[#EFE8E2] text-[#1F1816] font-serif text-sm">
                  <th className="p-4 font-bold">SHIPPING OPTION</th>
                  <th className="p-4 font-bold">PRODUCTION TIME</th>
                  <th className="p-4 font-bold">TRANSIT TIME</th>
                  <th className="p-4 font-bold">TOTAL DELIVERY TIME</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-[#EFE8E2] hover:bg-[#F9F6F2]/50 transition-colors">
                  <td className="p-4 font-semibold text-[#1F1816]">Standard Shipping</td>
                  <td className="p-4 text-[#6E625C]">3-5 Working Days</td>
                  <td className="p-4 text-[#6E625C]">5-7 Working Days</td>
                  <td className="p-4 font-semibold text-[#C89A84]">8-12 Working Days</td>
                </tr>
                <tr className="hover:bg-[#F9F6F2]/50 transition-colors">
                  <td className="p-4 font-semibold text-[#1F1816]">Express Production</td>
                  <td className="p-4 text-[#6E625C]">1-2 Working Days</td>
                  <td className="p-4 text-[#6E625C]">5-7 Working Days</td>
                  <td className="p-4 font-semibold text-[#C89A84]">6-9 Working Days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#F9F6F2] border-l-4 border-[#C89A84] p-4 rounded-r-xl mt-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#C89A84] shrink-0 mt-0.5" />
            <p className="text-sm text-[#6E625C]">
              <strong className="text-[#1F1816]">Important Note:</strong> Express Production only prioritizes the manufacturing of your order. It does not guarantee faster courier delivery. Once dispatched, delivery speed depends entirely on the courier partner and your location.
            </p>
          </div>
        </section>

        {/* Section 2: Order Status */}
        <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1F1816] flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#C89A84]" /> 2. Order Status & Tracking
          </h2>
          <p className="text-[#6E625C]">Your order will progress through the following stages:</p>
          
          <ul className="space-y-4">
            {[
              { title: "Order Placed", desc: "Your order and payment have been successfully received." },
              { title: "Under Production", desc: "Your personalized product is currently being manufactured." },
              { title: "Ready to Ship", desc: "Your order has been completed, packed, and is awaiting courier pickup." },
              { title: "Shipped / Dispatched", desc: "Your parcel has been handed over to the courier partner and tracking details are generated." }
            ].map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C89A84] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#1F1816] block md:inline">{step.title}:</strong>
                  <span className="text-[#6E625C] md:ml-2 text-sm md:text-base">{step.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 3: Coverage & Delays */}
        <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1F1816]">3. Shipping Coverage & Delays</h2>
          <p className="text-[#6E625C]">
            We currently deliver across India. Delivery to remote locations may require additional transit time. The timelines mentioned are estimates only. While we work closely with courier partners, delays caused by weather conditions, festivals, or natural disasters are beyond our control.
          </p>
          
          <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Courier Delays
            </h4>
            <p className="text-red-700/80 text-sm">Courier delays are <strong>not eligible</strong> for:</p>
            <ul className="list-disc pl-5 text-sm text-red-700/80 space-y-1">
              <li>Refunds or Returns</li>
              <li>Compensation</li>
              <li>Cancellation of already dispatched orders</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Address Issues & Reshipping */}
        <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1F1816]">4. Incorrect Address & Failed Delivery</h2>
          <p className="text-[#6E625C]">
            Customers are responsible for providing complete and accurate shipping information. If a parcel is returned to us due to an incomplete address, wrong PIN code, or customer unavailability, the customer will be responsible for <strong>Reshipping Charges</strong>.
          </p>
          
          <div className="bg-[#1F1816] text-[#F9F6F2] p-6 rounded-2xl space-y-2 shadow-md">
            <h4 className="font-serif text-lg font-bold text-[#C89A84]">Reshipping Fee Structure</h4>
            <p className="text-sm text-gray-300">
              The parcel will be resent only after the applicable Return Shipping + Reshipping charges have been paid. The exact amount depends on the parcel weight, dimensions, and destination.
            </p>
          </div>
        </section>

        {/* Section 5: Support */}
        <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm flex flex-col items-center text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#1F1816]">Need Help?</h2>
          <p className="text-[#6E625C]">If you have any questions regarding your shipping or tracking, our artisan support team is happy to assist.</p>
          <a href="mailto:support.jkgraphix@gmail.com" className="mt-2 inline-flex items-center gap-2 bg-[#1F1816] text-white px-6 py-3 rounded-xl hover:bg-[#C89A84] transition-colors font-medium">
            <Mail className="w-5 h-5" /> support.jkgraphix@gmail.com
          </a>
        </section>

      </main>
    </div>
  );
}