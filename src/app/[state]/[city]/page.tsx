export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingGrid } from "@/components/ListingGrid";
import { StyleDropdown } from "@/components/StyleDropdown";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd, itemListJsonLd, faqJsonLd } from "@/components/JsonLd";
import { generateCityFaqItems } from "@/lib/faq";
import { CityFaq } from "@/components/CityFaq";
import {
  getCityBySlug,
  getCategoriesForCity,
  getFeaturedListingsByCity,
  getNonFeaturedListingsByCity,
  getSiblingCities,
} from "@/lib/queries";
import { cityPageMeta } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ state: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug, stateSlug);
  if (!city) return {};
  const meta = cityPageMeta(city.name, city.state.abbreviation);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
  };
}

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const city = await getCityBySlug(citySlug, stateSlug);
  if (!city) notFound();

  const [categories, featured, { listings }, siblingCities] = await Promise.all([
    getCategoriesForCity(city.id),
    getFeaturedListingsByCity(city.id),
    getNonFeaturedListingsByCity(city.id, 1, 12),
    getSiblingCities(city.stateId, city.id, 12),
  ]);

  const allListings = [...featured, ...listings];

  const faqItems = generateCityFaqItems({
    cityName: city.name,
    stateName: city.state.name,
    stateAbbreviation: city.state.abbreviation,
    listingCount: allListings.length,
    categoryNames: categories.map((c) => c.name),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={faqJsonLd(faqItems)} />
      <JsonLd data={breadcrumbJsonLd([
        { label: city.state.name, href: `/${city.state.slug}` },
        { label: city.name },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        name: `Tattoo Shops in ${city.name}, ${city.state.abbreviation}`,
        description: `Find the best tattoo artists and shops in ${city.name}, ${city.state.name}.`,
        url: `/${stateSlug}/${citySlug}`,
      })} />
      <JsonLd data={itemListJsonLd(allListings.map((l, i) => ({
        name: l.name,
        url: `https://inklinktattoofinder.com/listing/${l.slug}`,
        position: i + 1,
      })))} />
      <Breadcrumbs
        items={[
          { label: city.state.name, href: `/${city.state.slug}` },
          { label: city.name },
        ]}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Tattoo Shops in {city.name}, {city.state.abbreviation}
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Find the best tattoo artists and shops in {city.name},{" "}
            {city.state.name}.
          </p>
        </div>
        {categories.length > 0 && (
          <StyleDropdown
            styles={categories.map((c) => ({
              slug: c.slug,
              name: c.name,
              count: c._count.listings,
            }))}
            basePath={`/${stateSlug}/${citySlug}`}
          />
        )}
      </div>

      {/* Featured Shops */}
      {featured.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-amber-500" aria-hidden="true">&#9733;</span>
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              Featured Shops
            </h2>
          </div>
          <ListingGrid listings={featured} />
        </section>
      )}

      {/* All listings */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
          {featured.length > 0 ? "All Shops" : `All Shops in ${city.name}`}
        </h2>
        <ListingGrid listings={listings} />
      </section>

      {/* Other Cities in State */}
      {siblingCities.length > 0 && (
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                More Cities in {city.state.name}
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Explore tattoo shops in other {city.state.name} cities.
              </p>
            </div>
            <Link
              href={`/${city.state.slug}`}
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
                  {sibling._count.listings} {sibling._count.listings === 1 ? "shop" : "shops"}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={`/${city.state.slug}`}
            className="mt-4 block text-center text-sm font-medium text-teal-500 hover:text-teal-400 sm:hidden"
          >
            View all cities in {city.state.name} &rarr;
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
    </div>
  );
}
