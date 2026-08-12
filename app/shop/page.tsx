import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";
import { ProductType } from "@prisma/client"; // <-- YE NAYI LINE ADD HUI HAI
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, MessageSquare, ArrowRight } from "lucide-react";

import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import EmptyState from "@/components/shop/EmptyState";
import Pagination from "@/components/shop/Pagination";

export const metadata: Metadata = {
  title: "Shop Custom Printing & Keepsakes",
  description: "Browse our collection of personalized keepsakes, custom memory boxes, and bespoke business printing solutions.",
};

type SearchParams = {
  search?: string;
  category?: string;
  sort?: string;
  page?: string;
  type?: string; 
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const PAGE_SIZE = 12;

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params.search ?? "";
  const selectedCategory = params.category ?? "all";
  const sort = params.sort ?? "newest";
  const type = params.type; 
  const page = Number(params.page ?? "1");

  const isMainHubView = !type;

  // NAYA LOGIC: Prisma ke exact Enum ko use kar rahe hain
  const currentType = type === 'cr' ? ProductType.DESIGN_CONSULTATION : ProductType.QUICK_CUSTOMIZE;

  // 1. Database se SIRF wahi Categories fetch karo jo current page ke type se match karti hain
  const dbCategories = await (prisma as any).category.findMany({
    where: isMainHubView ? {} : { type: currentType },
    orderBy: { name: 'asc' }
  });

  // 2. Base Query Setup for Products
  const where: any = {
    status: "PUBLISHED",
  };

  // Products ko unki category ke type ke hisaab se filter karo
  if (!isMainHubView) {
    where.category = {
      type: currentType
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // 3. Agar Specific Category Select ki hai
  if (selectedCategory !== "all") {
    const cat = dbCategories.find((c: any) => c.name.toLowerCase() === selectedCategory.toLowerCase());
    if (cat) {
      where.categoryId = cat.id;
    }
  }

  let orderBy: any = { createdAt: "desc" };
  switch (sort) {
    case "price-asc": orderBy = { basePrice: "asc" }; break;
    case "price-desc": orderBy = { basePrice: "desc" }; break;
    case "alphabetical": orderBy = { name: "asc" }; break;
    default: orderBy = { createdAt: "desc" };
  }

  const totalProducts = await (prisma as any).product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  
  const products = await (prisma as any).product.findMany({
    where,
    orderBy,
    include: { category: true },
    skip: isMainHubView ? 0 : (page - 1) * PAGE_SIZE,
    take: isMainHubView ? 8 : PAGE_SIZE, 
  });

  const formattedProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.basePrice),
    imageUrl: product.imageUrl || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60",
    category: product.category?.name || "Uncategorized",
  }));

  const qcShowcase = formattedProducts.slice(0, 4);
  const crShowcase = formattedProducts.slice(4, 8);

  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      <Navbar />

      <main className="mx-auto max-w-[90rem] px-6 py-12">
        
        {/* ========================================= */}
        {/* VIEW 1: Main Hub (Side by Side QC and CR) */}
        {/* ========================================= */}
        {isMainHubView ? (
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F1816]">Choose Your Experience</h1>
              <p className="text-[#6E625C] text-lg">Whether you need a quick customized keepsake or a deeply bespoke consultation with our artisans, we have the perfect path for your gifting journey.</p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
              <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-8">
                <div className="flex flex-col gap-4 border-b border-[#EFE8E2] pb-6">
                  <div className="flex items-center gap-2 text-[#C89A84]">
                    <Zap className="w-5 h-5 fill-current" />
                    <span className="font-bold tracking-wide uppercase text-sm">Quick Customization</span>
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-[#1F1816]">Fast, Simple, and Beautiful</h2>
                  <p className="text-[#6E625C]">Select a design, upload your photos or text, and check out instantly.</p>
                  <Link href="/shop?type=qc" className="self-start mt-2 group flex items-center gap-2 bg-transparent border border-[#C89A84] text-[#1F1816] px-6 py-2.5 rounded-xl hover:bg-[#EFE8E2] transition-all font-medium text-sm">
                    View All QC Options <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                {qcShowcase.length > 0 ? <ProductGrid products={qcShowcase} /> : <p className="text-center text-[#6E625C] py-10">No items available.</p>}
              </section>

              <section className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-8">
                <div className="flex flex-col gap-4 border-b border-[#EFE8E2] pb-6">
                  <div className="flex items-center gap-2 text-[#C89A84]">
                    <MessageSquare className="w-5 h-5 fill-current" />
                    <span className="font-bold tracking-wide uppercase text-sm">Consultation Required</span>
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-[#1F1816]">Bespoke & Highly Custom</h2>
                  <p className="text-[#6E625C]">Have a complex vision? Share details and collaborate with our artisans before paying.</p>
                  <Link href="/shop?type=cr" className="self-start mt-2 group flex items-center gap-2 bg-[#1F1816] text-white px-6 py-2.5 rounded-xl hover:bg-[#322724] transition-all font-medium text-sm shadow-md">
                    View All CR Options <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                {crShowcase.length > 0 ? <ProductGrid products={crShowcase} /> : <p className="text-center text-[#6E625C] py-10">No items available.</p>}
              </section>
            </div>
          </div>
        ) 
        
        /* ========================================= */
        /* VIEW 2: Type Specific Page (QC or CR Flow) */
        /* ========================================= */
        : (
          <div className="space-y-10">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
              <h1 className="font-serif text-4xl font-bold text-[#1F1816]">
                {type === 'qc' ? "Quick Customization" : "Consultation Required"}
              </h1>
              <p className="text-[#6E625C]">
                {type === 'qc' 
                  ? "Select a category below to instantly customize your gift and checkout." 
                  : "Select a category below. Share your requirements and we'll craft it together."}
              </p>
            </div>

            {/* THE NEW CATEGORY BOXES ROW */}
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar hide-scrollbar snap-x">
              
              {/* "All" Category Box */}
              <Link 
                href={`/shop?type=${type}&category=all`}
                className={`shrink-0 snap-start px-8 py-4 rounded-2xl border font-medium transition-all duration-300 ${
                  selectedCategory === 'all' 
                    ? 'bg-[#1F1816] border-[#1F1816] text-white shadow-md' 
                    : 'bg-white border-[#EFE8E2] text-[#6E625C] hover:border-[#C89A84] hover:text-[#1F1816]'
                }`}
              >
                All Products
              </Link>

              {/* Dynamic Database Category Boxes */}
              {dbCategories.map((cat: any) => {
                const isSelected = selectedCategory === cat.name.toLowerCase();
                return (
                  <Link 
                    key={cat.id}
                    href={`/shop?type=${type}&category=${cat.name.toLowerCase()}`}
                    className={`shrink-0 snap-start px-8 py-4 rounded-2xl border font-medium transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[#1F1816] border-[#1F1816] text-white shadow-md' 
                        : 'bg-white border-[#EFE8E2] text-[#6E625C] hover:border-[#C89A84] hover:text-[#1F1816]'
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>

            {/* The Unified Product Grid */}
            <div className="mt-8">
              {formattedProducts.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <ProductGrid products={formattedProducts} />
                  <div className="mt-12">
                    <Pagination currentPage={page} totalPages={totalPages} />
                  </div>
                </>
              )}
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}