import Link from "next/link";
import { Badge } from "./ui/Badge";
import { ExpandableHours } from "./ExpandableHours";
import { formatPhone, truncate } from "@/lib/utils";
import type { ListingWithRelations } from "@/types";

export function InlineListingCard({
  listing,
  index,
}: {
  listing: ListingWithRelations;
  index: number;
}) {
  const hours = listing.hours as Record<string, string> | null;

  return (
    <article
      id={`listing-${index}`}
      className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-[var(--card-shadow)] ring-1 ring-stone-900/[0.04] dark:bg-stone-900 dark:ring-stone-700"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white">
              {index}
            </span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {listing.name}
            </h3>
            {listing.featured && <Badge variant="primary">Featured</Badge>}
          </div>

          {listing.address && (
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              {listing.address}, {listing.city.name}, {listing.city.state.abbreviation}
              {listing.zipCode && ` ${listing.zipCode}`}
            </p>
          )}
        </div>

        {listing.googleRating && (
          <div className="shrink-0 text-right">
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
            <p className="mt-0.5 text-sm font-semibold text-stone-900 dark:text-stone-100">
              {listing.googleRating}
              {listing.googleReviewCount && (
                <span className="ml-1 font-normal text-stone-500">
                  ({listing.googleReviewCount})
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Categories */}
      {listing.categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.categories.map(({ category }) => (
            <Badge key={category.id} variant="default">
              {category.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Description */}
      {listing.description && (
        <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          {truncate(listing.description, 200)}
        </p>
      )}

      {/* Features */}
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {listing.priceRange && (
          <span className="rounded-lg bg-stone-100 px-3 py-1 dark:bg-stone-800">
            {listing.priceRange === "budget" && "$ Budget"}
            {listing.priceRange === "moderate" && "$$ Moderate"}
            {listing.priceRange === "premium" && "$$$ Premium"}
            {listing.priceRange === "luxury" && "$$$$ Luxury"}
          </span>
        )}
        {listing.acceptsWalkIns && (
          <span className="rounded-lg bg-green-100 px-3 py-1 text-green-800 dark:bg-green-900 dark:text-green-200">
            Walk-ins Welcome
          </span>
        )}
        {listing.piercingServices && (
          <span className="rounded-lg bg-stone-200 px-3 py-1 text-stone-700 dark:bg-stone-700 dark:text-stone-300">
            Piercing Services
          </span>
        )}
      </div>

      {/* Contact row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-600 dark:text-stone-400">
        {listing.phone && (
          <a href={`tel:${listing.phone}`} className="hover:text-teal-500">
            {formatPhone(listing.phone)}
          </a>
        )}
        {listing.website && (
          <a
            href={listing.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500"
          >
            Visit Website
          </a>
        )}
      </div>

      {/* Hours */}
      {hours && (
        <div className="mt-4">
          <ExpandableHours hours={hours} />
        </div>
      )}

      {/* Profile link */}
      <div className="mt-4 border-t border-stone-100 pt-4 dark:border-stone-800">
        <Link
          href={`/listing/${listing.slug}`}
          className="text-sm font-semibold text-teal-500 transition-colors hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
        >
          View Full Profile &rarr;
        </Link>
      </div>
    </article>
  );
}
