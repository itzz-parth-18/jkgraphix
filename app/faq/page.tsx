import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "FAQ | JK Graphix",
  description: "Frequently asked questions about ordering, customization, and shipping.",
};

const faqs = [
  {
    question: "How do I place an order?",
    answer: "You can browse our catalog, select a product, and choose your customization options. For 'Quick Customize' items, you can add your details directly on the page. For 'Design Consultation' items, you can submit a request and our team will coordinate with you before finalizing the design.",
  },
  {
    question: "Can I customize the products with my own photos and text?",
    answer: "Yes! Many of our products allow you to upload your own photos, add custom names, and include personalized messages. The available options will be clearly displayed on each product page.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We use Razorpay as our secure payment gateway, which supports a wide range of payment methods including UPI, Credit/Debit Cards, Net Banking, and popular digital wallets.",
  },
  {
    question: "How do I track my order status?",
    answer: "Once you log in to your account, you can visit the 'Orders' section in your Customer Dashboard. The status will update as your item moves from Pending to Designing, Printing, and finally Shipped.",
  },
  {
    question: "How long does processing and delivery take?",
    answer: "Since our products are personalized and made-to-order, processing times vary depending on the complexity of the design and our current production queue. Delivery times depend entirely on the shipping address.",
  },
];

export default function FAQPage() {
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
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl font-bold text-[#1F1816]">Frequently Asked Questions</h1>
          <p className="text-[#6E625C] text-lg max-w-2xl mx-auto">
            Find answers regarding custom orders, personalization options, and processing times.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white rounded-2xl border border-[#EFE8E2] p-6 open:border-[#C89A84] transition-colors cursor-pointer shadow-sm">
              <summary className="font-serif font-bold text-lg text-[#1F1816] list-none flex justify-between items-center outline-none">
                {faq.question}
                <span className="text-[#C89A84] transition-transform duration-300 group-open:rotate-45 text-2xl leading-none">+</span>
              </summary>
              <p className="mt-4 text-[#6E625C] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </main>
    </div>
  );
}