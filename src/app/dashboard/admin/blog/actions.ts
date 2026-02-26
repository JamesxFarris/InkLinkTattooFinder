"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function createPost(formData: FormData) {
  const session = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || slugify(title);
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = formData.get("content") as string;
  const coverImage = (formData.get("coverImage") as string)?.trim() || null;
  const status = formData.get("status") === "published" ? "published" : "draft";

  if (!title || !slug || !excerpt || !content) {
    throw new Error("Title, slug, excerpt, and content are required");
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      authorId: parseInt(session.user.id),
      status,
      publishedAt: status === "published" ? new Date() : null,
    },
  });

  await auditLog({
    userId: parseInt(session.user.id),
    action: "blog.create",
    targetType: "blogPost",
    targetId: post.id,
    details: { title, status },
  });

  revalidatePath("/blog");
  revalidatePath("/dashboard/admin/blog");
  redirect("/dashboard/admin/blog");
}

export async function updatePost(id: number, formData: FormData) {
  const session = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = formData.get("content") as string;
  const coverImage = (formData.get("coverImage") as string)?.trim() || null;
  const status = formData.get("status") === "published" ? "published" : "draft";

  if (!title || !slug || !excerpt || !content) {
    throw new Error("Title, slug, excerpt, and content are required");
  }

  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: { status: true, publishedAt: true },
  });

  const publishedAt =
    status === "published" && existing?.status !== "published"
      ? new Date()
      : existing?.publishedAt;

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      status,
      publishedAt: status === "published" ? publishedAt : null,
    },
  });

  await auditLog({
    userId: parseInt(session.user.id),
    action: "blog.update",
    targetType: "blogPost",
    targetId: id,
    details: { title, status },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/dashboard/admin/blog");
  redirect("/dashboard/admin/blog");
}

export async function deletePost(id: number) {
  const session = await requireAdmin();

  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { title: true },
  });

  await prisma.blogPost.delete({ where: { id } });

  await auditLog({
    userId: parseInt(session.user.id),
    action: "blog.delete",
    targetType: "blogPost",
    targetId: id,
    details: { title: post?.title },
  });

  revalidatePath("/blog");
  revalidatePath("/dashboard/admin/blog");
}
