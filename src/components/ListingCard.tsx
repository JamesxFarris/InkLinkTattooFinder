import Link from "next/link";
import { Badge } from "./ui/Badge";
import { StockImage } from "./StockImage";
import { getStockImage } from "@/lib/images";
import type { ListingWithRelations } from "@/types";

export function ListingCard({ listing }: { listing: ListingWithRelations }) {
  const categoryNames = listing.categories.map((c) => c.category.name);
  const stockSrc = getStockImage(listing.slug || listing.name);

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-[var(--card-shadow)] ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--card-shadow-hover)] dark:bg-neutral-900 dark:ring-white/[0.06]"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <StockImage
          src={stockSrc}
          alt={`${listing.name} — tattoo shop in ${listing.city.name}, ${listing.state.abbreviation}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Featured badge */}
        {listing.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            Featured
          </span>
        )}

        {/* Rating overlay */}
        {listing.googleRating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-sm font-medium text-white backdrop-blur-sm">
            <span className="text-amber-400" aria-hidden="true">&#9733;</span>
            <span>{listing.googleRating}</span>
            {listing.googleReviewCount && (
              <span className="text-white/70">({listing.googleReviewCount})</span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-red-600 dark:text-neutral-100 dark:group-hover:text-red-400">
          {listing.name}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {listing.city.name}, {listing.state.abbreviation}
        </p>

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

        <div className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-3 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          {listing.priceRange && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">
              {listing.priceRange === "budget" && "$"}
              {listing.priceRange === "moderate" && "$$"}
              {listing.priceRange === "premium" && "$$$"}
              {listing.priceRange === "luxury" && "$$$$"}
            </span>
          )}
          {listing.acceptsWalkIns && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
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
