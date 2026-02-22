export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd, localBusinessJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { getListingBySlug, getRelatedListings, getCategoriesForCity } from "@/lib/queries";
import { listingPageMeta } from "@/lib/seo";
import { formatPhone, listingUrl } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ClaimButton } from "@/components/listing/ClaimButton";
import { MapEmbed } from "@/components/listing/MapEmbed";
import { PhotoGallery } from "@/components/listing/PhotoGallery";
import type { Metadata } from "next";

type Props = { params: Promise<{ state: string; city: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, slug } = await params;
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
    alternates: { canonical: `/tattoo-shops/${state}/${city}/${slug}` },
  };
}


export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const session = await auth();

  // Only owners and admins can view non-active listings
  if (listing.status !== "active") {
    const isOwner = listing.ownerId != null && session && listing.ownerId === parseInt(session.user.id);
    const isAdmin = session?.user.role === "admin";
    if (!isOwner && !isAdmin) notFound();
  }

  let existingClaimStatus: "pending" | "approved" | "denied" | null = null;
  const isOwned = !!listing.ownerId && listing.ownerId === (session ? parseInt(session.user.id) : -1);

  if (session) {
    const existingClaim = await prisma.claim.findUnique({
      where: {
        userId_listingId: {
          userId: parseInt(session.user.id),
          listingId: listing.id,
        },
      },
      select: { status: true },
    });
    if (existingClaim) {
      existingClaimStatus = existingClaim.status;
    }
  }

  const stateSlug = listing.city.state.slug;
  const citySlug = listing.city.slug;
  const hours = listing.hours as Record<string, string> | null;
  const photos = listing.photos as string[] | null;
  const artists = listing.artists as string[] | null;
  const services = listing.services as string[] | null;

  const categoryIds = listing.categories.map((c) => c.category.id);
  const [relatedListings, cityCategories] = await Promise.all([
    getRelatedListings(listing.id, listing.cityId, categoryIds, 6),
    getCategoriesForCity(listing.cityId),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={localBusinessJsonLd({
          name: listing.name,
          slug: listing.slug,
          stateSlug,
          citySlug,
          description: listing.description,
          address: listing.address,
          city: listing.city.name,
          state: listing.city.state.abbreviation,
          zipCode: listing.zipCode,
          phone: listing.phone,
          email: listing.email,
          website: listing.website,
          latitude: listing.latitude,
          longitude: listing.longitude,
          googleRating: listing.googleRating,
          googleReviewCount: listing.googleReviewCount,
          hours,
          priceRange: listing.priceRange,
          photos,
          categories: listing.categories.map(({ category }) => category.name),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: listing.city.state.name, href: `/tattoo-shops/${stateSlug}` },
          { label: listing.city.name, href: `/tattoo-shops/${stateSlug}/${citySlug}` },
          { label: listing.name },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: "Tattoo Shops", href: "/tattoo-shops" },
          { label: listing.city.state.name, href: `/tattoo-shops/${stateSlug}` },
          { label: listing.city.name, href: `/tattoo-shops/${stateSlug}/${citySlug}` },
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
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                    {listing.name}
                  </h1>
                  {session?.user.role === "admin" && (
                    <Link
                      href={`/dashboard/listings/${listing.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-600 transition-colors hover:bg-teal-500/20 dark:text-teal-400"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                      Edit
                    </Link>
                  )}
                </div>
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

            {listing.googleRating ? (
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
            ) : (
              <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">Not rated</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {listing.categories.map(({ category }) => (
                <Link
                  key={category.id}
                  href={`/tattoo-shops/${stateSlug}/${citySlug}?style=${category.slug}`}
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

            {/* Artists */}
            {artists && artists.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Artists
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {artists.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                    >
                      <svg className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mt-6 flex flex-wrap gap-3">
              {(listing.hourlyRateMin || listing.hourlyRateMax) && (
                <div className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm dark:bg-stone-800">
                  {listing.hourlyRateMin && listing.hourlyRateMax
                    ? `$${listing.hourlyRateMin}–$${listing.hourlyRateMax}/hr`
                    : listing.hourlyRateMin
                      ? `From $${listing.hourlyRateMin}/hr`
                      : `Up to $${listing.hourlyRateMax}/hr`}
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
              {services && services
                .filter((s) => !/^(tattooing|tattoos?|custom (tattoo|design)s?)$/i.test(s))
                .map((s) => (
                <div key={s} className="rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile-only Contact Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 lg:hidden dark:border-stone-700 dark:bg-stone-900">
            {listing.phone && (
              <a href={`tel:${listing.phone}`} className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {formatPhone(listing.phone)}
              </a>
            )}
            {listing.website && (
              <a href={listing.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-stone-600 dark:text-stone-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
              </a>
            )}
            {listing.address && (
              <span className="text-sm text-stone-500 dark:text-stone-400">
                {listing.address}, {listing.city.name}, {listing.city.state.abbreviation} {listing.zipCode}
              </span>
            )}
          </div>

          {/* Photos */}
          {photos && photos.length > 0 && (
            <PhotoGallery photos={photos} featured={listing.featured} />
          )}

          {/* Map */}
          {listing.latitude && listing.longitude && (
            <MapEmbed
              latitude={listing.latitude}
              longitude={listing.longitude}
              name={listing.name}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info — hidden on mobile (shown inline above) */}
          <div className="hidden rounded-xl border border-stone-200 bg-white p-6 lg:block dark:border-stone-700 dark:bg-stone-900">
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
                  <a href={listing.website} target="_blank" rel="noopener noreferrer nofollow" className="text-teal-500 hover:underline">
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

          {/* Claim this Business */}
          <ClaimButton
            listingId={listing.id}
            existingClaimStatus={existingClaimStatus}
            isOwned={isOwned}
          />

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

      {/* Related Listings */}
      {relatedListings.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100">
            Other Tattoo Shops in {listing.city.name}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedListings.map((related) => (
              <Link
                key={related.id}
                href={listingUrl(related)}
                className="rounded-xl border border-stone-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-stone-700 dark:bg-stone-900"
              >
                <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                  {related.name}
                </h3>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {related.city.name}, {related.city.state.abbreviation}
                </p>
                {related.googleRating && (
                  <p className="mt-1 text-sm text-amber-500">
                    {"★".repeat(Math.round(related.googleRating))} {related.googleRating}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular Styles in City */}
      {cityCategories.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100">
            Popular Styles in {listing.city.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {cityCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tattoo-shops/${stateSlug}/${citySlug}?style=${cat.slug}`}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-teal-500 dark:hover:text-teal-400"
              >
                {cat.name} ({cat._count.listings})
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
