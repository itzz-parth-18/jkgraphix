import Link from "next/link";

export default function FeaturedCategories() {
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
        {[
          "Memory Boxes",
          "Keepsake Jewelry",
          "Custom Engravings",
        ].map((category, i) => (
          <Link
            key={i}
            href="/shop"
            className="group relative h-64 overflow-hidden rounded-2xl border border-[#EFE8E2]"
          >
            <div className="absolute inset-0 z-10 bg-[#1F1816]/20 transition-colors group-hover:bg-[#1F1816]/10" />

            <img
              src={`https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop&sig=${i}`}
              alt={category}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h3 className="font-serif text-xl font-bold tracking-wide text-white drop-shadow-md">
                {category}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}