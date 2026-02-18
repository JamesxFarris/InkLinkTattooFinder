import Link from "next/link";
import { Badge } from "./ui/Badge";
import type { ListingWithRelations } from "@/types";

export function ListingCard({ listing }: { listing: ListingWithRelations }) {
  const categoryNames = listing.categories.map((c) => c.category.name);

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group block rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="relative h-48 overflow-hidden rounded-t-xl bg-neutral-100 dark:bg-neutral-800">
        <div className="flex h-full items-center justify-center text-4xl text-neutral-300 dark:text-neutral-600">
          {listing.featured && (
            <span className="absolute top-2 right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
              Featured
            </span>
          )}
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 group-hover:text-red-600 dark:text-neutral-100 dark:group-hover:text-red-400">
          {listing.name}
        </h3>

        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {listing.city.name}, {listing.state.abbreviation}
        </p>

        {listing.googleRating && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-yellow-500">&#9733;</span>
            <span className="text-sm font-medium">{listing.googleRating}</span>
            {listing.googleReviewCount && (
              <span className="text-sm text-neutral-400">
                ({listing.googleReviewCount})
              </span>
            )}
          </div>
        )}

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

        <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          {listing.priceRange && (
            <span>
              {listing.priceRange === "budget" && "$"}
              {listing.priceRange === "moderate" && "$$"}
              {listing.priceRange === "premium" && "$$$"}
              {listing.priceRange === "luxury" && "$$$$"}
            </span>
          )}
          {listing.acceptsWalkIns && <span>Walk-ins OK</span>}
          {listing.piercingServices && <span>Piercings</span>}
        </div>
      </div>
    </Link>
  );
}
