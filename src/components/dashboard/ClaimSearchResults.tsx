"use client";

import { useState } from "react";
import Link from "next/link";

type SearchResult = {
  id: number;
  name: string;
  slug: string;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  ownerId: number | null;
};

export function ClaimSearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch(`/api/listings/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data.listings);
    } catch {
      setError("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim(listingId: number) {
    setClaimingId(listingId);
    setError("");

    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit claim");
        return;
      }

      setClaimedIds((prev) => new Set(prev).add(listingId));
    } catch {
      setError("Failed to submit claim. Please try again.");
    } finally {
      setClaimingId(null);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by shop name, city, or state..."
          className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-stone-500 dark:text-stone-400">
            No shops found matching &ldquo;{query}&rdquo;.
          </p>
          <p className="mt-2 text-sm text-stone-400 dark:text-stone-500">
            Don&apos;t see your shop?{" "}
            <Link href="/list-your-shop" className="text-teal-600 hover:underline dark:text-teal-400">
              Add it as a new listing
            </Link>.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          {results.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-700 dark:bg-stone-800"
            >
              <div>
                <Link
                  href={`/tattoo-shops/${listing.stateSlug}/${listing.citySlug}/${listing.slug}`}
                  className="font-medium text-stone-900 hover:text-teal-600 dark:text-stone-100 dark:hover:text-teal-400"
                >
                  {listing.name}
                </Link>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {listing.city}, {listing.state}
                </p>
              </div>
              <div>
                {listing.ownerId ? (
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500 dark:bg-stone-700 dark:text-stone-400">
                    Already claimed
                  </span>
                ) : claimedIds.has(listing.id) ? (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
                    Claim pending
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaim(listing.id)}
                    disabled={claimingId === listing.id}
                    className="rounded-lg bg-teal-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
                  >
                    {claimingId === listing.id ? "Claiming..." : "Claim"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
