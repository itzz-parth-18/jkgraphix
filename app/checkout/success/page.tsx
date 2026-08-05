import Link from "next/link";
import { CheckCircle } from "lucide-react";

type Props = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function SuccessPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const orderNumber = params.order;

  return (
    <main className="min-h-screen bg-[#F9F6F2] flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 shadow-lg border border-[#EFE8E2] text-center">

        <CheckCircle
          className="mx-auto mb-6 text-green-600"
          size={72}
        />

        <h1 className="text-4xl font-serif font-bold text-[#1F1816]">
          Payment Successful
        </h1>

        <p className="mt-4 text-[#6E625C]">
          Thank you for your order.
        </p>

        {orderNumber && (
          <div className="mt-6 rounded-xl bg-[#F9F6F2] p-4">
            <p className="text-sm text-[#6E625C]">
              Order Number
            </p>

            <p className="mt-2 text-lg font-semibold text-[#1F1816]">
              {orderNumber}
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">

          <Link
            href="/shop"
            className="rounded-xl border border-[#1F1816] px-6 py-3"
          >
            Continue Shopping
          </Link>

          <Link
            href="/account/orders"
            className="rounded-xl bg-[#1F1816] px-6 py-3 text-white"
          >
            View Orders
          </Link>

        </div>

      </div>
    </main>
  );
}