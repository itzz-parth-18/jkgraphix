import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#C89A84]/40 bg-white py-16 text-center">
      <h2 className="text-2xl font-semibold text-[#1F1816]">
        No products available
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm text-[#6E625C]">
        We don't have any published products at the moment.
        Please check back again soon.
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl bg-[#1F1816] px-6 py-3 text-sm font-medium text-white hover:bg-[#322724]"
      >
        Return Home
      </Link>
    </div>
  );
}