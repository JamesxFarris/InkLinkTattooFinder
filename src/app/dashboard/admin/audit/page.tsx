import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Audit Log — Admin",
};

const PAGE_SIZE = 50;

const ACTION_LABELS: Record<string, string> = {
  "listing.approve": "Approved listing",
  "listing.reject": "Rejected listing",
  "listing.revokeOwnership": "Revoked ownership",
  "listing.delete": "Deleted listing",
  "listing.update": "Updated listing",
  "claim.approve": "Approved claim",
  "claim.deny": "Denied claim",
  "claim.delete": "Deleted claim",
  "user.changeRole": "Changed user role",
  "user.delete": "Deleted user",
  "user.register": "User registered",
  "city.delete": "Deleted city",
};

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const actionFilter = params.action || "";

  const where: Record<string, unknown> = {};
  if (actionFilter) {
    where.action = actionFilter;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditLog.count({ where }),
  ]);

  // Fetch user names for display
  const userIds = [...new Set(logs.map((l) => l.userId).filter((id): id is number => id !== null))];
  const users = userIds.length > 0
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const userMap = new Map(users.map((u) => [u.id, u]));

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const actions = Object.keys(ACTION_LABELS);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
        Audit Log
      </h1>

      {/* Filter */}
      <form action="/dashboard/admin/audit" method="GET" className="mb-6">
        <div className="flex gap-2">
          <select
            name="action"
            defaultValue={actionFilter}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          >
            <option value="">All actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {ACTION_LABELS[a]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Filter
          </button>
          {actionFilter && (
            <a
              href="/dashboard/admin/audit"
              className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
            >
              Clear
            </a>
          )}
        </div>
      </form>

      <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
        {total} {total === 1 ? "entry" : "entries"}
        {actionFilter ? ` for "${ACTION_LABELS[actionFilter] || actionFilter}"` : ""}
      </p>

      {logs.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-12 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">No audit log entries found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-500 dark:text-stone-400">Time</th>
                <th className="px-4 py-3 font-medium text-stone-500 dark:text-stone-400">User</th>
                <th className="px-4 py-3 font-medium text-stone-500 dark:text-stone-400">Action</th>
                <th className="px-4 py-3 font-medium text-stone-500 dark:text-stone-400">Target</th>
                <th className="px-4 py-3 font-medium text-stone-500 dark:text-stone-400">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white dark:divide-stone-800 dark:bg-stone-950">
              {logs.map((log) => {
                const user = log.userId ? userMap.get(log.userId) : null;
                const details = log.details as Record<string, unknown> | null;
                return (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-600 dark:text-stone-300">
                      {log.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {log.createdAt.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-stone-900 dark:text-stone-100">
                      {user ? (
                        <span title={user.email}>{user.name}</span>
                      ) : log.userId ? (
                        <span className="text-stone-400">User #{log.userId}</span>
                      ) : (
                        <span className="text-stone-400">System</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-900 dark:text-stone-100">
                      <span className="inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-600 dark:text-stone-300">
                      {log.targetType && (
                        <span>
                          {log.targetType} #{log.targetId}
                        </span>
                      )}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-stone-500 dark:text-stone-400">
                      {details
                        ? Object.entries(details)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")
                        : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {page > 1 && (
            <a
              href={`/dashboard/admin/audit?page=${page - 1}${actionFilter ? `&action=${actionFilter}` : ""}`}
              className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
            >
              Previous
            </a>
          )}
          <span className="text-sm text-stone-500 dark:text-stone-400">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/dashboard/admin/audit?page=${page + 1}${actionFilter ? `&action=${actionFilter}` : ""}`}
              className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
