export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CityGrid } from "@/components/CityGrid";
import { StatsBar } from "@/components/StatsBar";
import { BrowseStates } from "@/components/BrowseStates";
import {
  JsonLd,
  itemListJsonLd,
  breadcrumbJsonLd,
} from "@/components/JsonLd";
import {
  getStateBySlug,
  getCitiesByState,
  getStateStats,
  getAllStates,
  getPopularCategoriesInState,
} from "@/lib/queries";
import { getCityImageUrl } from "@/lib/images";
import { statePageMeta } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ state: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);
  if (!state) return {};
  const meta = statePageMeta(state.name, state._count.listings);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
    alternates: { canonical: `/tattoo-shops/${stateSlug}` },
  };
}

export default async function StatePillarPage({ params }: Props) {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);
  if (!state) notFound();

  const [cities, stats, allStates, popularCategories] = await Promise.all([
    getCitiesByState(state.id),
    getStateStats(state.id),
    getAllStates(),
    getPopularCategoriesInState(state.id),
  ]);

  // Pre-compute image URLs server-side for the client CityGrid component
  const cityImageUrls: Record<number, string> = {};
  for (const city of cities) {
    cityImageUrls[city.id] = getCityImageUrl(city);
  }

  const baseUrl = "https://inklinktattoofinder.com";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={itemListJsonLd(
          cities.map((c, i) => ({
            name: `${c.name}, ${state.abbreviation}`,
            url: `${baseUrl}/tattoo-shops/${state.slug}/${c.slug}`,
            position: i + 1,
          }))
        )}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Tattoo Shops", url: `${baseUrl}/tattoo-shops` },
          { name: state.name, url: `${baseUrl}/tattoo-shops/${state.slug}` },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: "Tattoo Shops", href: "/tattoo-shops" },
          { label: state.name },
        ]}
      />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Best Tattoo Shops & Artists in {state.name}
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-400">
        Discover top-rated tattoo shops and talented artists across{" "}
        {state.name}. Browse by city to find the best ink near you.
      </p>

      <div className="mt-8">
        <StatsBar
          stats={[
            { label: "Total Shops", value: stats.listingCount },
            { label: "Cities Covered", value: stats.cityCount },
            {
              label: "Avg Rating",
              value: stats.avgRating ? `${stats.avgRating} / 5` : "N/A",
            },
          ]}
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
          Cities in {state.name}
        </h2>
        {cities.length > 0 ? (
          <CityGrid cities={cities} imageUrls={cityImageUrls} />
        ) : (
          <p className="mt-8 text-center text-stone-500">
            No cities with listings found in {state.name} yet. Check back soon!
          </p>
        )}
      </section>

      {/* Popular Tattoo Styles */}
      {popularCategories.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100">
            Popular Tattoo Styles in {state.name}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="rounded-xl border border-stone-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-lg dark:border-stone-700 dark:bg-stone-800 dark:hover:border-teal-500/40"
              >
                {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                <span className="mt-1 block text-sm font-semibold text-stone-800 dark:text-stone-200">
                  {cat.name}
                </span>
                <span className="mt-0.5 block text-xs text-stone-500 dark:text-stone-400">
                  {cat._count.listings} {cat._count.listings === 1 ? "shop" : "shops"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Why Get a Tattoo in {state.name}?
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-stone-600 dark:text-stone-400">
          {state.name} is home to a vibrant tattoo community with shops and
          artists offering everything from classic American traditional to
          cutting-edge contemporary styles. Whether you&apos;re looking for your
          first tattoo or adding to a collection, {state.name}&apos;s diverse
          cities each bring their own unique tattoo culture and talented artists
          to choose from.
        </p>
      </section>

      <div className="mt-16">
        <BrowseStates states={allStates} currentStateSlug={state.slug} />
      </div>
    </div>
  );
}
