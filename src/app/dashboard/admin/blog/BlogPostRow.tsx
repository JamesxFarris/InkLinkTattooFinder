"use client";

import { useState } from "react";
import Link from "next/link";
import { deletePost } from "./actions";

const statusStyles: Record<string, string> = {
  published: "bg-green-500/10 text-green-400 border-green-500/30",
  draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
};

type BlogPostRowProps = {
  post: {
    id: number;
    title: string;
    slug: string;
    status: string;
    viewCount: number;
    publishedAt: Date | null;
    createdAt: Date;
    author: { name: string };
  };
};

export function BlogPostRow({ post }: BlogPostRowProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${post.title}" permanently?`)) return;
    setLoading(true);
    await deletePost(post.id);
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-stone-900 dark:text-stone-100">
              {post.title}
            </h2>
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-medium capitalize ${statusStyles[post.status] ?? ""}`}
            >
              {post.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            <span className="font-mono text-xs">/blog/{post.slug}</span>
            <span className="ml-3">by {post.author.name}</span>
            <span className="ml-3">
              {(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="ml-3">{post.viewCount.toLocaleString()} views</span>
          </p>
          <div className="mt-1 flex gap-3 text-xs">
            {post.status === "published" && (
              <Link
                href={`/blog/${post.slug}`}
                className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View
              </Link>
            )}
            <Link
              href={`/dashboard/admin/blog/${post.id}/edit`}
              className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Edit
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/admin/blog/${post.id}/edit`}
            className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-600/30 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
