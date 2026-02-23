"use client";

import { useState } from "react";
import Link from "next/link";
import { listingUrl } from "@/lib/utils";
import { getProfileCompleteness } from "@/lib/listing-completeness";
import { deleteListing } from "@/app/dashboard/listings/[id]/edit/actions";
import type { ListingWithRelations } from "@/types";

export function OwnedListingCard({ listing, isPremium = false }: { listing: ListingWithRelations; isPremium?: boolean }) {
  const { score, missing } = getProfileCompleteness(listing);
  const [showBadge, setShowBadge] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const badgeUrl = `https://inklinktattoofinder.com/api/badge/${listing.slug}`;
  const listingLink = `https://inklinktattoofinder.com${listingUrl(listing)}`;
  const embedCode = `<a href="${listingLink}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="Find ${listing.name} on InkLink Tattoo Finder" width="240" height="52" /></a>`;

  const barColor =
    score >= 70
      ? "bg-green-500"
      : score >= 40
        ? "bg-amber-500"
        : "bg-red-500";

  function handleCopy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
          {isPremium ? (
            <p className="mt-1 flex items-center gap-1 text-sm text-stone-400 dark:text-stone-500">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {(listing as ListingWithRelations & { viewCount?: number }).viewCount ?? 0} views
            </p>
          ) : (
            <Link href="/dashboard/upgrade" className="mt-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
              Upgrade to see analytics
            </Link>
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
          <button
            onClick={async () => {
              if (!confirm("Are you sure you want to permanently delete this listing? This cannot be undone.")) return;
              setDeleting(true);
              await deleteListing(listing.id);
            }}
            disabled={deleting}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Profile Completeness */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-stone-600 dark:text-stone-300">
            Profile Completeness
          </span>
          <span className="font-semibold text-stone-700 dark:text-stone-200">
            {score}%
          </span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
        {missing.length > 0 && score < 100 && (
          <ul className="mt-2 space-y-0.5">
            {missing.slice(0, 3).map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400"
              >
                <span className="text-stone-400 dark:text-stone-500">+</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upgrade Prompt */}
      {!isPremium && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/10">
          <Link href="/dashboard/upgrade" className="flex items-center gap-2 text-xs font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300">
            <span className="text-amber-500">&#9733;</span>
            Upgrade to Premium for featured placement, more photos, and analytics
          </Link>
        </div>
      )}

      {/* Badge Embed */}
      <div className="mt-3 border-t border-stone-100 pt-3 dark:border-stone-700">
        <button
          onClick={() => setShowBadge(!showBadge)}
          className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          {showBadge ? "Hide Badge" : "Get Badge"}
        </button>
        {showBadge && (
          <div className="mt-3 space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badgeUrl}
              alt="InkLink badge preview"
              width={240}
              height={52}
              className="rounded"
            />
            <div className="relative">
              <pre className="overflow-x-auto rounded-lg bg-stone-100 p-3 text-xs text-stone-700 dark:bg-stone-900 dark:text-stone-300">
                {embedCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 rounded bg-teal-500 px-2 py-1 text-xs font-medium text-white transition hover:bg-teal-600"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Add this badge to your website to link back to your InkLink listing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
