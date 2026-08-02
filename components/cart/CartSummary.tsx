import Link from "next/link";

type Props = {
  itemCount: number;
  total: number;
  isAuthenticated: boolean;
};

export default function CartSummary({
  itemCount,
  total,
  isAuthenticated,
}: Props) {
  return (
    <div className="rounded-2xl border border-[#EFE8E2] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-serif font-semibold text-[#1F1816]">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[#6E625C]">Items</span>
          <span className="font-medium">{itemCount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#6E625C]">Estimated Total</span>
          <span className="font-semibold">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="my-6 border-t border-[#EFE8E2]" />

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      <Link
        href={
          isAuthenticated
            ? "/checkout"
            : "/login?callbackUrl=/checkout"
        }
        className="mt-6 block rounded-xl bg-[#1F1816] px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-[#322724]"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/shop"
        className="mt-3 block rounded-xl border border-[#EFE8E2] px-6 py-3 text-center text-sm font-medium text-[#1F1816] transition hover:bg-[#F9F6F2]"
      >
        Continue Shopping
      </Link>
    </div>
  );
}