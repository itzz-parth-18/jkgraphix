"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2 sm:mt-10 sm:gap-3">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="min-h-10 rounded-lg border border-[#EFE8E2] px-3 py-2 text-xs font-medium text-[#1F1816] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
      >
        Previous
      </button>

      <span className="whitespace-nowrap text-xs text-[#6E625C] sm:text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="min-h-10 rounded-lg border border-[#EFE8E2] px-3 py-2 text-xs font-medium text-[#1F1816] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
      >
        Next
      </button>
    </div>
  );
}