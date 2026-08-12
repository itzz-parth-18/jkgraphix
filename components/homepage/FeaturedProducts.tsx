import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function FeaturedProducts() {
  let products: any[] = [];

  try {
    // Database se direct fetch jisme admin ke featured products filter honge
    products = await (prisma as any).product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { showOnHomepage: true },
          { isFeatured: true }
        ]
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    // Agar featured products kam hain, toh baki published products se fill kar do
    if (products.length < 4) {
      const extraProducts = await (prisma as any).product.findMany({
        where: {
          status: "PUBLISHED",
          id: { notIn: products.map((p: any) => p.id) }
        },
        take: 4 - products.length,
        orderBy: { createdAt: "desc" },
      });
      products = [...products, ...extraProducts];
    }
  } catch (error) {
    products = [];
  }

  return (
    <section>
      <section className="py-20 bg-[#EFE8E2]/30 border-y border-[#EFE8E2] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#1F1816]">Featured Products</h2>
              <p className="text-[#6E625C] mt-3 text-sm">Our most loved personalized pieces</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#C89A84] hover:text-[#1F1816] transition">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            {products.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-[#C89A84]/40 p-10 text-center">
                <h3 className="text-lg font-semibold text-[#1F1816]">
                  No featured products available
                </h3>
                <p className="mt-2 text-sm text-[#6E625C]">
                  Products will appear here once they are published.
                </p>
              </div>
            ) : (
              products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#EFE8E2] shadow-sm group block"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={product.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4">
                    <h4 className="font-serif font-semibold text-[#1F1816] text-sm truncate">
                      {product.name}
                    </h4>

                    <p className="text-[#C89A84] text-sm font-medium mt-2">
                      ₹{product.basePrice ? Number(product.basePrice).toFixed(2) : "0.00"}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </section>
  );
}