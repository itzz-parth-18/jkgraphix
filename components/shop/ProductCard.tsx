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
    <div className="overflow-hidden rounded-2xl border border-[#EFE8E2] bg-white shadow-sm">
      <div className="relative aspect-square">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 25vw"
        />
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#1F1816]">
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-[#6E625C]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-[#1F1816]">
            ₹{product.price}
          </span>

          <Link
            href={`/shop/${product.slug}`}
            className="rounded-lg bg-[#1F1816] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#322724]"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}