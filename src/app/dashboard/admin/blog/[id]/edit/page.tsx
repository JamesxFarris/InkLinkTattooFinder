import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostForm } from "../../BlogPostForm";
import { updatePost } from "../../actions";

export const metadata: Metadata = {
  title: "Edit Blog Post — Admin",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPostPage({ params }: Props) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const { id } = await params;
  const postId = parseInt(id, 10);
  if (isNaN(postId)) notFound();

  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
  });

  if (!post) notFound();

  const boundUpdate = updatePost.bind(null, postId);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
        Edit Blog Post
      </h1>
      <BlogPostForm
        action={boundUpdate}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          status: post.status,
        }}
      />
    </div>
  );
}
