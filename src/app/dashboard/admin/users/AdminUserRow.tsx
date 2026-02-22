"use client";

import { useState } from "react";
import { changeUserRole, adminDeleteUser } from "../actions";

type AdminUserRowProps = {
  user: {
    id: number;
    name: string;
    email: string;
    role: "owner" | "admin";
    createdAt: Date;
    listingCount: number;
    claimCount: number;
  };
  isSelf: boolean;
};

export function AdminUserRow({ user, isSelf }: AdminUserRowProps) {
  const [loading, setLoading] = useState(false);

  async function handleRoleChange() {
    const newRole = user.role === "admin" ? "owner" : "admin";
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    setLoading(true);
    await changeUserRole(user.id, newRole);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete ${user.name} (${user.email}) permanently? Their claims will also be deleted and their listings will be unlinked.`)) return;
    setLoading(true);
    await adminDeleteUser(user.id);
    setLoading(false);
  }

  const roleBadge =
    user.role === "admin"
      ? "bg-teal-500/10 text-teal-400 border-teal-500/30"
      : "bg-stone-500/10 text-stone-400 border-stone-500/30";

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-stone-900 dark:text-stone-100">
              {user.name}
              {isSelf && (
                <span className="ml-2 text-xs font-normal text-stone-400 dark:text-stone-500">(you)</span>
              )}
            </h2>
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-medium capitalize ${roleBadge}`}
            >
              {user.role}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {user.email}
          </p>
          <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
            Joined {new Date(user.createdAt).toLocaleDateString()}
            <span className="ml-3">{user.listingCount} {user.listingCount === 1 ? "listing" : "listings"}</span>
            <span className="ml-3">{user.claimCount} {user.claimCount === 1 ? "claim" : "claims"}</span>
          </p>
        </div>

        {!isSelf && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRoleChange}
              disabled={loading}
              className="rounded-lg bg-teal-600/20 px-3 py-1.5 text-xs font-medium text-teal-400 transition hover:bg-teal-600/30 disabled:opacity-50"
            >
              {user.role === "admin" ? "Make Owner" : "Make Admin"}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-600/30 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
