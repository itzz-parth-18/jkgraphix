import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="bg-[#1F1816] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
          Ready to bring your ideas to life?
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#E7D9D1] sm:mt-5 sm:text-base">
          Explore our products and start your custom printing journey today.
        </p>

        <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
          <Link
            href="/shop"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#C89A84] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#b7856d] sm:w-auto sm:px-8 sm:py-4"
          >
            Shop Now
          </Link>

          <Link
            href="/contact"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white px-6 py-3.5 text-sm text-white transition hover:bg-white hover:text-[#1F1816] sm:w-auto sm:px-8 sm:py-4"
          >
            Contact Us
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}