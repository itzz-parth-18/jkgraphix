import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function FeaturedCategories() {
  let categories: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
  }[] = [];

  try {
    categories = await (prisma as any).category.findMany({
      where: {
        isVisible: true,
        isFeatured: true,
      },
      orderBy: { displayOrder: "asc" },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
      },
    });
  } catch (error) {
    // Fallback
  }

  const displayCategories =
    categories.length > 0
      ? categories
      : [
          {
            id: "1",
            name: "Memory Boxes",
            slug: "shop",
            imageUrl: null,
          },
          {
            id: "2",
            name: "Keepsake Jewelry",
            slug: "shop",
            imageUrl: null,
          },
          {
            id: "3",
            name: "Custom Engravings",
            slug: "shop",
            imageUrl: null,
          },
        ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center sm:mb-12">
        <h2 className="font-serif text-2xl font-bold text-[#1F1816] sm:text-3xl">
          Shop by Category
        </h2>

        <p className="mt-2 text-sm text-[#6E625C] sm:mt-3">
          Discover our handcrafted collections
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
        {displayCategories.map((cat, i) => {
          const categoryName = cat.name;
          const categoryLink = `/shop?category=${cat.slug || cat.id}`;

          const categoryImage =
            cat.imageUrl ||
            `https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop&sig=${i}`;

          return (
            <Link
              key={cat.id || i}
              href={categoryLink}
              className="group relative h-44 overflow-hidden rounded-2xl border border-[#EFE8E2] sm:h-52 md:h-64"
            >
              <div className="absolute inset-0 z-10 bg-[#1F1816]/20 transition-colors group-hover:bg-[#1F1816]/10" />

              <img
                src={categoryImage}
                alt={categoryName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 z-20 flex items-center justify-center px-2">
                <h3 className="text-center font-serif text-base font-bold tracking-wide text-white drop-shadow-md sm:text-lg md:text-xl">
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