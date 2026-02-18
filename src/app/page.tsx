export const dynamic = "force-dynamic";

import { SearchBar } from "@/components/SearchBar";
import { ListingGrid } from "@/components/ListingGrid";
import { CategoryCard } from "@/components/CategoryCard";
import { CityCard } from "@/components/CityCard";
import { StockImage } from "@/components/StockImage";
import { JsonLd, websiteJsonLd } from "@/components/JsonLd";
import { HERO_IMAGE } from "@/lib/images";
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
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <StockImage
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>

        {/* Content */}
        <div className="relative px-4 py-28 text-center sm:py-36 lg:py-44">
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find the Best{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Tattoo Artists
            </span>{" "}
            Near You
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
            Browse thousands of tattoo shops and artists by style, city, and ratings.
            Your next tattoo starts here.
          </p>
          <div className="mt-10 flex justify-center">
            <SearchBar size="large" />
          </div>

          {/* Trust indicators */}
          <div className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-neutral-400">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Real reviews
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Nationwide coverage
            </span>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="section-heading text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Featured Shops
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">
              Hand-picked tattoo shops with outstanding artists and reviews.
            </p>
          </div>
          <ListingGrid listings={featured} />
        </section>
      )}

      {/* Popular Styles */}
      <section className="border-y border-neutral-100 bg-neutral-50/50 dark:border-neutral-800/50 dark:bg-neutral-950/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="section-heading text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Browse by Style
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">
              Find artists who specialize in your preferred tattoo style.
            </p>
          </div>
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
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="section-heading text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Top Cities
          </h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            Explore the best tattoo scenes in major cities across the US.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      {recent.length > 0 && (
        <section className="border-t border-neutral-100 bg-neutral-50/50 dark:border-neutral-800/50 dark:bg-neutral-950/50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="section-heading text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Recently Added
              </h2>
              <p className="mt-4 text-neutral-500 dark:text-neutral-400">
                The latest tattoo shops and artists added to our directory.
              </p>
            </div>
            <ListingGrid listings={recent} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-neutral-900 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Own a tattoo shop?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">
            Get listed on InkLink Tattoo Finder and reach thousands of people
            looking for their next tattoo artist.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-red-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30"
          >
            List Your Shop
          </a>
        </div>
      </section>
    </>
  );
}
