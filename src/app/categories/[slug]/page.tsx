export const revalidate = 3600;

import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingSearch } from "@/components/ListingSearch";
import { Pagination } from "@/components/Pagination";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/components/JsonLd";
import { getCategoryBySlug, getListingsByCategoryNational, getTopCitiesForCategory } from "@/lib/queries";
import { categoryPageMeta } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  const meta = categoryPageMeta(category.name);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10));

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [{ listings, totalPages }, topCities] = await Promise.all([
    getListingsByCategoryNational(category.id, page),
    getTopCitiesForCategory(category.id, 10),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([
        { label: "Styles", href: "/categories" },
        { label: category.name },
      ])} />
      <JsonLd data={itemListJsonLd(listings.map((l, i) => ({
        name: l.name,
        url: `https://inklinktattoofinder.com/tattoo-shops/${l.city.state.slug}/${l.city.slug}/${l.slug}`,
        position: i + 1,
      })))} />
      <Breadcrumbs
        items={[
          { label: "Styles", href: "/categories" },
          { label: category.name },
        ]}
      />

      <div className="flex items-center gap-3">
        {category.icon && <span className="text-3xl">{category.icon}</span>}
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          {category.name} Tattoo Artists
        </h1>
      </div>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        {category.description ||
          `Find ${category.name.toLowerCase()} tattoo artists across the United States.`}
      </p>

      <section className="mt-8">
        <ListingSearch
          listings={listings}
          placeholder={`Search ${category.name} shops by name, city, or state...`}
          emptyMessage={`No ${category.name.toLowerCase()} tattoo shops found.`}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/categories/${slug}`}
        />
      </section>

      {/* Top Cities for this Style */}
      {topCities.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100">
            Top Cities for {category.name} Tattoos
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {topCities.map((city) => (
              <Link
                key={city.id}
                href={`/tattoo-shops/${city.state.slug}/${city.slug}?style=${slug}`}
                className="rounded-xl border border-stone-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-lg dark:border-stone-700 dark:bg-stone-800 dark:hover:border-teal-500/40"
              >
                <span className="block text-sm font-semibold text-stone-800 dark:text-stone-200">
                  {city.name}
                </span>
                <span className="mt-0.5 block text-xs text-stone-500 dark:text-stone-400">
                  {city.state.abbreviation} &middot; {city._count.listings} {city._count.listings === 1 ? "shop" : "shops"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
