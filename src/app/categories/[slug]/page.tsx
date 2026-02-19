export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingGrid } from "@/components/ListingGrid";
import { Pagination } from "@/components/Pagination";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/components/JsonLd";
import { getCategoryBySlug, getListingsByCategoryNational } from "@/lib/queries";
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

  const { listings, totalPages } = await getListingsByCategoryNational(
    category.id,
    page
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([
        { label: "Styles", href: "/categories" },
        { label: category.name },
      ])} />
      <JsonLd data={itemListJsonLd(listings.map((l, i) => ({
        name: l.name,
        url: `https://inklinktattoofinder.com/listing/${l.slug}`,
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
        <ListingGrid listings={listings} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/categories/${slug}`}
        />
      </section>
    </div>
  );
}
