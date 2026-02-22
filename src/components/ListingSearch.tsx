"use client";

import { useState, useMemo } from "react";
import { ListingCard } from "./ListingCard";
import type { ListingWithRelations } from "@/types";

type SortMode = "default" | "name-asc" | "rating-desc" | "rating-asc";

/**
 * Client-side search + sort wrapper for listing grids.
 * Searches across shop name, city, state, and categories.
 */
export function ListingSearch({
  listings,
  placeholder = "Search shops...",
  emptyMessage = "No shops found.",
}: {
  listings: ListingWithRelations[];
  placeholder?: string;
  emptyMessage?: string;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("default");

  const filtered = useMemo(() => {
    let result = listings;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.city.name.toLowerCase().includes(q) ||
          l.state.name.toLowerCase().includes(q) ||
          l.state.abbreviation.toLowerCase().includes(q) ||
          l.categories.some((c) => c.category.name.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "rating-desc")
        return (b.googleRating ?? 0) - (a.googleRating ?? 0);
      if (sort === "rating-asc")
        return (a.googleRating ?? 0) - (b.googleRating ?? 0);
      return 0; // default order from server
    });
  }, [listings, search, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-stone-200 bg-white py-1.5 pl-9 pr-3 text-sm text-stone-700 shadow-sm transition-colors placeholder:text-stone-400 hover:border-stone-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:w-72 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:placeholder:text-stone-500 dark:hover:border-stone-600"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {filtered.length} {filtered.length === 1 ? "shop" : "shops"}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 shadow-sm transition-colors hover:border-stone-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-stone-600"
          >
            <option value="default">Default</option>
            <option value="name-asc">Name A &ndash; Z</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="rating-asc">Lowest Rated</option>
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-16 text-center shadow-[var(--card-shadow)] ring-1 ring-stone-900/[0.04] dark:bg-stone-900 dark:ring-stone-700">
          <svg
            className="mx-auto h-12 w-12 text-stone-300 dark:text-stone-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="mt-4 text-stone-500 dark:text-stone-400">
            {search.trim()
              ? `No shops matching "${search}"`
              : emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
}
