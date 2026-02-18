import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingGrid } from "@/components/ListingGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { searchListings, getAllCategories } from "@/lib/queries";
import { searchPageMeta } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{
    q?: string;
    city?: string;
    category?: string;
    price?: string;
    walkIns?: string;
    sort?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const meta = searchPageMeta(q);
  return {
    title: meta.title,
    description: meta.description,
  };
}

async function SearchResults({ searchParams }: { searchParams: Props["searchParams"] }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const [{ listings, total, totalPages }, categories] = await Promise.all([
    searchListings({
      q: params.q,
      citySlug: params.city,
      categorySlug: params.category,
      price: params.price,
      walkIns: params.walkIns,
      sort: params.sort,
      page,
    }),
    getAllCategories(),
  ]);

  const filterCategories = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  // Build search params for pagination
  const paginationParams: Record<string, string> = {};
  if (params.q) paginationParams.q = params.q;
  if (params.city) paginationParams.city = params.city;
  if (params.category) paginationParams.category = params.category;
  if (params.price) paginationParams.price = params.price;
  if (params.walkIns) paginationParams.walkIns = params.walkIns;
  if (params.sort) paginationParams.sort = params.sort;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar */}
      <div className="w-full shrink-0 lg:w-64">
        <FilterSidebar categories={filterCategories} />
      </div>

      {/* Results */}
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {total} {total === 1 ? "result" : "results"} found
            {params.q && (
              <>
                {" "}for <span className="font-medium text-stone-900 dark:text-stone-100">&quot;{params.q}&quot;</span>
              </>
            )}
          </p>
        </div>

        <ListingGrid listings={listings} />
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
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-red-600" />
          </div>
        }
      >
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
