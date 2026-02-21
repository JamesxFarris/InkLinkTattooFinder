import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClaimsByUser, getOwnedListings } from "@/lib/queries";
import { ClaimsList } from "@/components/dashboard/ClaimsList";
import { OwnedListingCard } from "@/components/dashboard/OwnedListingCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user.id);
  const [claims, ownedListings] = await Promise.all([
    getClaimsByUser(userId),
    getOwnedListings(userId),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
        Dashboard
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Welcome back, {session.user.name}
      </p>

      {/* Owned Listings */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Your Listings
        </h2>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Listings marked &ldquo;Pending&rdquo; are under review and not yet publicly visible.
        </p>
        <div className="mt-4 space-y-3">
          {ownedListings.length > 0 ? (
            ownedListings.map((listing) => (
              <OwnedListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              You don&apos;t own any listings yet.{" "}
              <Link href="/dashboard/claim" className="text-teal-600 hover:underline dark:text-teal-400">
                Claim a listing
              </Link>{" "}
              to get started.
            </p>
          )}
        </div>
      </section>

      {/* Claims */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Your Claims
        </h2>
        <div className="mt-4">
          <ClaimsList claims={claims} />
        </div>
      </section>
    </div>
  );
}
