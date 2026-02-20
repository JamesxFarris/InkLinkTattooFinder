import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPendingClaims, getAllClaims } from "@/lib/queries";
import { ClaimReviewCard } from "@/components/admin/ClaimReviewCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  const [pendingClaims, allClaims] = await Promise.all([
    getPendingClaims(),
    getAllClaims(),
  ]);

  const processedClaims = allClaims.filter((c) => c.status !== "pending");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-stone-100">
        Admin Panel
      </h1>
      <p className="mt-2 text-stone-400">
        Manage listing claims and approvals
      </p>

      {/* Pending Claims */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-100">
          Pending Claims ({pendingClaims.length})
        </h2>
        <div className="mt-4 space-y-4">
          {pendingClaims.length > 0 ? (
            pendingClaims.map((claim) => (
              <ClaimReviewCard
                key={claim.id}
                claim={{
                  ...claim,
                  reviewedAt: claim.reviewedAt?.toISOString() ?? null,
                  createdAt: claim.createdAt.toISOString(),
                }}
              />
            ))
          ) : (
            <p className="text-sm text-stone-400">
              No pending claims to review.
            </p>
          )}
        </div>
      </section>

      {/* Processed Claims */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-100">
          Processed Claims ({processedClaims.length})
        </h2>
        <div className="mt-4 space-y-4">
          {processedClaims.length > 0 ? (
            processedClaims.map((claim) => (
              <ClaimReviewCard
                key={claim.id}
                claim={{
                  ...claim,
                  reviewedAt: claim.reviewedAt?.toISOString() ?? null,
                  createdAt: claim.createdAt.toISOString(),
                }}
              />
            ))
          ) : (
            <p className="text-sm text-stone-400">
              No processed claims yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
