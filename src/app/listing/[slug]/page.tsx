export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd, localBusinessJsonLd } from "@/components/JsonLd";
import { getListingBySlug } from "@/lib/queries";
import { listingPageMeta } from "@/lib/seo";
import { formatPhone } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return {};
  const meta = listingPageMeta(
    listing.name,
    listing.city.name,
    listing.city.state.abbreviation
  );
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
  };
}


export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const stateSlug = listing.city.state.slug;
  const citySlug = listing.city.slug;
  const hours = listing.hours as Record<string, string> | null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={localBusinessJsonLd({
          name: listing.name,
          description: listing.description,
          address: listing.address,
          city: listing.city.name,
          state: listing.city.state.abbreviation,
          zipCode: listing.zipCode,
          phone: listing.phone,
          website: listing.website,
          latitude: listing.latitude,
          longitude: listing.longitude,
          googleRating: listing.googleRating,
          googleReviewCount: listing.googleReviewCount,
          hours,
        })}
      />

      <Breadcrumbs
        items={[
          { label: listing.city.state.name, href: `/${stateSlug}` },
          { label: listing.city.name, href: `/${stateSlug}/${citySlug}` },
          { label: listing.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                  {listing.name}
                </h1>
                <p className="mt-1 text-stone-600 dark:text-stone-400">
                  {listing.address && `${listing.address}, `}
                  {listing.city.name}, {listing.city.state.abbreviation}
                  {listing.zipCode && ` ${listing.zipCode}`}
                </p>
              </div>
              {listing.featured && (
                <Badge variant="primary">Featured</Badge>
              )}
            </div>

            {listing.googleRating && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(listing.googleRating!)
                          ? "text-amber-500"
                          : "text-stone-300 dark:text-stone-600"
                      }
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <span className="font-semibold">{listing.googleRating}</span>
                {listing.googleReviewCount && (
                  <span className="text-sm text-stone-500">
                    ({listing.googleReviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {listing.categories.map(({ category }) => (
                <Link
                  key={category.id}
                  href={`/${stateSlug}/${citySlug}/${category.slug}`}
                >
                  <Badge variant="default">{category.name}</Badge>
                </Link>
              ))}
            </div>

            {listing.description && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  About
                </h2>
                <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-400">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Features */}
            <div className="mt-6 flex flex-wrap gap-3">
              {listing.priceRange && (
                <div className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm dark:bg-stone-800">
                  Price:{" "}
                  {listing.priceRange === "budget" && "$ Budget"}
                  {listing.priceRange === "moderate" && "$$ Moderate"}
                  {listing.priceRange === "premium" && "$$$ Premium"}
                  {listing.priceRange === "luxury" && "$$$$ Luxury"}
                </div>
              )}
              {listing.acceptsWalkIns && (
                <div className="rounded-lg bg-green-100 px-3 py-1.5 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                  Walk-ins Welcome
                </div>
              )}
              {listing.piercingServices && (
                <div className="rounded-lg bg-stone-200 px-3 py-1.5 text-sm text-stone-700 dark:bg-stone-700 dark:text-stone-300">
                  Piercing Services
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Contact
            </h2>
            <div className="mt-4 space-y-3">
              {listing.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${listing.phone}`} className="text-teal-500 hover:underline">
                    {formatPhone(listing.phone)}
                  </a>
                </div>
              )}
              {listing.website && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">
                    Visit Website
                  </a>
                </div>
              )}
              {listing.address && (
                <div className="flex items-start gap-3 text-sm">
                  <svg className="mt-0.5 h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-stone-600 dark:text-stone-400">
                    {listing.address}
                    <br />
                    {listing.city.name}, {listing.city.state.abbreviation}{" "}
                    {listing.zipCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Hours */}
          {hours && (
            <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Hours
              </h2>
              <div className="mt-4 space-y-2">
                {Object.entries(hours).map(([day, time]) => (
                  <div
                    key={day}
                    className="flex justify-between text-sm"
                  >
                    <span className="capitalize text-stone-600 dark:text-stone-400">
                      {day}
                    </span>
                    <span
                      className={
                        time === "closed"
                          ? "text-red-500"
                          : "font-medium text-stone-900 dark:text-stone-100"
                      }
                    >
                      {time === "closed" ? "Closed" : time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
