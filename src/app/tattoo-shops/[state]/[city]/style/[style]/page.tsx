export const revalidate = 3600;

import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingSearch } from "@/components/ListingSearch";
import { StyleFilter } from "@/components/StyleFilter";
import {
  JsonLd,
  itemListJsonLd,
  breadcrumbJsonLd,
} from "@/components/JsonLd";
import {
  getCityBySlug,
  getAllListingsByCity,
  getCategoriesForCity,
  getCategoryBySlug,
  getTopCitiesForCategory,
} from "@/lib/queries";
import { cityCategoryPageMeta } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ state: string; city: string; style: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug, style: styleSlug } = await params;
  const city = await getCityBySlug(citySlug, stateSlug);
  if (!city) return {};
  const category = await getCategoryBySlug(styleSlug);
  if (!category) return {};

  const meta = cityCategoryPageMeta(
    city.name,
    city.state.abbreviation,
    category.name
  );
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
    alternates: {
      canonical: `/tattoo-shops/${stateSlug}/${citySlug}/style/${styleSlug}`,
    },
  };
}

export default async function CityStylePage({ params }: Props) {
  const { state: stateSlug, city: citySlug, style: styleSlug } = await params;
  const city = await getCityBySlug(citySlug, stateSlug);
  if (!city) notFound();

  const category = await getCategoryBySlug(styleSlug);
  if (!category) notFound();

  const [allListings, categories, otherCities] = await Promise.all([
    getAllListingsByCity(city.id),
    getCategoriesForCity(city.id),
    getTopCitiesForCategory(category.id, 8),
  ]);

  const listings = allListings.filter((l) =>
    l.categories.some((c) => c.category.slug === styleSlug)
  );

  const baseUrl = "https://inklinktattoofinder.com";
  const basePath = `/tattoo-shops/${stateSlug}/${citySlug}`;

  const crossLinkCities = otherCities.filter((c) => c.id !== city.id).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={itemListJsonLd(
          listings.map((l, i) => ({
            name: l.name,
            url: `${baseUrl}/tattoo-shops/${stateSlug}/${citySlug}/${l.slug}`,
            position: i + 1,
          }))
        )}
      />
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
            url: `${baseUrl}${basePath}`,
          },
          {
            name: category.name,
            url: `${baseUrl}${basePath}/style/${styleSlug}`,
          },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: "Tattoo Shops", href: "/tattoo-shops" },
          { label: city.state.name, href: `/tattoo-shops/${city.state.slug}` },
          { label: city.name, href: basePath },
          { label: category.name },
        ]}
      />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        {listings.length} {category.name} Tattoo{" "}
        {listings.length === 1 ? "Artist" : "Artists"} in {city.name},{" "}
        {city.state.abbreviation}
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-400">
        Find the best {category.name.toLowerCase()} tattoo artists in{" "}
        {city.name}, {city.state.name}. Browse portfolios, read reviews, and
        book your next tattoo.
      </p>

      {/* Style filter */}
      {categories.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Filter by Style
          </h2>
          <StyleFilter
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
            }))}
            basePath={basePath}
            activeStyle={styleSlug}
          />
        </div>
      )}

      {/* Listing count */}
      <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">
        Showing {listings.length} {category.name.toLowerCase()} tattoo{" "}
        {listings.length === 1 ? "shop" : "shops"} in {city.name}
      </p>

      {/* Listings */}
      <section className="mt-4">
        <ListingSearch
          listings={listings}
          placeholder={`Search ${category.name} shops in ${city.name}...`}
          emptyMessage={`No ${category.name.toLowerCase()} tattoo shops found in ${city.name} yet.`}
        />
      </section>

      {/* Back to city page */}
      <div className="mt-10 text-center">
        <Link
          href={basePath}
          className="text-sm font-semibold text-teal-500 hover:text-teal-600 dark:text-teal-400"
        >
          &larr; All tattoo shops in {city.name}
        </Link>
      </div>

      {/* Cross-links: same style in other cities */}
      {crossLinkCities.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100">
            {category.name} Tattoos in Other Cities
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {crossLinkCities.map((c) => (
              <Link
                key={c.id}
                href={`/tattoo-shops/${c.state.slug}/${c.slug}/style/${styleSlug}`}
                className="rounded-xl border border-stone-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-lg dark:border-stone-700 dark:bg-stone-800 dark:hover:border-teal-500/40"
              >
                <span className="block text-sm font-semibold text-stone-800 dark:text-stone-200">
                  {c.name}
                </span>
                <span className="mt-0.5 block text-xs text-stone-500 dark:text-stone-400">
                  {c.state.abbreviation}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Browse this style nationwide */}
      <section className="mt-10">
        <Link
          href={`/categories/${styleSlug}`}
          className="text-sm font-semibold text-teal-500 hover:text-teal-600 dark:text-teal-400"
        >
          Browse all {category.name} tattoo artists nationwide &rarr;
        </Link>
      </section>
    </div>
  );
}
