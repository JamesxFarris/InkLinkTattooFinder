import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPlanInfo } from "@/lib/premium";
import { UpgradePage } from "./UpgradePage";
import { ManageSubscriptionButton } from "@/components/dashboard/ManageSubscriptionButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upgrade to Premium",
};

export default async function UpgradePageWrapper({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const params = await searchParams;
  const planInfo = await getUserPlanInfo(parseInt(session.user.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {params.success === "true" && (
        <div className="mb-6 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400">
          Welcome to Premium! Your subscription is now active.
        </div>
      )}
      {params.canceled === "true" && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          Checkout was canceled. No charges were made.
        </div>
      )}

      {planInfo.isPremium ? (
        <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50 p-8 dark:from-amber-950/30 dark:to-amber-900/20 dark:border-amber-600">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#9733;</span>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              You&apos;re on Premium
            </h1>
          </div>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Enjoy all premium benefits including 12 photos, featured placement, artist Instagram handles, priority search, listing analytics, and Open Now badges.
          </p>
          {planInfo.planExpiresAt && (
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              Current period ends: {planInfo.planExpiresAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
          <div className="mt-6">
            <ManageSubscriptionButton />
          </div>
        </div>
      ) : (
        <UpgradePage />
      )}
    </div>
  );
}
