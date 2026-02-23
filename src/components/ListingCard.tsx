import Link from "next/link";
import { Badge } from "./ui/Badge";
import { ImageCarousel } from "./ui/ImageCarousel";
import { listingUrl, formatPhone } from "@/lib/utils";
import type { ListingWithRelations } from "@/types";

export function ListingCard({ listing }: { listing: ListingWithRelations }) {
  const categoryNames = listing.categories.map((c) => c.category.name);
  const photos = listing.photos as string[] | null;
  const hasPhotos = photos && photos.length >= 1;

  if (!hasPhotos) {
    return <NoPhotoCard listing={listing} categoryNames={categoryNames} />;
  }

  return (
    <Link
      href={listingUrl(listing)}
      className={`group block overflow-hidden rounded-2xl bg-white shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--card-shadow-hover)] dark:bg-stone-900 ${listing.featured ? "ring-2 ring-amber-400 dark:ring-amber-500" : "ring-1 ring-stone-900/[0.04] dark:ring-stone-700"}`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <ImageCarousel
          images={photos.slice(0, 3)}
          alt={`${listing.name} — tattoo shop in ${listing.city.name}, ${listing.state.abbreviation}`}
        />
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent pointer-events-none" />

        {/* Featured badge */}
        {listing.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            Featured
          </span>
        )}

        {/* Verified badge */}
        {listing.ownerId && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verified
          </span>
        )}

        {/* Rating overlay */}
        {listing.googleRating ? (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-sm font-medium text-stone-900 backdrop-blur-sm dark:bg-stone-900/90 dark:text-stone-100">
            <span className="text-amber-500" aria-hidden="true">&#9733;</span>
            <span>{listing.googleRating}</span>
            {listing.googleReviewCount && (
              <span className="text-stone-400">({listing.googleReviewCount})</span>
            )}
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-sm font-medium text-stone-500 backdrop-blur-sm dark:bg-stone-900/90 dark:text-stone-400">
            Not rated
          </div>
        )}
      </div>

      <CardContent listing={listing} categoryNames={categoryNames} />
    </Link>
  );
}

function NoPhotoCard({
  listing,
  categoryNames,
}: {
  listing: ListingWithRelations;
  categoryNames: string[];
}) {
  return (
    <Link
      href={listingUrl(listing)}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--card-shadow-hover)] dark:bg-stone-900 ${listing.featured ? "ring-2 ring-amber-400 dark:ring-amber-500" : "ring-1 ring-stone-900/[0.04] dark:ring-stone-700"}`}
    >
      {/* Top section — name, badges, rating */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-stone-900 transition-colors group-hover:text-teal-500 dark:text-stone-100 dark:group-hover:text-teal-400">
              {listing.name}
            </h3>
            {listing.googleRating ? (
              <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-stone-700 dark:text-stone-300">
                <span className="text-amber-500" aria-hidden="true">&#9733;</span>
                {listing.googleRating}
              </div>
            ) : (
              <span className="shrink-0 text-sm text-stone-400 dark:text-stone-500">Not rated</span>
            )}
          </div>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
            <svg className="h-3.5 w-3.5 shrink-0 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {listing.address ? `${listing.address}, ` : ""}{listing.city.name}, {listing.state.abbreviation}
          </p>

          {(listing.featured || listing.ownerId) && (
            <div className="mt-2.5 flex items-center gap-2">
              {listing.featured && (
                <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                  Featured
                </span>
              )}
              {listing.ownerId && (
                <span className="flex items-center gap-1 rounded-full bg-teal-600 px-2 py-0.5 text-xs font-semibold text-white">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          )}
        </div>

        {/* Middle — description fills available space */}
        {listing.description && (
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            {listing.description}
          </p>
        )}

        {/* Contact info */}
        {!listing.phone && !listing.website && !listing.facebookUrl && !listing.instagramUrl && (
          <p className="mt-3 text-sm text-stone-400 dark:text-stone-500">No website or socials found</p>
        )}
        {(listing.phone || listing.website || listing.facebookUrl || listing.instagramUrl) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-stone-500 dark:text-stone-400">
            {listing.phone && (
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {formatPhone(listing.phone)}
              </span>
            )}
            {listing.website && (
              <span className="flex items-center gap-1.5 text-teal-500">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                </svg>
                Website
              </span>
            )}
            {listing.facebookUrl && (
              <span className="flex items-center gap-1.5 text-[#1877F2]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </span>
            )}
            {listing.instagramUrl && (
              <span className="flex items-center gap-1.5 text-pink-500">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram
              </span>
            )}
          </div>
        )}

        {categoryNames.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categoryNames.slice(0, 3).map((name) => (
              <Badge key={name} variant="default">
                {name}
              </Badge>
            ))}
            {categoryNames.length > 3 && (
              <Badge variant="outline">+{categoryNames.length - 3}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Footer — pinned to bottom */}
      <div className="flex items-center gap-2 border-t border-stone-100 px-5 py-3 text-xs font-medium text-stone-500 dark:border-stone-700 dark:text-stone-400">
        {(listing.hourlyRateMin || listing.hourlyRateMax) && (
          <span className="rounded-md bg-stone-100 px-2 py-0.5 dark:bg-stone-800">
            {listing.hourlyRateMin && listing.hourlyRateMax
              ? `$${listing.hourlyRateMin}–$${listing.hourlyRateMax}/hr`
              : listing.hourlyRateMin
                ? `From $${listing.hourlyRateMin}/hr`
                : `Up to $${listing.hourlyRateMax}/hr`}
          </span>
        )}
        {listing.acceptsWalkIns && (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Walk-ins
          </span>
        )}
        {listing.piercingServices && <span>Piercings</span>}
      </div>
    </Link>
  );
}

function CardContent({
  listing,
  categoryNames,
}: {
  listing: ListingWithRelations;
  categoryNames: string[];
}) {
  return (
    <div className="p-5">
      <h3 className="text-lg font-semibold text-stone-900 transition-colors group-hover:text-teal-500 dark:text-stone-100 dark:group-hover:text-teal-400">
        {listing.name}
      </h3>

      <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
        <svg className="h-3.5 w-3.5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {listing.city.name}, {listing.state.abbreviation}
      </p>

      {listing.description && (
        <p className="mt-1.5 line-clamp-3 text-sm leading-snug text-stone-500 dark:text-stone-400">
          {listing.description}
        </p>
      )}

      {categoryNames.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {categoryNames.slice(0, 3).map((name) => (
            <Badge key={name} variant="default">
              {name}
            </Badge>
          ))}
          {categoryNames.length > 3 && (
            <Badge variant="outline">+{categoryNames.length - 3}</Badge>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 overflow-hidden border-t border-stone-100 pt-3 text-xs font-medium text-stone-500 dark:border-stone-700 dark:text-stone-400">
        {(listing.hourlyRateMin || listing.hourlyRateMax) && (
          <span className="rounded-md bg-stone-100 px-2 py-0.5 dark:bg-stone-800">
            {listing.hourlyRateMin && listing.hourlyRateMax
              ? `$${listing.hourlyRateMin}–$${listing.hourlyRateMax}/hr`
              : listing.hourlyRateMin
                ? `From $${listing.hourlyRateMin}/hr`
                : `Up to $${listing.hourlyRateMax}/hr`}
          </span>
        )}
        {listing.acceptsWalkIns && (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Walk-ins
          </span>
        )}
        {listing.piercingServices && <span>Piercings</span>}
        {listing.website && (
          <span className="flex items-center gap-1 text-teal-500">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
            </svg>
            Website
          </span>
        )}
        {listing.facebookUrl && (
          <span className="flex items-center gap-1 text-[#1877F2]">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </span>
        )}
        {listing.instagramUrl && (
          <span className="flex items-center gap-1 text-pink-500">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
