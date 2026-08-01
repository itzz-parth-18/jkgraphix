"use client";

import { useRouter, useSearchParams } from "next/navigation";

import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import SortSelect from "./SortSelect";

type Props = {
  categories: string[];
};

export default function ShopControls({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page");

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <SearchBar
          value={search}
          onChange={(value) => updateQuery("search", value)}
        />
      </div>

      <div className="flex gap-3">
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={(value) => updateQuery("category", value)}
        />

        <SortSelect
          value={sort}
          onChange={(value) => updateQuery("sort", value)}
        />
      </div>
    </div>
  );
}