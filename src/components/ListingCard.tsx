import Link from "next/link";
import { Badge } from "./ui/Badge";
import { ImageCarousel } from "./ui/ImageCarousel";
import type { ListingWithRelations } from "@/types";

export function ListingCard({ listing }: { listing: ListingWithRelations }) {
  const categoryNames = listing.categories.map((c) => c.category.name);
  const photos = listing.photos as string[] | null;
  const services = listing.services as string[] | null;

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className={`group block overflow-hidden rounded-2xl bg-white shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--card-shadow-hover)] dark:bg-stone-900 ${listing.featured ? "ring-2 ring-amber-400 dark:ring-amber-500" : "ring-1 ring-stone-900/[0.04] dark:ring-stone-700"}`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {photos && photos.length >= 1 ? (
          <ImageCarousel
            images={photos.slice(0, 3)}
            alt={`${listing.name} — tattoo shop in ${listing.city.name}, ${listing.state.abbreviation}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-900 to-teal-950">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #14b8a6 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            {/* IL brand monogram */}
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/15 ring-1 ring-teal-500/20">
                <span className="text-2xl font-bold tracking-tight text-teal-500/70">IL</span>
              </div>
              <span className="mt-2 text-xs font-medium tracking-wide text-stone-500">More to come</span>
            </div>
          </div>
        )}
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

      {/* Content */}
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
          <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-stone-500 dark:text-stone-400">
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
          {listing.priceRange && (
            <span className="rounded-md bg-stone-100 px-2 py-0.5 dark:bg-stone-800">
              {listing.priceRange === "budget" && "$"}
              {listing.priceRange === "moderate" && "$$"}
              {listing.priceRange === "premium" && "$$$"}
              {listing.priceRange === "luxury" && "$$$$"}
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
      </div>
    </Link>
  );
}
