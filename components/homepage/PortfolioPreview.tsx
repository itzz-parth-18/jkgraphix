import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PortfolioPreview() {
  return (
    <section className="bg-[#F9F6F2] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[#1F1816]">
            Our Recent Work
          </h2>

          <p className="mt-3 text-[#6E625C]">
             A small preview of projects we&apos;ve completed.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-[#EFE8E2]"
            >
              <img
                src={`https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop&sig=${item + 50}`}
                alt={`Portfolio ${item}`}
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F1816] px-6 py-3 text-white hover:bg-[#322724]"
          >
            View Portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}