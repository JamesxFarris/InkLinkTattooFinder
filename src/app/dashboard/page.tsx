import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClaimsByUser, getOwnedListings } from "@/lib/queries";
import { ClaimsList } from "@/components/dashboard/ClaimsList";
import { OwnedListingCard } from "@/components/dashboard/OwnedListingCard";
import { ManageSubscriptionButton } from "@/components/dashboard/ManageSubscriptionButton";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { getUserPlanInfo } from "@/lib/premium";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user.id);
  const [claims, ownedListings, planInfo] = await Promise.all([
    getClaimsByUser(userId),
    getOwnedListings(userId),
    getUserPlanInfo(userId),
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
              <OwnedListingCard key={listing.id} listing={listing} isPremium={planInfo.isPremium} />
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

      {/* Your Plan */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Your Plan
        </h2>
        <div className="mt-4">
          {planInfo.isPremium ? (
            <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-amber-100/50 p-5 dark:from-amber-950/30 dark:to-amber-900/20 dark:border-amber-600">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">&#9733;</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Premium Plan</span>
                  </div>
                  {planInfo.planExpiresAt && (
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                      Renews {planInfo.planExpiresAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                </div>
                <ManageSubscriptionButton />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50/30 p-5 dark:border-amber-800/50 dark:from-amber-950/20 dark:via-stone-900 dark:to-amber-950/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">&#9733;</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Upgrade to Premium</span>
                    <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">$14/mo</span>
                  </div>
                  <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400">
                    Get a featured badge, priority placement in search results, 24 photos, and view analytics.
                    Shops with Premium get significantly more visibility.
                  </p>
                </div>
                <Link
                  href="/dashboard/upgrade"
                  className="shrink-0 rounded-lg bg-amber-500 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-amber-500/25 transition-all hover:bg-amber-600 hover:shadow-md hover:shadow-amber-500/30"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
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

      {/* Account Settings */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Account Settings
        </h2>
        <div className="mt-4 max-w-md rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900">
          <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Change Password
          </h3>
          <div className="mt-3">
            <ChangePasswordForm />
          </div>
        </div>
      </section>
    </div>
  );
}
