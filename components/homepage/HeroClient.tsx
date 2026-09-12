"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import CustomizeModal from "./CustomizeModal";

type Props = {
  productUrl: string;
  productName: string;
  productImage: string;
  productPrice: string;
};

export default function HeroClient({
  productUrl,
  productName,
  productImage,
  productPrice,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#EFE8E2] bg-[#EFE8E2]/60 px-3.5 py-7 sm:px-6 sm:py-14 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">

          {/* Mobile Badge */}
          <div className="mb-5 flex justify-center lg:hidden">
            <span className="inline-flex max-w-full items-center justify-center gap-1.5 rounded-full bg-[#C89A84]/15 px-3 py-1.5 text-[8px] font-semibold uppercase leading-tight tracking-[0.08em] text-[#1F1816] sm:px-4 sm:py-2 sm:text-xs">
              <SparklesIconCustom className="h-3 w-3 shrink-0 text-[#C89A84]" />
              <span>Custom Perfection, Tailored To Your Vision</span>
            </span>
          </div>

          <div className="grid grid-cols-[1.15fr_0.85fr] items-center gap-3 sm:gap-6 lg:grid-cols-12 lg:gap-12">

            {/* Content */}
            <div className="min-w-0 space-y-3.5 text-left sm:space-y-5 lg:col-span-7 lg:space-y-6 lg:text-left">

              {/* Desktop Badge */}
              <span className="hidden items-center gap-2 rounded-full bg-[#C89A84]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#1F1816] lg:mx-0 lg:inline-flex">
                <SparklesIconCustom className="h-3.5 w-3.5 shrink-0 text-[#C89A84]" />
                <span>Custom Perfection, Tailored To Your Vision</span>
              </span>

              <h1 className="font-serif text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.02em] text-[#1F1816] sm:text-4xl sm:leading-tight lg:text-6xl">
                Gifts engraved with{" "}
                <span className="italic text-[#C89A84]">their story</span>,
                not just their name.
              </h1>

              <p className="text-[11px] leading-5 text-[#6E625C] sm:text-base sm:leading-relaxed lg:max-w-[620px] lg:text-lg">
                Transform cherished dates, handwritten notes, and unforgettable
                photos into timeless heirloom keepsake memory boxes and custom
                gifts.
              </p>

              {/* Buttons */}
              <div className="flex w-full flex-col gap-2 pt-1 sm:flex-row sm:gap-3 sm:pt-3 lg:gap-4 lg:pt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#1F1816] px-3 py-2.5 text-[10px] font-medium text-white shadow-md transition-all hover:bg-[#322724] active:scale-[0.99] sm:min-h-12 sm:w-auto sm:rounded-xl sm:px-6 sm:py-3.5 sm:text-sm lg:px-8 lg:py-4"
                >
                  <span>Customize Gift</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                </button>

                <Link
                  href="/shop"
                  className="flex min-h-10 w-full items-center justify-center rounded-lg border-2 border-[#C89A84] bg-transparent px-3 py-2.5 text-[10px] font-medium text-[#1F1816] transition-all hover:bg-[#EFE8E2] sm:min-h-12 sm:w-auto sm:rounded-xl sm:px-6 sm:py-3.5 sm:text-sm lg:px-8 lg:py-4"
                >
                  Browse Collection
                </Link>
              </div>
            </div>

            {/* Product Image */}
            <div className="w-full lg:col-span-5">
              <Link
                href={productUrl}
                className="group mx-auto block w-full max-w-[145px] sm:max-w-[280px] lg:max-w-none"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-[#C89A84]/30 shadow-xl transition-transform duration-500 sm:rounded-2xl lg:rounded-3xl lg:shadow-2xl group-hover:scale-[1.02]">

                  <Image
                    src={productImage}
                    alt={productName}
                    fill
                    priority
                    sizes="(max-width: 639px) 40vw, (max-width: 1023px) 35vw, 42vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Product Info */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 rounded-lg border border-[#EFE8E2]/50 bg-white/95 p-1.5 shadow-lg backdrop-blur-md sm:bottom-2 sm:left-2 sm:right-2 sm:rounded-xl sm:p-2.5 lg:bottom-4 lg:left-4 lg:right-4 lg:p-4">
                    <div className="min-w-0 overflow-hidden pr-0.5">
                      <p className="truncate font-serif text-[7px] font-semibold text-[#1F1816] sm:text-[10px] lg:text-sm">
                        {productName}
                      </p>

                      <p className="hidden truncate text-[7px] text-[#6E625C] sm:block sm:text-[9px] lg:text-xs">
                        Featured Collection
                      </p>
                    </div>

                    <span className="shrink-0 rounded-md bg-[#F9F6F2] px-1.5 py-0.5 font-serif text-[7px] font-semibold text-[#C89A84] sm:px-2 sm:py-1 sm:text-[10px] lg:rounded-lg lg:px-3 lg:py-1 lg:text-sm">
                      {productPrice}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CustomizeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

function SparklesIconCustom({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1 1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}