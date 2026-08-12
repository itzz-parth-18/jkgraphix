import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function FeaturedCategories() {
  let categories: { id: string; name: string; slug: string; imageUrl?: string | null }[] = [];
  
  try {
    categories = await (prisma as any).category.findMany({
      where: { 
        isVisible: true,
        isFeatured: true // Sirf Featured categories hi homepage par aayengi
      },
      orderBy: { displayOrder: "asc" }, 
      take: 3, 
    });
  } catch (error) {
    // Fallback
  }

  const displayCategories = categories.length > 0 ? categories : [
    { id: "1", name: "Memory Boxes", slug: "shop", imageUrl: null },
    { id: "2", name: "Keepsake Jewelry", slug: "shop", imageUrl: null },
    { id: "3", name: "Custom Engravings", slug: "shop", imageUrl: null },
  ];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-[#1F1816]">
          Shop by Category
        </h2>
        <p className="text-[#6E625C] mt-3 text-sm">
          Discover our handcrafted collections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCategories.map((cat, i) => {
          const categoryName = cat.name;
          const categoryLink = `/shop?category=${cat.slug || cat.id}`;
          const categoryImage = cat.imageUrl || `https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop&sig=${i}`;

          return (
            <Link
              key={cat.id || i}
              href={categoryLink}
              className="group relative h-64 overflow-hidden rounded-2xl border border-[#EFE8E2]"
            >
              <div className="absolute inset-0 z-10 bg-[#1F1816]/20 transition-colors group-hover:bg-[#1F1816]/10" />

              <img
                src={categoryImage}
                alt={categoryName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <h3 className="font-serif text-xl font-bold tracking-wide text-white drop-shadow-md">
                  {categoryName}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}