import Link from "next/link";
import type { ClaimWithRelations } from "@/types";

export function ClaimsList({ claims }: { claims: ClaimWithRelations[] }) {
  if (claims.length === 0) {
    return (
      <p className="text-sm text-stone-400">
        You haven&apos;t submitted any claims yet.{" "}
        <Link href="/search" className="text-teal-400 hover:underline">
          Find a shop to claim
        </Link>.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {claims.map((claim) => (
        <div
          key={claim.id}
          className="flex items-center justify-between rounded-lg border border-stone-700 bg-stone-800 p-4"
        >
          <div>
            <Link
              href={`/listing/${claim.listing.slug}`}
              className="font-medium text-stone-100 hover:text-teal-400"
            >
              {claim.listing.name}
            </Link>
            <p className="text-sm text-stone-400">
              {claim.listing.city.name}, {claim.listing.city.state.abbreviation}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {claim.status === "pending" && (
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                Pending
              </span>
            )}
            {claim.status === "approved" && (
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                Approved
              </span>
            )}
            {claim.status === "denied" && (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                Denied
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
