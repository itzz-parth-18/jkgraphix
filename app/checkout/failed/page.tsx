import Link from "next/link";
import { XCircle } from "lucide-react";

export default function FailedPage() {
  return (
    <main className="min-h-screen bg-[#F9F6F2] flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-[#EFE8E2] p-10 shadow-lg text-center">

        <XCircle
          className="mx-auto mb-6 text-red-600"
          size={72}
        />

        <h1 className="text-4xl font-serif font-bold text-[#1F1816]">
          Payment Failed
        </h1>

        <p className="mt-4 text-[#6E625C]">
          Your payment could not be completed.
          No amount has been charged successfully.
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <Link
            href="/checkout"
            className="rounded-xl bg-[#1F1816] px-6 py-3 text-white"
          >
            Try Again
          </Link>

          <Link
            href="/shop"
            className="rounded-xl border border-[#1F1816] px-6 py-3"
          >
            Back to Shop
          </Link>

        </div>

      </div>
    </main>
  );
}