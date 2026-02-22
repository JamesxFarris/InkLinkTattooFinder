import Link from "next/link";
import { listingUrl } from "@/lib/utils";
import type { ListingWithRelations } from "@/types";

export function OwnedListingCard({ listing }: { listing: ListingWithRelations }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-700 dark:bg-stone-800">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={listingUrl(listing)}
              className="font-medium text-stone-900 hover:text-teal-600 dark:text-stone-100 dark:hover:text-teal-400"
            >
              {listing.name}
            </Link>
            {listing.status === "pending" ? (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                Pending Review
              </span>
            ) : (
              <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {listing.city.name}, {listing.city.state.abbreviation}
          </p>
          {listing.googleRating && (
            <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">
              {listing.googleRating} stars ({listing.googleReviewCount} reviews)
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {listing.featured && (
            <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-600 dark:text-teal-400">
              Featured
            </span>
          )}
          <Link
            href={`/dashboard/listings/${listing.id}/edit`}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
          >
            Edit Listing
          </Link>
        </div>
      </div>
    </div>
  );
}
