import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#EFE8E2] bg-white shadow-sm sm:rounded-2xl">
      {/* Product Image */}
      <div className="relative aspect-square shrink-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw,
                 (max-width: 768px) 50vw,
                 (max-width: 1200px) 50vw,
                 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        {/* Fixed content area */}
        <div className="min-h-[72px] sm:min-h-[92px]">
          <h3 className="line-clamp-2 font-serif text-sm font-semibold leading-tight text-[#1F1816] sm:text-lg">
            {product.name}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#6E625C] sm:mt-2 sm:text-sm">
            {product.description}
          </p>
        </div>

        {/* Bottom row */}
        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 pt-2 sm:pt-3">
          <span className="shrink-0 text-sm font-semibold text-[#1F1816] sm:text-lg">
            ₹{product.price}
          </span>

          <Link
            href={`/shop/${product.slug}`}
            className="shrink-0 whitespace-nowrap rounded-md bg-[#1F1816] px-2 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#322724] sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}