"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ClaimReviewCardProps = {
  claim: {
    id: number;
    status: string;
    phone: string | null;
    message: string | null;
    adminNotes: string | null;
    reviewedAt: string | null;
    createdAt: string;
    user: { id: number; name: string; email: string };
    listing: {
      id: number;
      name: string;
      slug: string;
      phone: string | null;
      city: { name: string; slug: string; state: { abbreviation: string; slug: string } };
    };
  };
};

export function ClaimReviewCard({ claim }: ClaimReviewCardProps) {
  const router = useRouter();
  const [adminNotes, setAdminNotes] = useState(claim.adminNotes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAction(status: "approved" | "denied") {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/claims/${claim.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Action failed");
      return;
    }

    router.refresh();
  }

  const isPending = claim.status === "pending";

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-800">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/tattoo-shops/${claim.listing.city.state.slug}/${claim.listing.city.slug}/${claim.listing.slug}`}
            className="font-medium text-stone-900 hover:text-teal-600 dark:text-stone-100 dark:hover:text-teal-400"
          >
            {claim.listing.name}
          </Link>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {claim.listing.city.name}, {claim.listing.city.state.abbreviation}
          </p>
          {claim.listing.phone && (
            <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
              <a href={`tel:${claim.listing.phone}`} className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
                {claim.listing.phone}
              </a>
            </p>
          )}
        </div>
        {!isPending && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              claim.status === "approved"
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {claim.status === "approved" ? "Approved" : "Denied"}
          </span>
        )}
      </div>

      <div className="mt-3 rounded-lg bg-stone-50 p-3 dark:bg-stone-900">
        <p className="text-xs font-medium text-stone-400 dark:text-stone-500">Claimed by</p>
        <p className="text-sm text-stone-700 dark:text-stone-300">
          {claim.user.name} ({claim.user.email})
        </p>
        {claim.phone && (
          <>
            <p className="mt-2 text-xs font-medium text-stone-400 dark:text-stone-500">Phone</p>
            <p className="text-sm text-stone-700 dark:text-stone-300">{claim.phone}</p>
          </>
        )}
        {claim.message && (
          <>
            <p className="mt-2 text-xs font-medium text-stone-400 dark:text-stone-500">Message</p>
            <p className="text-sm text-stone-700 dark:text-stone-300">{claim.message}</p>
          </>
        )}
        <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">
          Submitted {new Date(claim.createdAt).toLocaleDateString()}
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-500/10 p-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {isPending && (
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor={`notes-${claim.id}`} className="block text-sm text-stone-500 dark:text-stone-400">
              Admin Notes (optional)
            </label>
            <textarea
              id={`notes-${claim.id}`}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500"
              placeholder="Internal notes about this claim..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAction("approved")}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction("denied")}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              Deny
            </button>
          </div>
        </div>
      )}

      {!isPending && claim.adminNotes && (
        <div className="mt-3">
          <p className="text-xs font-medium text-stone-400 dark:text-stone-500">Admin Notes</p>
          <p className="text-sm text-stone-600 dark:text-stone-400">{claim.adminNotes}</p>
        </div>
      )}
    </div>
  );
}
