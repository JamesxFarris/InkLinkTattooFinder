"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type FilterOption = { label: string; value: string };

const priceOptions: FilterOption[] = [
  { label: "$ Budget", value: "budget" },
  { label: "$$ Moderate", value: "moderate" },
  { label: "$$$ Premium", value: "premium" },
  { label: "$$$$ Luxury", value: "luxury" },
];

const sortOptions: FilterOption[] = [
  { label: "Relevance", value: "relevance" },
  { label: "Name A-Z", value: "name" },
  { label: "Highest Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

export function FilterSidebar({
  categories,
}: {
  categories: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const currentCategory = searchParams.get("category") || "";
  const currentPrice = searchParams.get("price") || "";
  const currentSort = searchParams.get("sort") || "relevance";
  const currentWalkIns = searchParams.get("walkIns") === "true";

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Sort By
        </h3>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value === "relevance" ? null : e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Style
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParam("category", null)}
            className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
              !currentCategory
                ? "bg-red-50 font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            All Styles
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParam("category", cat.slug)}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                currentCategory === cat.slug
                  ? "bg-red-50 font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Price Range
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParam("price", null)}
            className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
              !currentPrice
                ? "bg-red-50 font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            Any Price
          </button>
          {priceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("price", opt.value)}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                currentPrice === opt.value
                  ? "bg-red-50 font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Features
        </h3>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={currentWalkIns}
            onChange={(e) =>
              updateParam("walkIns", e.target.checked ? "true" : null)
            }
            className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Walk-ins Welcome
          </span>
        </label>
      </div>
    </aside>
  );
}
