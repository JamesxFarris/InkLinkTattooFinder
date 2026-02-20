export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingGrid } from "@/components/ListingGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd, itemListJsonLd, faqJsonLd } from "@/components/JsonLd";
import { generateCityFaqItems } from "@/lib/faq";
import { CityFaq } from "@/components/CityFaq";
import {
  getCityBySlug,
  getCategoriesForCity,
  getFilteredCityListings,
  getSiblingCities,
} from "@/lib/queries";
import { cityPageMeta } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{
    category?: string;
    price?: string;
    walkIns?: string;
    sort?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug, stateSlug);
  if (!city) return {};
  const meta = cityPageMeta(city.name, city.state.abbreviation);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
    alternates: { canonical: `/${stateSlug}/${citySlug}` },
  };
}

async function CityListings({
  cityId,
  stateSlug,
  citySlug,
  cityName,
  stateName,
  stateAbbreviation,
  stateId,
  searchParams,
}: {
  cityId: number;
  stateSlug: string;
  citySlug: string;
  cityName: string;
  stateName: string;
  stateAbbreviation: string;
  stateId: number;
  searchParams: Props["searchParams"];
}) {
  const filterParams = await searchParams;
  const page = Math.max(1, parseInt(filterParams.page || "1", 10));
  const hasActiveFilters = !!(filterParams.category || filterParams.price || filterParams.walkIns || (filterParams.sort && filterParams.sort !== "relevance"));

  const [categories, { listings, total, totalPages }, siblingCities] =
    await Promise.all([
      getCategoriesForCity(cityId),
      getFilteredCityListings({
        cityId,
        categorySlug: filterParams.category,
        price: filterParams.price,
        walkIns: filterParams.walkIns,
        sort: filterParams.sort,
        page,
      }),
      getSiblingCities(stateId, cityId, 12),
    ]);

  const filterCategories = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  const basePath = `/${stateSlug}/${citySlug}`;

  // Build search params for pagination
  const paginationParams: Record<string, string> = {};
  if (filterParams.category) paginationParams.category = filterParams.category;
  if (filterParams.price) paginationParams.price = filterParams.price;
  if (filterParams.walkIns) paginationParams.walkIns = filterParams.walkIns;
  if (filterParams.sort) paginationParams.sort = filterParams.sort;

  const faqItems = generateCityFaqItems({
    cityName,
    stateName,
    stateAbbreviation,
    listingCount: total,
    categoryNames: categories.map((c) => c.name),
  });

  return (
    <>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <div className="w-full shrink-0 lg:w-64">
          <FilterSidebar categories={filterCategories} basePath={basePath} />
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {total} {total === 1 ? "shop" : "shops"} found
              {hasActiveFilters && (
                <> with active filters</>
              )}
            </p>
          </div>

          <ListingGrid listings={listings} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={basePath}
            searchParams={paginationParams}
          />
        </div>
      </div>

      {/* Other Cities in State */}
      {siblingCities.length > 0 && (
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                More Cities in {stateName}
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Explore tattoo shops in other {stateName} cities.
              </p>
            </div>
            <Link
              href={`/${stateSlug}`}
              className="hidden text-sm font-medium text-teal-500 hover:text-teal-400 sm:inline-flex"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {siblingCities.map((sibling) => (
              <Link
                key={sibling.id}
                href={`/${sibling.state.slug}/${sibling.slug}`}
                className="group flex h-24 flex-col items-center justify-center rounded-xl border border-stone-200/60 bg-white text-center transition-all hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-lg dark:border-stone-700/50 dark:bg-stone-800/60 dark:hover:border-teal-500/40"
              >
                <span className="text-sm font-semibold text-stone-800 transition-colors group-hover:text-teal-600 dark:text-stone-200 dark:group-hover:text-teal-400">
                  {sibling.name}
                </span>
                <span className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">
                  {sibling._count.listings}{" "}
                  {sibling._count.listings === 1 ? "shop" : "shops"}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={`/${stateSlug}`}
            className="mt-4 block text-center text-sm font-medium text-teal-500 hover:text-teal-400 sm:hidden"
          >
            View all cities in {stateName} &rarr;
          </Link>
        </section>
      )}

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
          Frequently Asked Questions
        </h2>
        <CityFaq items={faqItems} />
      </section>

      {/* JSON-LD for listings */}
      <JsonLd
        data={itemListJsonLd(
          listings.map((l, i) => ({
            name: l.name,
            url: `https://inklinktattoofinder.com/listing/${l.slug}`,
            position: i + 1,
          }))
        )}
      />
    </>
  );
}

export default async function CityPage({ params, searchParams }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug, stateSlug);
  if (!city) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={faqJsonLd([])} />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: city.state.name, href: `/${city.state.slug}` },
          { label: city.name },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          name: `Tattoo Shops in ${city.name}, ${city.state.abbreviation}`,
          description: `Find the best tattoo artists and shops in ${city.name}, ${city.state.name}.`,
          url: `/${stateSlug}/${citySlug}`,
        })}
      />
      <Breadcrumbs
        items={[
          { label: city.state.name, href: `/${city.state.slug}` },
          { label: city.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Tattoo Shops in {city.name}, {city.state.abbreviation}
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Find the best tattoo artists and shops in {city.name},{" "}
          {city.state.name}.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-700 border-t-teal-500" />
          </div>
        }
      >
        <CityListings
          cityId={city.id}
          stateSlug={stateSlug}
          citySlug={citySlug}
          cityName={city.name}
          stateName={city.state.name}
          stateAbbreviation={city.state.abbreviation}
          stateId={city.stateId}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}
