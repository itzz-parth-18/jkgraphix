import Link from "next/link";
import { prisma } from "@/lib/prisma";

const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop";

function sanitizeImageUrl(url: string | null | undefined): string {
  if (!url || url.startsWith("data:image")) {
    return FALLBACK_IMAGE_URL;
  }
  return url;
}

export default async function FeaturedProducts() {
  let products: any[] = [];

  try {
    // Database se direct fetch jisme admin ke featured products filter honge
    products = await (prisma as any).product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { showOnHomepage: true },
          { isFeatured: true },
        ],
      },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        imageUrl: true,
        basePrice: true,
      },
    });

    // Agar featured products kam hain, toh baki published products se fill kar do
    if (products.length < 4) {
      const extraProducts = await (prisma as any).product.findMany({
        where: {
          status: "PUBLISHED",
          id: {
            notIn: products.map((p: any) => p.id),
          },
        },
        take: 4 - products.length,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          name: true,
          imageUrl: true,
          basePrice: true,
        },
      });

      products = [...products, ...extraProducts];
    }
  } catch (error) {
    products = [];
  }

  return (
    <section className="border-y border-[#EFE8E2] bg-[#EFE8E2]/30 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1F1816] sm:text-3xl">
              Featured Products
            </h2>

            <p className="mt-2 text-sm text-[#6E625C] sm:mt-3">
              Our most loved personalized pieces
            </p>
          </div>

          <Link
            href="/shop"
            className="shrink-0 text-xs font-medium text-[#C89A84] transition hover:text-[#1F1816] sm:text-sm"
          >
            View All
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {products.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-[#C89A84]/40 p-8 text-center sm:p-10">
              <h3 className="text-base font-semibold text-[#1F1816] sm:text-lg">
                No featured products available
              </h3>

              <p className="mt-2 text-xs text-[#6E625C] sm:text-sm">
                Products will appear here once they are published.
              </p>
            </div>
          ) : (
            products.map((product: any) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group block overflow-hidden rounded-2xl border border-[#EFE8E2] bg-white shadow-sm"
              >
                {/* Product image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={sanitizeImageUrl(product.imageUrl)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Product info */}
                <div className="p-3 sm:p-4">
                  <h4 className="truncate font-serif text-sm font-semibold text-[#1F1816]">
                    {product.name}
                  </h4>

                  <p className="mt-1.5 text-sm font-medium text-[#C89A84] sm:mt-2">
                    ₹
                    {product.basePrice
                      ? Number(product.basePrice).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}