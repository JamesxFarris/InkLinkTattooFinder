"use client";

import { useState } from "react";
import Link from "next/link";
import { approveListing, rejectListing, adminDeleteListing, revokeOwnership } from "./actions";

const statusStyles: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  inactive: "bg-red-500/10 text-red-400 border-red-500/30",
};

type ListingRowProps = {
  listing: {
    id: number;
    name: string;
    slug: string;
    phone: string | null;
    status: string;
    ownerId: number | null;
    createdAt: Date;
    city: { name: string; slug: string };
    state: { abbreviation: string; slug: string };
    owner: { email: string; name: string | null } | null;
  };
};

export function AdminListingRow({ listing }: ListingRowProps) {
  const [loading, setLoading] = useState(false);

  async function handleAction(action: (id: number) => Promise<void>) {
    setLoading(true);
    await action(listing.id);
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-stone-900 dark:text-stone-100">{listing.name}</h2>
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-medium capitalize ${statusStyles[listing.status] ?? ""}`}
            >
              {listing.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {listing.city.name}, {listing.state.abbreviation}
            {listing.phone && (
              <span className="ml-3">
                <a href={`tel:${listing.phone}`} className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
                  {listing.phone}
                </a>
              </span>
            )}
            {listing.owner && (
              <span className="ml-3 text-stone-400 dark:text-stone-500">
                by {listing.owner.name ?? listing.owner.email}
              </span>
            )}
          </p>
          <div className="mt-1 flex gap-3 text-xs">
            <Link
              href={`/tattoo-shops/${listing.state.slug}/${listing.city.slug}/${listing.slug}`}
              className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              View
            </Link>
            <Link
              href={`/dashboard/listings/${listing.id}/edit`}
              className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Edit
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {listing.status !== "active" && (
            <button
              onClick={() => handleAction(approveListing)}
              disabled={loading}
              className="rounded-lg bg-green-600/20 px-3 py-1.5 text-xs font-medium text-green-400 transition hover:bg-green-600/30 disabled:opacity-50"
            >
              Approve
            </button>
          )}
          {listing.status !== "inactive" && (
            <button
              onClick={() => handleAction(rejectListing)}
              disabled={loading}
              className="rounded-lg bg-yellow-600/20 px-3 py-1.5 text-xs font-medium text-yellow-400 transition hover:bg-yellow-600/30 disabled:opacity-50"
            >
              Reject
            </button>
          )}
          {listing.ownerId && (
            <button
              onClick={() => {
                if (confirm(`Revoke ownership from ${listing.owner?.name ?? listing.owner?.email ?? "owner"}?`)) {
                  handleAction(revokeOwnership);
                }
              }}
              disabled={loading}
              className="rounded-lg bg-orange-600/20 px-3 py-1.5 text-xs font-medium text-orange-400 transition hover:bg-orange-600/30 disabled:opacity-50"
            >
              Revoke Owner
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Delete this listing permanently?")) {
                handleAction(adminDeleteListing);
              }
            }}
            disabled={loading}
            className="rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-600/30 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
