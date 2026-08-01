import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#EFE8E2]/60 border-b border-[#EFE8E2] py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#C89A84]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#1F1816]">
            <SparklesIconCustom className="h-3.5 w-3.5 text-[#C89A84]" />
            Custom Perfection, Tailored To Your Vision
          </span>

          <h1 className="font-serif text-4xl font-semibold leading-tight text-[#1F1816] sm:text-5xl lg:text-6xl">
            Gifts engraved with{" "}
            <span className="italic text-[#C89A84]">
              their story
            </span>
            , not just their name.
          </h1>

          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-[#6E625C] sm:text-lg lg:mx-0">
            Transform cherished dates, handwritten notes, and unforgettable
            photos into timeless heirloom keepsake memory boxes and custom
            gifts.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
            <Link
              href="/shop/custom-memory-box"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F1816] px-8 py-4 text-sm font-medium text-white shadow-md transition-all hover:bg-[#322724] active:scale-[0.99] sm:w-auto"
            >
              Customize Your Gift
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/shop"
              className="flex w-full items-center justify-center rounded-xl border-2 border-[#C89A84] bg-transparent px-8 py-4 text-sm font-medium text-[#1F1816] transition-all hover:bg-[#EFE8E2] sm:w-auto"
            >
              Browse Collection
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#C89A84]/30 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"
              alt="Handcrafted Custom Gift Memory Box"
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-[#EFE8E2] bg-white/95 p-4 backdrop-blur-md">
              <div>
                <p className="font-serif text-sm font-semibold text-[#1F1816]">
                  Walnut Memory Box
                </p>

                <p className="text-xs text-[#6E625C]">
                  Custom gold leaf engraving
                </p>
              </div>

              <span className="font-serif text-sm font-medium italic text-[#C89A84]">
                Made Just For You
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SparklesIconCustom({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}