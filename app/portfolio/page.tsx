import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Portfolio & Showcase",
  description: "Explore our past custom printing, design, and gifting projects crafted with precision by JK Graphix.",
  openGraph: {
    title: "Our Portfolio & Showcase | JK Graphix",
    description: "Explore our past custom printing, design, and gifting projects crafted with precision by JK Graphix.",
    url: "/portfolio",
  },
};

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string;
  published: boolean;
  createdAt: Date;
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.category || "All";

  // Fetch only published portfolio items from database
  const items: PortfolioItem[] = await prisma.portfolioItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  }).catch(() => [] as PortfolioItem[]);

  // Extract unique categories for filter tabs
  const categories: string[] = ["All", ...Array.from(new Set(items.map((i: PortfolioItem) => i.category)))];

  // Filter items based on selected category
  const filteredItems: PortfolioItem[] = selectedCategory === "All"
    ? items
    : items.filter((item: PortfolioItem) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#EFE8E2] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#1F1816] flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#1F1816] text-[#F9F6F2] flex items-center justify-center font-serif font-bold text-xs">JK</div>
            <span>JK Graphix</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </nav>
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-16 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F1816] tracking-tight">
            Our Work & Showcase
          </h1>
          <p className="text-[#6E625C] text-lg max-w-2xl mx-auto leading-relaxed">
            Take a look at some of our finest custom designs, prints, and personalized keepsakes crafted with precision.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat: string) => (
              <Link
                key={cat}
                href={cat === "All" ? "/portfolio" : `/portfolio?category=${encodeURIComponent(cat)}`}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-[#1F1816] text-white shadow-sm"
                    : "bg-white border border-[#EFE8E2] text-[#6E625C] hover:border-[#C89A84]"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Portfolio Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border border-[#EFE8E2] text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-[#F9F6F2] text-[#C89A84] rounded-2xl flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1F1816]">No Portfolio Items Found</h3>
            <p className="text-[#6E625C] text-sm leading-relaxed">
              We are currently curating new project photos. Check back soon to see our latest work!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item: PortfolioItem) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-[#EFE8E2] shadow-sm flex flex-col hover:shadow-md transition-all">
                <div className="relative h-64 w-full bg-[#F9F6F2] overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-4 right-4 bg-[#1F1816]/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    {item.category}
                  </span>
                </div>
                <div className="p-6 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1F1816]">{item.title}</h3>
                    {item.description && (
                      <p className="text-[#6E625C] text-sm mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}