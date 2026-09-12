import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PortfolioPreview() {
  // Fetch latest 4 published portfolio items from database
  const portfolioItems = await prisma.portfolioItem
    .findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    })
    .catch(() => []);

  return (
    <section className="bg-[#F9F6F2] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <h2 className="text-2xl font-bold text-[#1F1816] sm:text-3xl">
            Our Recent Work
          </h2>

          <p className="mt-2 text-sm text-[#6E625C] sm:mt-3 sm:text-base">
            A small preview of projects we&apos;ve completed.
          </p>
        </div>

        {portfolioItems.length === 0 ? (
          <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-[#EFE8E2] bg-white p-8 text-center shadow-sm sm:p-12">
            <Briefcase className="mx-auto h-8 w-8 text-[#C89A84] opacity-50" />

            <p className="text-sm text-[#6E625C]">
              No portfolio items showcase available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#EFE8E2] bg-white shadow-sm sm:rounded-2xl"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#F9F6F2]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category */}
                  <span className="absolute right-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-[#1F1816]/80 px-2 py-1 text-[9px] font-medium text-white backdrop-blur-md sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 p-3 sm:p-4">
                  <h3 className="truncate font-serif text-xs font-bold text-[#1F1816] sm:text-sm">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-1 line-clamp-1 text-[10px] leading-4 text-[#6E625C] sm:text-xs">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center sm:mt-10">
          <Link
            href="/portfolio"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1F1816] px-5 py-3 text-sm text-white transition-colors hover:bg-[#322724] sm:px-6"
          >
            View Portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}