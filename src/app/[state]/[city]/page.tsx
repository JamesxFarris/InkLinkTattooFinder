export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryCard } from "@/components/CategoryCard";
import { ListingGrid } from "@/components/ListingGrid";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd, itemListJsonLd } from "@/components/JsonLd";
import {
  getCityBySlug,
  getCategoriesForCity,
  getListingsByCity,
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

  const [categories, { listings }] = await Promise.all([
    getCategoriesForCity(city.id),
    getListingsByCity(city.id, 1, 12),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([
        { label: city.state.name, href: `/${city.state.slug}` },
        { label: city.name },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        name: `Tattoo Shops in ${city.name}, ${city.state.abbreviation}`,
        description: `Find the best tattoo artists and shops in ${city.name}, ${city.state.name}.`,
        url: `/${stateSlug}/${citySlug}`,
      })} />
      <JsonLd data={itemListJsonLd(listings.map((l, i) => ({
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

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Tattoo Shops in {city.name}, {city.state.abbreviation}
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Find the best tattoo artists and shops in {city.name},{" "}
        {city.state.name}. Browse by style or explore all listings below.
      </p>

      {/* Categories for this city */}
      {categories.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
            Browse by Style
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                href={`/${stateSlug}/${citySlug}/${category.slug}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* All listings */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
          All Shops in {city.name}
        </h2>
        <ListingGrid listings={listings} />
      </section>
    </div>
  );
}
