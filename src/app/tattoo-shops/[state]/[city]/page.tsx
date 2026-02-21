export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatsBar } from "@/components/StatsBar";
import { ListingGrid } from "@/components/ListingGrid";
import { ListingCard } from "@/components/ListingCard";
import { StyleFilter } from "@/components/StyleFilter";
import { CityFAQ, getCityFaqData } from "@/components/CityFAQ";
import { TattooTips } from "@/components/TattooTips";
import { CityCard } from "@/components/CityCard";
import {
  JsonLd,
  itemListJsonLd,
  faqPageJsonLd,
  breadcrumbJsonLd,
} from "@/components/JsonLd";
import {
  getCityBySlug,
  getAllListingsByCity,
  getCityStats,
  getCategoriesForCity,
  getCitiesByState,
} from "@/lib/queries";
import { cityPageMeta } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{ style?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug, stateSlug);
  if (!city) return {};
  const meta = cityPageMeta(
    city.name,
    city.state.abbreviation,
    city._count.listings
  );
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
    alternates: { canonical: `/tattoo-shops/${stateSlug}/${citySlug}` },
  };
}

export default async function CityPillarPage({ params, searchParams }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const { style } = await searchParams;
  const city = await getCityBySlug(citySlug, stateSlug);
  if (!city) notFound();

  const [allListings, stats, categories, siblingCities] = await Promise.all([
    getAllListingsByCity(city.id),
    getCityStats(city.id),
    getCategoriesForCity(city.id),
    getCitiesByState(city.stateId),
  ]);

  // Filter by style if query param present
  const listings = style
    ? allListings.filter((l) =>
        l.categories.some((c) => c.category.slug === style)
      )
    : allListings;

  const featured = listings.filter((l) => l.featured);
  const regular = listings.filter((l) => !l.featured);

  const styleNames = categories.map((c) => c.name);
  const uniqueStyleCount = categories.length;

  const otherCities = siblingCities
    .filter((c) => c.id !== city.id)
    .sort((a, b) => b._count.listings - a._count.listings)
    .slice(0, 6);

  const baseUrl = "https://inklinktattoofinder.com";

  const faqData = getCityFaqData({
    cityName: city.name,
    stateAbbr: city.state.abbreviation,
    listingCount: stats.listingCount,
    walkInCount: stats.walkInCount,
    styles: styleNames,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={itemListJsonLd(
          listings.map((l, i) => ({
            name: l.name,
            url: `${baseUrl}/listing/${l.slug}`,
            position: i + 1,
          }))
        )}
      />
      <JsonLd data={faqPageJsonLd(faqData)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Tattoo Shops", url: `${baseUrl}/tattoo-shops` },
          {
            name: city.state.name,
            url: `${baseUrl}/tattoo-shops/${city.state.slug}`,
          },
          {
            name: city.name,
            url: `${baseUrl}/tattoo-shops/${city.state.slug}/${city.slug}`,
          },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: "Tattoo Shops", href: "/tattoo-shops" },
          { label: city.state.name, href: `/tattoo-shops/${city.state.slug}` },
          { label: city.name },
        ]}
      />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        {stats.listingCount} Best Tattoo Shops in {city.name},{" "}
        {city.state.abbreviation}
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-400">
        Discover the top-rated tattoo shops and artists in {city.name},{" "}
        {city.state.name}. Compare ratings, styles, hours, and walk-in
        availability all in one place.
      </p>

      <div className="mt-8">
        <StatsBar
          stats={[
            { label: "Total Shops", value: stats.listingCount },
            { label: "Walk-ins Welcome", value: stats.walkInCount },
            {
              label: "Avg Rating",
              value: stats.avgRating ? `${stats.avgRating} / 5` : "N/A",
            },
            { label: "Styles Available", value: uniqueStyleCount },
          ]}
        />
      </div>

      {/* Style filter */}
      {categories.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Filter by Style
          </h2>
          <Suspense fallback={null}>
            <StyleFilter
              categories={categories.map((c) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
              }))}
            />
          </Suspense>
        </div>
      )}

      {/* Featured Listings */}
      {featured.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
            Featured Shops
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* All Listings */}
      <section className="mt-10">
        {featured.length > 0 && regular.length > 0 && (
          <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
            All Shops
          </h2>
        )}
        {regular.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regular.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-[var(--card-shadow)] ring-1 ring-stone-900/[0.04] dark:bg-stone-900 dark:ring-stone-700">
            <p className="text-stone-500 dark:text-stone-400">
              {style
                ? `No tattoo shops found matching the "${style}" style. Try removing the filter.`
                : `No tattoo shops found in ${city.name} yet. Check back soon!`}
            </p>
          </div>
        ) : null}
      </section>

      {/* FAQ */}
      <div className="mt-16">
        <CityFAQ
          cityName={city.name}
          stateAbbr={city.state.abbreviation}
          listingCount={stats.listingCount}
          walkInCount={stats.walkInCount}
          styles={styleNames}
        />
      </div>

      {/* Tips */}
      <div className="mt-16">
        <TattooTips />
      </div>

      {/* Browse styles nationwide */}
      {categories.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100">
            Browse Styles Nationwide
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-teal-500 dark:hover:text-teal-400"
              >
                {cat.name} Nationwide
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other cities */}
      {otherCities.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100">
            Other Cities in {city.state.name}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherCities.map((c) => (
              <CityCard key={c.id} city={c} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 text-center">
        <Link
          href={`/tattoo-shops/${city.state.slug}`}
          className="text-sm font-semibold text-teal-500 hover:text-teal-600 dark:text-teal-400"
        >
          &larr; All cities in {city.state.name}
        </Link>
      </div>
    </div>
  );
}
