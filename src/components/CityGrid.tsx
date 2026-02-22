"use client";

import { useState, useMemo } from "react";
import { CityCard } from "./CityCard";
import type { CityWithCount } from "@/types";

type SortMode = "alpha" | "shops-desc" | "shops-asc";

export function CityGrid({
  cities,
  imageUrls,
}: {
  cities: CityWithCount[];
  imageUrls: Record<number, string>;
}) {
  const [sort, setSort] = useState<SortMode>("alpha");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = cities;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      if (sort === "shops-desc") return b._count.listings - a._count.listings;
      if (sort === "shops-asc") return a._count.listings - b._count.listings;
      return a.name.localeCompare(b.name);
    });
  }, [cities, sort, search]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cities..."
            className="w-full rounded-lg border border-stone-200 bg-white py-1.5 pl-9 pr-3 text-sm text-stone-700 shadow-sm transition-colors placeholder:text-stone-400 hover:border-stone-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:w-64 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:placeholder:text-stone-500 dark:hover:border-stone-600"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {filtered.length} {filtered.length === 1 ? "city" : "cities"}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 shadow-sm transition-colors hover:border-stone-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-stone-600"
          >
            <option value="alpha">A &ndash; Z</option>
            <option value="shops-desc">Most Shops</option>
            <option value="shops-asc">Fewest Shops</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((city) => (
          <CityCard key={city.id} city={city} imageUrl={imageUrls[city.id]} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-stone-500 dark:text-stone-400">
          No cities matching &quot;{search}&quot;
        </p>
      )}
    </>
  );
}
