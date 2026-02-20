export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingGrid } from "@/components/ListingGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { searchListings, searchListingsNearby, getAllCategories } from "@/lib/queries";
import { isZipCode, geocodeZip } from "@/lib/geo";
import { searchPageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import type { ListingWithRelations } from "@/types";

type Props = {
  searchParams: Promise<{
    q?: string;
    city?: string;
    category?: string;
    price?: string;
    walkIns?: string;
    sort?: string;
    page?: string;
    radius?: string;
  }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const meta = searchPageMeta(q);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: "/search" },
  };
}

async function SearchResults({ searchParams }: { searchParams: Props["searchParams"] }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const query = params.q?.trim() || "";
  const radius = parseInt(params.radius || "50", 10);

  const categories = await getAllCategories();
  const filterCategories = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  // Check if the query is a zip code
  const isZip = isZipCode(query);
  let geoResult: { latitude: number; longitude: number; place?: string; state?: string } | null = null;
  let listings: ListingWithRelations[] = [];
  let total = 0;
  let totalPages = 0;
  let nearestCities: { id: number; name: string; distance: number }[] = [];
  let distances: Record<number, number> = {};

  if (isZip) {
    // Geocode zip code and do proximity search
    geoResult = await geocodeZip(query);

    if (geoResult) {
      const result = await searchListingsNearby({
        latitude: geoResult.latitude,
        longitude: geoResult.longitude,
        radiusMiles: radius,
        categorySlug: params.category,
        price: params.price,
        walkIns: params.walkIns,
        page,
      });
      listings = result.listings;
      distances = result.distances;
      total = result.total;
      totalPages = result.totalPages;
      nearestCities = result.nearestCities;
    }
  } else {
    // Standard text search
    const result = await searchListings({
      q: query || undefined,
      citySlug: params.city,
      categorySlug: params.category,
      price: params.price,
      walkIns: params.walkIns,
      sort: params.sort,
      page,
    });
    listings = result.listings;
    total = result.total;
    totalPages = result.totalPages;
  }

  // Build pagination params
  const paginationParams: Record<string, string> = {};
  if (params.q) paginationParams.q = params.q;
  if (params.city) paginationParams.city = params.city;
  if (params.category) paginationParams.category = params.category;
  if (params.price) paginationParams.price = params.price;
  if (params.walkIns) paginationParams.walkIns = params.walkIns;
  if (params.sort) paginationParams.sort = params.sort;
  if (params.radius) paginationParams.radius = params.radius;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar */}
      <div className="w-full shrink-0 lg:w-64">
        <FilterSidebar categories={filterCategories} />
      </div>

      {/* Results */}
      <div className="flex-1">
        {/* Zip code location banner */}
        {isZip && geoResult && (
          <div className="mb-6 rounded-xl bg-teal-50 p-4 ring-1 ring-teal-200 dark:bg-teal-950/30 dark:ring-teal-800">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-teal-900 dark:text-teal-100">
                  Showing tattoo shops near {geoResult.place}, {geoResult.state} ({query})
                </p>
                <p className="mt-0.5 text-xs text-teal-700 dark:text-teal-300">
                  Within {radius} miles &middot; {total} {total === 1 ? "shop" : "shops"} found
                </p>
                {nearestCities.length > 0 && (
                  <p className="mt-1 text-xs text-teal-600 dark:text-teal-400">
                    Nearest cities: {nearestCities.map((c) => `${c.name} (${c.distance} mi)`).join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Radius controls */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[25, 50, 100, 200].map((r) => {
                const radiusParams = new URLSearchParams();
                radiusParams.set("q", query);
                radiusParams.set("radius", String(r));
                if (params.category) radiusParams.set("category", params.category);
                if (params.price) radiusParams.set("price", params.price);
                if (params.walkIns) radiusParams.set("walkIns", params.walkIns);
                return (
                  <a
                    key={r}
                    href={`/search?${radiusParams.toString()}`}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      r === radius
                        ? "bg-teal-600 text-white"
                        : "bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-300 dark:hover:bg-teal-800"
                    }`}
                  >
                    {r} miles
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {isZip && !geoResult && (
          <div className="mb-6 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Could not find location for zip code &quot;{query}&quot;. Please check the zip code and try again.
            </p>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {total} {total === 1 ? "result" : "results"} found
            {query && !isZip && (
              <>
                {" "}for <span className="font-medium text-stone-900 dark:text-stone-100">&quot;{query}&quot;</span>
              </>
            )}
          </p>
        </div>

        {/* Listings with distance badges for zip searches */}
        {isZip && listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const dist = distances[listing.id];
              return (
                <div key={listing.id} className="relative">
                  {dist != null && (
                    <span className="absolute -top-2 -right-2 z-10 rounded-full bg-teal-600 px-2 py-0.5 text-xs font-bold text-white shadow-md">
                      {dist < 1 ? "< 1 mi" : `${Math.round(dist)} mi`}
                    </span>
                  )}
                  <ListingGrid listings={[listing]} />
                </div>
              );
            })}
          </div>
        ) : (
          <ListingGrid listings={listings} />
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/search"
          searchParams={paginationParams}
        />
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Search" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Search Tattoo Shops
      </h1>
      <div className="mt-4 mb-8">
        <SearchBar />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-700 border-t-teal-500" />
          </div>
        }
      >
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
