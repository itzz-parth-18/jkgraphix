import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

import ShopHeader from "@/components/shop/ShopHeader";
import ShopControls from "@/components/shop/ShopControls";
import ProductGrid from "@/components/shop/ProductGrid";
import EmptyState from "@/components/shop/EmptyState";
import Pagination from "@/components/shop/Pagination";

export const metadata: Metadata = {
  title: "Shop Custom Printing & Keepsakes",
  description: "Browse our collection of personalized keepsakes, custom memory boxes, and bespoke business printing solutions.",
  openGraph: {
    title: "Shop Custom Printing & Keepsakes | JK Graphix",
    description: "Browse our collection of personalized keepsakes, custom memory boxes, and bespoke business printing solutions.",
    url: "/shop",
  },
};

type SearchParams = {
  search?: string;
  category?: string;
  sort?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const PAGE_SIZE = 12;

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params.search ?? "";
  const category = params.category ?? "all";
  const sort = params.sort ?? "newest";
  const page = Number(params.page ?? "1");

  const where: any = {
    status: "PUBLISHED",
  };

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Category filter will be enabled once Product has a category field.

  let orderBy: any = {
    createdAt: "desc",
  };

  switch (sort) {
    case "price-asc":
      orderBy = {
        basePrice: "asc",
      };
      break;

    case "price-desc":
      orderBy = {
        basePrice: "desc",
      };
      break;

    case "alphabetical":
      orderBy = {
        name: "asc",
      };
      break;

    default:
      orderBy = {
        createdAt: "desc",
      };
  }

  const totalProducts = await (prisma as any).product.count({
    where,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / PAGE_SIZE)
  );

  const products = await (prisma as any).product.findMany({
    where,
    orderBy,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const formattedProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.basePrice),
    imageUrl:
      product.imageUrl ||
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60",
    category: "Memory Boxes",
  }));

  const categories = ["Memory Boxes"];

  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <ShopHeader />

        <ShopControls categories={categories} />

        {formattedProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ProductGrid products={formattedProducts} />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
            />
          </>
        )}
      </main>
    </div>
  );
}