import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

async function getFeaturedProducts(): Promise<Product[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/shop/products`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  return (
    <section>
      {/* 4. Featured Products */}
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
  products.slice(0, 4).map((product) => (
    <div
      key={product.id}
      className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#EFE8E2] shadow-sm group"
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4">
        <h4 className="font-serif font-semibold text-[#1F1816] text-sm">
          {product.name}
        </h4>

        <p className="text-[#C89A84] text-sm font-medium mt-2">
          ₹{product.price}
        </p>
      </div>
    </div>
  ))
)}
            </div>
          </div>
        </section>
    </section>
  );
}