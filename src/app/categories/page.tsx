export const dynamic = "force-dynamic";

import { CategoryCard } from "@/components/CategoryCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd, itemListJsonLd } from "@/components/JsonLd";
import { getAllCategories } from "@/lib/queries";
import { categoriesPageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...categoriesPageMeta(),
  openGraph: categoriesPageMeta(),
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  const shopStyles = categories.filter((c) => c.type === "shop");
  const additionalServices = categories.filter((c) => c.type === "artist" || c.type === "supplier");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ label: "Styles & Categories" }])} />
      <JsonLd data={collectionPageJsonLd({
        name: "Tattoo Styles & Categories",
        description: "Browse all tattoo styles and find artists who specialize in your preferred look.",
        url: "/categories",
      })} />
      <JsonLd data={itemListJsonLd(categories.map((c, i) => ({
        name: c.name,
        url: `https://inklinktattoofinder.com/categories/${c.slug}`,
        position: i + 1,
      })))} />
      <Breadcrumbs items={[{ label: "Styles & Categories" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Tattoo Styles & Categories
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Browse all tattoo styles and find artists who specialize in your
        preferred look.
      </p>

      {/* Tattoo Styles */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
          Tattoo Styles
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shopStyles.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              href={`/categories/${category.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Additional Services */}
      {additionalServices.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
            Additional Services
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {additionalServices.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                href={`/categories/${category.slug}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
