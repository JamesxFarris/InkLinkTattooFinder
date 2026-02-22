import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminUserRow } from "./AdminUserRow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Users — Admin",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const params = await searchParams;
  const query = params.q?.trim() || "";

  const where: Record<string, unknown> = {};
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [users, totalUsers, adminCount, recentCount] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        _count: { select: { claims: true, listings: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);

  const currentUserId = parseInt(session.user.id);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
        Manage Users
      </h1>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm text-stone-500 dark:text-stone-400">Total Users</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{totalUsers}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm text-stone-500 dark:text-stone-400">Admins</p>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{adminCount}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm text-stone-500 dark:text-stone-400">Last 7 Days</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{recentCount}</p>
        </div>
      </div>

      {/* Search */}
      <form action="/dashboard/admin/users" method="GET" className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name or email..."
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
              href="/dashboard/admin/users"
              className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
            >
              Clear
            </a>
          )}
        </div>
      </form>

      {/* Results count */}
      {query && (
        <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
          {users.length} {users.length === 1 ? "user" : "users"} found
        </p>
      )}

      {/* User list */}
      {users.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-12 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">No users found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <AdminUserRow
              key={user.id}
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                listingCount: user._count.listings,
                claimCount: user._count.claims,
              }}
              isSelf={user.id === currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
