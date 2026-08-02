import Link from "next/link";
import { SearchX } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-[#F9F6F2] p-6">
        <SearchX className="h-14 w-14 text-[#6E625C]" />
      </div>

      <h1 className="mt-8 text-4xl font-serif font-bold text-[#1F1816]">
        Product Not Found
      </h1>

      <p className="mt-4 max-w-md text-[#6E625C]">
        The product you're looking for doesn't exist, may have been removed,
        or is no longer available.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/shop"
          className="rounded-xl bg-[#1F1816] px-6 py-3 text-white transition hover:bg-[#322724]"
        >
          Back to Shop
        </Link>

        <Link
          href="/"
          className="rounded-xl border border-[#EFE8E2] px-6 py-3 transition hover:bg-[#F9F6F2]"
        >
          Home
        </Link>
      </div>
    </div>
  );
}