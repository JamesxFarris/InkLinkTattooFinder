import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostForm } from "../BlogPostForm";
import { createPost } from "../actions";

export const metadata: Metadata = {
  title: "New Blog Post — Admin",
};

export default async function NewBlogPostPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
        New Blog Post
      </h1>
      <BlogPostForm action={createPost} />
    </div>
  );
}
