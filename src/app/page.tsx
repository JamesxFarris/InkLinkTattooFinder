export const dynamic = "force-dynamic";

import { SearchBar } from "@/components/SearchBar";
import { ListingGrid } from "@/components/ListingGrid";
import { CategoryCard } from "@/components/CategoryCard";
import { CityCard } from "@/components/CityCard";
import { JsonLd, websiteJsonLd } from "@/components/JsonLd";
import { getAllCategories, getTopCities, getFeaturedListings, getRecentListings } from "@/lib/queries";

export default async function HomePage() {
  const [categories, cities, featured, recent] = await Promise.all([
    getAllCategories(),
    getTopCities(12),
    getFeaturedListings(6),
    getRecentListings(6),
  ]);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-neutral-900 to-neutral-800 px-4 py-20 text-center text-white sm:py-28">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-red-500">InkLink</span> Tattoo Finder — Find the Best Tattoo Artists Near You
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-300">
          Browse thousands of tattoo shops and artists by style, city, and ratings.
          Your next tattoo starts here.
        </p>
        <div className="mt-8 flex justify-center">
          <SearchBar />
        </div>
      </section>

      {/* Featured Listings */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Featured Shops
          </h2>
          <ListingGrid listings={featured} />
        </section>
      )}

      {/* Popular Styles */}
      <section className="bg-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Browse by Style
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 12).map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                href={`/categories/${category.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Top Cities */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Top Cities
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      {recent.length > 0 && (
        <section className="bg-neutral-50 dark:bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Recently Added
            </h2>
            <ListingGrid listings={recent} />
          </div>
        </section>
      )}
    </>
  );
}
