import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminListingRow } from "./AdminListingRow";

export const metadata: Metadata = {
  title: "Admin Panel",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const params = await searchParams;
  const filter = params.status || "all";

  const where =
    filter === "all"
      ? {}
      : { status: filter as "active" | "pending" | "inactive" };

  const [listings, counts] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { city: true, state: true, owner: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.listing.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {};
  let total = 0;
  for (const c of counts) {
    countMap[c.status] = c._count;
    total += c._count;
  }

  const tabs = [
    { key: "all", label: "All", count: total },
    { key: "pending", label: "Pending", count: countMap["pending"] ?? 0 },
    { key: "active", label: "Active", count: countMap["active"] ?? 0 },
    { key: "inactive", label: "Inactive", count: countMap["inactive"] ?? 0 },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
        Admin Panel
      </h1>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={
              tab.key === "all"
                ? "/dashboard/admin"
                : `/dashboard/admin?status=${tab.key}`
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === tab.key
                ? "bg-teal-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-200"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
          </a>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-12 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">No listings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <AdminListingRow key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
