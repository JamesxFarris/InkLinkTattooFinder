import Link from "next/link";
import { listingUrl } from "@/lib/utils";

type AdjacentListing = {
  slug: string;
  name: string;
  city: { slug: string; state: { slug: string } };
};

export function PrevNextNav({
  prev,
  next,
}: {
  prev: AdjacentListing | null;
  next: AdjacentListing | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Previous and next listings"
      className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      {prev ? (
        <Link
          href={listingUrl(prev)}
          className="flex flex-1 items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-teal-500 dark:hover:text-teal-400"
        >
          <svg
            className="h-5 w-5 shrink-0 text-stone-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="min-w-0">
            <span className="block text-xs text-stone-500 dark:text-stone-400">
              Previous
            </span>
            <span className="block truncate text-sm font-medium text-stone-900 dark:text-stone-100">
              {prev.name}
            </span>
          </span>
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}

      {next ? (
        <Link
          href={listingUrl(next)}
          className="flex flex-1 items-center justify-end gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-right transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-teal-500 dark:hover:text-teal-400"
        >
          <span className="min-w-0">
            <span className="block text-xs text-stone-500 dark:text-stone-400">
              Next
            </span>
            <span className="block truncate text-sm font-medium text-stone-900 dark:text-stone-100">
              {next.name}
            </span>
          </span>
          <svg
            className="h-5 w-5 shrink-0 text-stone-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}
