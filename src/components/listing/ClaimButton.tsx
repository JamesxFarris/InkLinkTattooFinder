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
  const [showForm, setShowForm] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
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

  // Already claimed (denied) - allow re-reading but show status
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

  // Logged in, no claim yet - show claim form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, phone, message }),
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

  if (showForm) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100">Claim this Business</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {error && (
            <div className="rounded-lg bg-red-500/10 p-2 text-sm text-red-500 dark:text-red-400">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="claim-phone" className="block text-sm text-stone-500 dark:text-stone-400">
              Phone number <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              id="claim-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label htmlFor="claim-message" className="block text-sm text-stone-500 dark:text-stone-400">
              Tell us how you&apos;re connected to this business (optional)
            </label>
            <textarea
              id="claim-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500"
              placeholder="I am the owner/manager of this shop..."
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm text-stone-500 hover:border-stone-300 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <h3 className="font-semibold text-stone-900 dark:text-stone-100">Own this business?</h3>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        Claim this listing to manage your shop&apos;s information.
      </p>
      <button
        onClick={() => setShowForm(true)}
        className="mt-4 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
      >
        Claim this Business
      </button>
    </div>
  );
}
