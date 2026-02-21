"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ClaimButtonProps = {
  listingId: number;
  existingClaimStatus?: "pending" | "approved" | "denied" | null;
  isOwned: boolean;
};

export function ClaimButton({ listingId, existingClaimStatus, isOwned }: ClaimButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Already owned by current user
  if (isOwned) {
    return (
      <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-6">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-teal-600 dark:text-teal-400">You own this listing</span>
        </div>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Manage this listing from your{" "}
          <Link href="/dashboard" className="text-teal-600 hover:underline dark:text-teal-400">
            dashboard
          </Link>.
        </p>
      </div>
    );
  }

  // Existing pending claim
  if (existingClaimStatus === "pending" || submitted) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-amber-600 dark:text-amber-400">Claim pending review</span>
        </div>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Your claim is being reviewed by our team.
        </p>
      </div>
    );
  }

  // Already claimed (denied)
  if (existingClaimStatus === "denied") {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100">Own this business?</h3>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Your previous claim was not approved. Contact us if you believe this was an error.
        </p>
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100">Own this business?</h3>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Claim this listing to manage your shop&apos;s information.
        </p>
        <Link
          href="/register"
          className="mt-4 inline-block rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
        >
          Sign Up to Claim
        </Link>
      </div>
    );
  }

  // Logged in, no claim yet - one-click claim
  async function handleClaim() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to submit claim");
      return;
    }

    setSubmitted(true);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <h3 className="font-semibold text-stone-900 dark:text-stone-100">Own this business?</h3>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        Claim this listing to manage your shop&apos;s information.
      </p>
      {error && (
        <div className="mt-3 rounded-lg bg-red-500/10 p-2 text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      )}
      <button
        onClick={handleClaim}
        disabled={loading}
        className="mt-4 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
      >
        {loading ? "Claiming..." : "Claim this Business"}
      </button>
    </div>
  );
}
