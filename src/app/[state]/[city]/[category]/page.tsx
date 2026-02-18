export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingGrid } from "@/components/ListingGrid";
import { Pagination } from "@/components/Pagination";
import { JsonLd, itemListJsonLd } from "@/components/JsonLd";
import {
  getCityBySlug,
  getCategoryBySlug,
  getListingsByCityAndCategory,
} from "@/lib/queries";
import { cityCategoryPageMeta } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ state: string; city: string; category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug, category: categorySlug } = await params;
  const [city, category] = await Promise.all([
    getCityBySlug(citySlug, stateSlug),
    getCategoryBySlug(categorySlug),
  ]);
  if (!city || !category) return {};
  const meta = cityCategoryPageMeta(
    city.name,
    city.state.abbreviation,
    category.name
  );
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
  };
}

export default async function CityCategoryPage({ params, searchParams }: Props) {
  const { state: stateSlug, city: citySlug, category: categorySlug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10));

  const [city, category] = await Promise.all([
    getCityBySlug(citySlug, stateSlug),
    getCategoryBySlug(categorySlug),
  ]);
  if (!city || !category) notFound();

  const { listings, totalPages } = await getListingsByCityAndCategory(
    city.id,
    category.id,
    page
  );

  const jsonLdItems = listings.map((l, i) => ({
    name: l.name,
    url: `https://inkfinder.com/listing/${l.slug}`,
    position: i + 1,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={itemListJsonLd(jsonLdItems)} />

      <Breadcrumbs
        items={[
          { label: city.state.name, href: `/${stateSlug}` },
          { label: city.name, href: `/${stateSlug}/${citySlug}` },
          { label: category.name },
        ]}
      />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        {category.name} Tattoo Artists in {city.name},{" "}
        {city.state.abbreviation}
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        {category.description ||
          `Browse ${category.name.toLowerCase()} tattoo artists in ${city.name}, ${city.state.name}.`}
      </p>

      <section className="mt-8">
        <ListingGrid listings={listings} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/${stateSlug}/${citySlug}/${categorySlug}`}
        />
      </section>
    </div>
  );
}
