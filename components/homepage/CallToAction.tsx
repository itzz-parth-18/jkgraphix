import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="bg-[#1F1816] py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-serif font-bold text-white">
          Ready to bring your ideas to life?
        </h2>

        <p className="mt-5 text-[#E7D9D1]">
          Explore our products and start your custom printing journey today.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="rounded-xl bg-[#C89A84] px-8 py-4 font-medium text-white transition hover:bg-[#b7856d]"
          >
            Shop Now
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white px-8 py-4 text-white transition hover:bg-white hover:text-[#1F1816]"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}