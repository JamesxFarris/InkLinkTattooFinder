"use client";

import { useState, useMemo } from "react";
import { CityCard } from "./CityCard";
import { ListingCard } from "./ListingCard";
import type { CityWithCount, ListingWithRelations } from "@/types";

type SortMode = "alpha" | "shops-desc" | "shops-asc";

type Props = {
  bigCities: CityWithCount[];
  smallCities: CityWithCount[];
  listingsByCityId: Record<number, ListingWithRelations[]>;
  stateName: string;
};

export function StatePageClient({
  bigCities,
  smallCities,
  listingsByCityId,
  stateName,
}: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("alpha");
  const [expandedCities, setExpandedCities] = useState<Set<number>>(
    new Set()
  );

  const q = search.toLowerCase().trim();

  const filteredBig = useMemo(() => {
    let result = bigCities;
    if (q) {
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      if (sort === "shops-desc")
        return b._count.listings - a._count.listings;
      if (sort === "shops-asc")
        return a._count.listings - b._count.listings;
      return a.name.localeCompare(b.name);
    });
  }, [bigCities, q, sort]);

  const filteredSmall = useMemo(() => {
    let result = smallCities;
    if (q) {
      result = result.filter((c) => {
        if (c.name.toLowerCase().includes(q)) return true;
        const listings = listingsByCityId[c.id] ?? [];
        return listings.some((l) => l.name.toLowerCase().includes(q));
      });
    }
    return [...result].sort((a, b) => {
      if (sort === "shops-desc")
        return b._count.listings - a._count.listings;
      if (sort === "shops-asc")
        return a._count.listings - b._count.listings;
      return a.name.localeCompare(b.name);
    });
  }, [smallCities, q, sort, listingsByCityId]);

  // Collect available letters from ALL filtered cities
  const letters = useMemo(() => {
    const all = [...filteredBig, ...filteredSmall];
    const set = new Set(all.map((c) => c.name[0].toUpperCase()));
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .filter((l) => set.has(l));
  }, [filteredBig, filteredSmall]);

  const totalResults = filteredBig.length + filteredSmall.length;
  const totalSmallListings = filteredSmall.reduce(
    (sum, c) => sum + (listingsByCityId[c.id]?.length ?? 0),
    0
  );

  // Precompute which letter each section "owns" for anchor IDs
  const letterOwners = useMemo(() => {
    const owners: Record<string, "big" | "small"> = {};
    if (sort !== "alpha") return owners;
    for (const c of filteredBig) {
      const l = c.name[0].toUpperCase();
      if (!owners[l]) owners[l] = "big";
    }
    for (const c of filteredSmall) {
      const l = c.name[0].toUpperCase();
      if (!owners[l]) owners[l] = "small";
    }
    return owners;
  }, [filteredBig, filteredSmall, sort]);

  // When searching, auto-expand all matching cities; otherwise manual toggle
  const isCityExpanded = (cityId: number) => {
    if (q) return true;
    return expandedCities.has(cityId);
  };

  const toggleCity = (cityId: number) => {
    setExpandedCities((prev) => {
      const next = new Set(prev);
      if (next.has(cityId)) next.delete(cityId);
      else next.add(cityId);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCities(new Set(filteredSmall.map((c) => c.id)));
  };

  const collapseAll = () => {
    setExpandedCities(new Set());
  };

  return (
    <>
      {/* Unified search + sort controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            placeholder="Search cities or shops..."
            className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm text-stone-700 shadow-sm transition-colors placeholder:text-stone-400 hover:border-stone-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:w-72 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:placeholder:text-stone-500 dark:hover:border-stone-600"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {totalResults} {totalResults === 1 ? "city" : "cities"}
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

      {/* Alphabetical quick-nav (only when alphabetical sort, not searching) */}
      {sort === "alpha" && !q && letters.length > 3 && (
        <nav
          aria-label="Jump to letter"
          className="mb-6 flex flex-wrap gap-1"
        >
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
            const active = letters.includes(letter);
            return (
              <button
                key={letter}
                disabled={!active}
                onClick={() => {
                  document
                    .getElementById(`letter-${letter}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded text-sm sm:text-xs font-medium transition-colors ${
                  active
                    ? "bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50"
                    : "text-stone-300 dark:text-stone-600 cursor-default"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </nav>
      )}

      {/* Major cities — link to their own pages */}
      {filteredBig.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
            Major Cities in {stateName}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBig.map((city, idx) => {
              const letter = city.name[0].toUpperCase();
              const isFirstOfLetter =
                sort === "alpha" &&
                letterOwners[letter] === "big" &&
                (idx === 0 ||
                  filteredBig[idx - 1].name[0].toUpperCase() !== letter);

              return (
                <div
                  key={city.id}
                  id={
                    isFirstOfLetter ? `letter-${letter}` : undefined
                  }
                  className="scroll-mt-24"
                >
                  <CityCard city={city} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Small cities — collapsible accordion */}
      {filteredSmall.length > 0 && (
        <section className={filteredBig.length > 0 ? "mt-12" : ""}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                More Tattoo Shops in {stateName}
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {totalSmallListings}{" "}
                {totalSmallListings === 1 ? "shop" : "shops"} across{" "}
                {filteredSmall.length}{" "}
                {filteredSmall.length === 1 ? "city" : "cities"}
              </p>
            </div>
            {!q && (
              <div className="flex gap-1">
                <button
                  onClick={expandAll}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-teal-600 transition-colors hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>

          <div className="divide-y divide-stone-100 rounded-xl border border-stone-200/60 bg-white dark:divide-stone-800 dark:border-stone-700/50 dark:bg-stone-800/40">
            {filteredSmall.map((city, idx) => {
              const listings = listingsByCityId[city.id] ?? [];
              const expanded = isCityExpanded(city.id);
              const letter = city.name[0].toUpperCase();
              const isFirstOfLetter =
                sort === "alpha" &&
                letterOwners[letter] === "small" &&
                (idx === 0 ||
                  filteredSmall[idx - 1].name[0].toUpperCase() !== letter);
              const anchorId = isFirstOfLetter
                ? `letter-${letter}`
                : undefined;

              return (
                <div
                  key={city.id}
                  id={anchorId}
                  className="scroll-mt-24"
                >
                  <button
                    onClick={() => toggleCity(city.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className={`h-4 w-4 flex-shrink-0 text-stone-400 transition-transform duration-200 ${
                          expanded ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {city.name}
                      </span>
                    </div>
                    <span className="text-sm text-stone-500 dark:text-stone-400">
                      {listings.length}{" "}
                      {listings.length === 1 ? "shop" : "shops"}
                    </span>
                  </button>
                  {expanded && listings.length > 0 && (
                    <div className="border-t border-stone-100 bg-stone-50/50 px-4 py-4 dark:border-stone-800 dark:bg-stone-900/30">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {listings.map((listing) => (
                          <ListingCard
                            key={listing.id}
                            listing={listing}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* No results */}
      {totalResults === 0 && q && (
        <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-stone-900/[0.04] dark:bg-stone-900 dark:ring-stone-700">
          <svg
            className="mx-auto h-10 w-10 text-stone-300 dark:text-stone-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="mt-3 text-stone-500 dark:text-stone-400">
            No cities or shops matching &ldquo;{search}&rdquo;
          </p>
        </div>
      )}

      {/* No listings at all */}
      {bigCities.length === 0 &&
        smallCities.length === 0 && (
          <p className="mt-8 text-center text-stone-500">
            No cities with listings found in {stateName} yet. Check back
            soon!
          </p>
        )}
    </>
  );
}
