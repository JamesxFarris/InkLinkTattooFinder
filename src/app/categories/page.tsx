export const dynamic = "force-dynamic";

import { CategoryCard } from "@/components/CategoryCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllCategories } from "@/lib/queries";
import { categoriesPageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...categoriesPageMeta(),
  openGraph: categoriesPageMeta(),
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  const shopStyles = categories.filter((c) => c.type === "shop");
  const artistSpecs = categories.filter((c) => c.type === "artist");
  const suppliers = categories.filter((c) => c.type === "supplier");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Styles & Categories" }]} />

      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        Tattoo Styles & Categories
      </h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Browse all tattoo styles and find artists who specialize in your
        preferred look.
      </p>

      {/* Tattoo Styles */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
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

      {/* Artist Specializations */}
      {artistSpecs.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Artist Specializations
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artistSpecs.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                href={`/categories/${category.slug}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Services & Suppliers */}
      {suppliers.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Services & Suppliers
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((category) => (
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
