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
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="rounded-lg border border-[#EFE8E2] px-4 py-2 text-sm disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-[#6E625C]">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="rounded-lg border border-[#EFE8E2] px-4 py-2 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}