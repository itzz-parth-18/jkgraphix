import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#EFE8E2] bg-white px-8 py-20 text-center">
      <div className="rounded-full bg-[#F9F6F2] p-6">
        <ShoppingCart className="h-12 w-12 text-[#6E625C]" />
      </div>

      <h2 className="mt-6 text-2xl font-serif font-semibold text-[#1F1816]">
        Your cart is empty
      </h2>

      <p className="mt-3 max-w-md text-sm text-[#6E625C]">
        Looks like you haven't added any personalized products yet.
        Browse our collection and start creating something unique.
      </p>

      <Link
        href="/shop"
        className="mt-8 rounded-xl bg-[#1F1816] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#322724]"
      >
        Continue Shopping
      </Link>
    </div>
  );
}