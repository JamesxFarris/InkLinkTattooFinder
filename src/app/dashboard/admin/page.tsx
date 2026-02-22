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
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const params = await searchParams;
  const filter = params.status || "all";
  const query = params.q?.trim() || "";

  const where: Record<string, unknown> = {};
  if (filter !== "all") {
    where.status = filter as "active" | "pending" | "inactive";
  }
  if (query) {
    where.name = { contains: query, mode: "insensitive" };
  }

  const [listings, counts, recentPending] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { city: true, state: true, owner: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.listing.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.listing.findMany({
      where: { status: "pending" },
      include: { city: true, state: true, owner: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const countMap: Record<string, number> = {};
  let total = 0;
  for (const c of counts) {
    countMap[c.status] = c._count;
    total += c._count;
  }

  const pendingCount = countMap["pending"] ?? 0;

  const tabs = [
    { key: "all", label: "All", count: total },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "active", label: "Active", count: countMap["active"] ?? 0 },
    { key: "inactive", label: "Inactive", count: countMap["inactive"] ?? 0 },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
        Admin Panel
      </h1>

      {/* Pending Listings Banner */}
      {pendingCount > 0 && (
        <div className="mb-6 rounded-xl bg-amber-50 p-5 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-800">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <div className="flex flex-1 items-center justify-between">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {pendingCount} new {pendingCount === 1 ? "listing" : "listings"} awaiting review
              </p>
              <a
                href="/dashboard/admin?status=pending"
                className="text-sm font-medium text-amber-700 underline hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
              >
                View All Pending
              </a>
            </div>
          </div>
          {recentPending.length > 0 && (
            <div className="mt-4 space-y-2">
              {recentPending.map((listing) => (
                <AdminListingRow key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search */}
      <form action="/dashboard/admin" method="GET" className="mb-6">
        {filter !== "all" && <input type="hidden" name="status" value={filter} />}
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search listings by name..."
            className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Search
          </button>
          {query && (
            <a
              href={filter === "all" ? "/dashboard/admin" : `/dashboard/admin?status=${filter}`}
              className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
            >
              Clear
            </a>
          )}
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={
              tab.key === "all"
                ? `/dashboard/admin${query ? `?q=${encodeURIComponent(query)}` : ""}`
                : `/dashboard/admin?status=${tab.key}${query ? `&q=${encodeURIComponent(query)}` : ""}`
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
