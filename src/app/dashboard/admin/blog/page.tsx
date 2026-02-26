import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BlogPostRow } from "./BlogPostRow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Blog — Admin",
};

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
          Manage Blog
        </h1>
        <Link
          href="/dashboard/admin/blog/new"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm text-stone-500 dark:text-stone-400">Total Posts</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{posts.length}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm text-stone-500 dark:text-stone-400">Published</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{publishedCount}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm text-stone-500 dark:text-stone-400">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{draftCount}</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-12 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">
            No blog posts yet.{" "}
            <Link href="/dashboard/admin/blog/new" className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
              Create your first post
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <BlogPostRow key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
