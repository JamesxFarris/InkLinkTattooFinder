import { ListingCard } from "./ListingCard";
import type { ListingWithRelations } from "@/types";

export function ListingGrid({ listings }: { listings: ListingWithRelations[] }) {
  if (listings.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-16 text-center shadow-[var(--card-shadow)] ring-1 ring-black/[0.04] dark:bg-neutral-900 dark:ring-white/[0.06]">
        <svg className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">
          No listings found. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
