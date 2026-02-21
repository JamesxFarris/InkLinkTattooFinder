import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClaimsByUser, getOwnedListings } from "@/lib/queries";
import { ClaimsList } from "@/components/dashboard/ClaimsList";
import { OwnedListingCard } from "@/components/dashboard/OwnedListingCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  try {
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
          <div className="mt-4 space-y-3">
            {ownedListings.length > 0 ? (
              ownedListings.map((listing) => (
                <OwnedListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400">
                You don&apos;t own any listings yet. Claim a listing to get started.
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
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : "";
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-red-600">Dashboard Error (debug)</h1>
        <pre className="mt-4 overflow-auto rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
          {message}
          {"\n\n"}
          {stack}
        </pre>
      </div>
    );
  }
}
