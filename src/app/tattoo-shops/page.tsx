export const dynamic = "force-dynamic";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StateGrid } from "@/components/StateGrid";
import { StatsBar } from "@/components/StatsBar";
import { JsonLd, itemListJsonLd } from "@/components/JsonLd";
import { getAllStates } from "@/lib/queries";
import { statesIndexMeta } from "@/lib/seo";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  const meta = statesIndexMeta();
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
    alternates: { canonical: "/tattoo-shops" },
  };
}

export default async function StatesIndexPage() {
  const states = await getAllStates();

  const totalListings = states.reduce((sum, s) => sum + s._count.listings, 0);
  const totalCities = states.reduce((sum, s) => sum + s._count.cities, 0);

  const baseUrl = "https://inklinktattoofinder.com";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={itemListJsonLd(
          states.map((s, i) => ({
            name: s.name,
            url: `${baseUrl}/tattoo-shops/${s.slug}`,
            position: i + 1,
          }))
        )}
      />

      <Breadcrumbs items={[{ label: "Tattoo Shops" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Find Tattoo Shops & Artists in Every State
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-400">
        Browse the best tattoo shops and artists across the United States. Select
        a state to explore top-rated shops in cities near you.
      </p>

      <div className="mt-8">
        <StatsBar
          stats={[
            { label: "States", value: states.length },
            { label: "Total Shops", value: totalListings.toLocaleString() },
            { label: "Cities Covered", value: totalCities.toLocaleString() },
          ]}
        />
      </div>

      <StateGrid states={states} />
    </div>
  );
}
