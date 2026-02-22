"use client";

import { useState } from "react";
import Link from "next/link";
import { listingUrl } from "@/lib/utils";
import { getProfileCompleteness } from "@/lib/listing-completeness";
import type { ListingWithRelations } from "@/types";

export function OwnedListingCard({ listing }: { listing: ListingWithRelations }) {
  const { score, missing } = getProfileCompleteness(listing);
  const [showBadge, setShowBadge] = useState(false);
  const [copied, setCopied] = useState(false);

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
