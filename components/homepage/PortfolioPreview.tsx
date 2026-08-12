import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PortfolioPreview() {
  // Fetch latest 4 published portfolio items from database
  const portfolioItems = await prisma.portfolioItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  }).catch(() => []);

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

        {portfolioItems.length === 0 ? (
          <div className="rounded-2xl border border-[#EFE8E2] bg-white p-12 text-center shadow-sm max-w-md mx-auto space-y-3">
            <Briefcase className="w-8 h-8 text-[#C89A84] mx-auto opacity-50" />
            <p className="text-sm text-[#6E625C]">No portfolio items showcase available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[#EFE8E2] bg-white shadow-sm flex flex-col group"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[#F9F6F2]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-[#1F1816]/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white">
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-bold text-[#1F1816] text-sm truncate">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-[#6E625C] mt-1 line-clamp-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F1816] px-6 py-3 text-white hover:bg-[#322724] transition-colors"
          >
            View Portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}