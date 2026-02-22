"use client";

import { useState } from "react";
import { CityCard } from "./CityCard";
import type { CityWithCount } from "@/types";

type SortMode = "alpha" | "shops";

export function CityGrid({
  cities,
  imageUrls,
}: {
  cities: CityWithCount[];
  imageUrls: Record<number, string>;
}) {
  const [sort, setSort] = useState<SortMode>("alpha");

  const sorted = [...cities].sort((a, b) => {
    if (sort === "shops") return b._count.listings - a._count.listings;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {cities.length} {cities.length === 1 ? "city" : "cities"}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 shadow-sm transition-colors hover:border-stone-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-stone-600"
        >
          <option value="alpha">A &ndash; Z</option>
          <option value="shops">Most Shops</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((city) => (
          <CityCard key={city.id} city={city} imageUrl={imageUrls[city.id]} />
        ))}
      </div>
    </>
  );
}
