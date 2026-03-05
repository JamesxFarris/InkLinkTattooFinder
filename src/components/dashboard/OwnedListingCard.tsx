"use client";

import { useState } from "react";
import Link from "next/link";
import { listingUrl } from "@/lib/utils";
import { getProfileCompleteness } from "@/lib/listing-completeness";
import { deleteListing } from "@/app/dashboard/listings/[id]/edit/actions";
import type { ListingWithRelations } from "@/types";

export function OwnedListingCard({ listing, isPremium = false }: { listing: ListingWithRelations; isPremium?: boolean }) {
  const { score, missing } = getProfileCompleteness(listing);
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
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
          {(() => {
            const ext = listing as ListingWithRelations & {
              viewCount?: number;
              phoneClicks?: number;
              websiteClicks?: number;
              instagramClicks?: number;
              facebookClicks?: number;
              ctaClicks?: number;
            };
            const totalClicks = (ext.phoneClicks ?? 0) + (ext.websiteClicks ?? 0) + (ext.instagramClicks ?? 0) + (ext.facebookClicks ?? 0) + (ext.ctaClicks ?? 0);
            return (
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-stone-400 dark:text-stone-500">
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {ext.viewCount ?? 0} views
                </span>
                {totalClicks > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                    </svg>
                    {totalClicks} clicks
                  </span>
                )}
                {(ext.phoneClicks ?? 0) > 0 && (
                  <span className="text-xs text-stone-300 dark:text-stone-600">{ext.phoneClicks} calls</span>
                )}
                {(ext.websiteClicks ?? 0) > 0 && (
                  <span className="text-xs text-stone-300 dark:text-stone-600">{ext.websiteClicks} web</span>
                )}
                {(ext.ctaClicks ?? 0) > 0 && (
                  <span className="text-xs text-stone-300 dark:text-stone-600">{ext.ctaClicks} CTA</span>
                )}
              </div>
            );
          })()}
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
          <>
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
            <Link
              href={`/dashboard/listings/${listing.id}/edit`}
              className="mt-2 inline-block text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Complete your profile &rarr;
            </Link>
          </>
        )}
      </div>

      {/* Upgrade Prompt */}
      {!isPremium && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-xl text-amber-500">&#9733;</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Appear at the top of every city &amp; state search
              </p>
              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                Featured shops are shown above all regular listings — get seen first by people looking for tattoos near you.
              </p>
              <Link
                href="/dashboard/upgrade"
                className="mt-2 inline-flex items-center rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600"
              >
                Upgrade to Premium — $19/mo &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Badge Embed */}
      <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/40">
        <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          Add your InkLink badge to your website
        </p>
        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
          Link visitors straight back to your listing and build credibility.
        </p>
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
              className="absolute right-2 top-2 rounded bg-teal-500 px-2 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-600"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
