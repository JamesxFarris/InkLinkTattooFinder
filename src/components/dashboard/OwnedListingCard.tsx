import Link from "next/link";
import type { ListingWithRelations } from "@/types";

export function OwnedListingCard({ listing }: { listing: ListingWithRelations }) {
  return (
    <div className="rounded-lg border border-stone-700 bg-stone-800 p-4">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/listing/${listing.slug}`}
            className="font-medium text-stone-100 hover:text-teal-400"
          >
            {listing.name}
          </Link>
          <p className="text-sm text-stone-400">
            {listing.city.name}, {listing.city.state.abbreviation}
          </p>
          {listing.googleRating && (
            <p className="mt-1 text-sm text-stone-500">
              {listing.googleRating} stars ({listing.googleReviewCount} reviews)
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {listing.featured && (
            <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-400">
              Featured
            </span>
          )}
          <button
            disabled
            className="rounded-lg border border-stone-600 px-3 py-1.5 text-xs font-medium text-stone-400 opacity-50"
            title="Coming soon"
          >
            Upgrade to Featured
          </button>
        </div>
      </div>
    </div>
  );
}
