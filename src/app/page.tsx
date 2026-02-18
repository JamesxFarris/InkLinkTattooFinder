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
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/75 via-stone-900/60 to-stone-900/80" />
        </div>

        {/* Content */}
        <div className="relative px-4 py-28 text-center sm:py-36 lg:py-44">
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find the Best{" "}
            <span className="text-red-400">Tattoo Artists</span>{" "}
            Near You
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-300">
            Browse thousands of tattoo shops and artists by style, city, and ratings.
            Your next tattoo starts here.
          </p>
          <div className="mt-10 flex justify-center">
            <SearchBar size="large" />
          </div>

          {/* Trust indicators */}
          <div className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-stone-300/80">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Real reviews
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
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
            <h2 className="section-heading text-3xl font-bold text-stone-900 dark:text-stone-100">
              Featured Shops
            </h2>
            <p className="mt-4 text-stone-500 dark:text-stone-400">
              Hand-picked tattoo shops with outstanding artists and reviews.
            </p>
          </div>
          <ListingGrid listings={featured} />
        </section>
      )}

      {/* Popular Styles */}
      <section className="border-y border-stone-200/60 bg-stone-100/40 dark:border-stone-800/40 dark:bg-stone-900/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="section-heading text-3xl font-bold text-stone-900 dark:text-stone-100">
              Browse by Style
            </h2>
            <p className="mt-4 text-stone-500 dark:text-stone-400">
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
          <h2 className="section-heading text-3xl font-bold text-stone-900 dark:text-stone-100">
            Top Cities
          </h2>
          <p className="mt-4 text-stone-500 dark:text-stone-400">
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
        <section className="border-t border-stone-200/60 bg-stone-100/40 dark:border-stone-800/40 dark:bg-stone-900/30">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="section-heading text-3xl font-bold text-stone-900 dark:text-stone-100">
                Recently Added
              </h2>
              <p className="mt-4 text-stone-500 dark:text-stone-400">
                The latest tattoo shops and artists added to our directory.
              </p>
            </div>
            <ListingGrid listings={recent} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-stone-900 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Own a tattoo shop?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-400">
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
