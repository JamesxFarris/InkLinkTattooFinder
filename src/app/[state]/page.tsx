export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CityCard } from "@/components/CityCard";
import { ListingGrid } from "@/components/ListingGrid";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd, itemListJsonLd } from "@/components/JsonLd";
import { getStateBySlug, getCitiesByState, getFeaturedListingsByState } from "@/lib/queries";
import { statePageMeta } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ state: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);
  if (!state) return {};
  const meta = statePageMeta(state.name);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
  };
}


export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);
  if (!state) notFound();

  const [cities, featured] = await Promise.all([
    getCitiesByState(state.id),
    getFeaturedListingsByState(state.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ label: state.name }])} />
      <JsonLd data={collectionPageJsonLd({
        name: `Tattoo Shops in ${state.name}`,
        description: `Browse tattoo shops and artists across ${state.name}.`,
        url: `/${stateSlug}`,
      })} />
      <JsonLd data={itemListJsonLd(cities.map((city, i) => ({
        name: city.name,
        url: `https://inklinktattoofinder.com/${stateSlug}/${city.slug}`,
        position: i + 1,
      })))} />
      <Breadcrumbs items={[{ label: state.name }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Tattoo Shops in {state.name}
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Browse tattoo shops and artists across {state.name}. Select a city below
        to find the best ink near you.
      </p>

      {/* Featured Shops */}
      {featured.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
            Featured Shops in {state.name}
          </h2>
          <ListingGrid listings={featured} />
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
          Cities in {state.name}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </section>

      {cities.length === 0 && (
        <p className="mt-8 text-center text-stone-500">
          No cities with listings found in {state.name} yet. Check back soon!
        </p>
      )}
    </div>
  );
}
