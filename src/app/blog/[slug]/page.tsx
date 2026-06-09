export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { fullMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, articleJsonLd } from "@/components/JsonLd";
import { MarkdownContent } from "./MarkdownContent";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "published" },
    select: { title: true, excerpt: true, coverImage: true },
  });

  if (!post) return {};

  return fullMeta({
    title: post.title,
    description: post.excerpt,
    url: `/blog/${slug}`,
    image: post.coverImage ?? undefined,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "published" },
    include: { author: { select: { name: true } } },
  });

  if (!post) notFound();

  // Fire-and-forget view count increment
  prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  const breadcrumbs = [
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://inklinktattoofinder.com" },
          { name: "Blog", url: "https://inklinktattoofinder.com/blog" },
          { name: post.title, url: `https://inklinktattoofinder.com/blog/${slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          url: `/blog/${slug}`,
          image: post.coverImage,
          publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
          updatedAt: post.updatedAt.toISOString(),
          authorName: post.author.name,
        })}
      />

      <Breadcrumbs items={breadcrumbs} />

      <article>
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
            {post.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
            <span>By {post.author.name}</span>
            <span className="text-stone-300 dark:text-stone-600">&middot;</span>
            <time dateTime={(post.publishedAt ?? post.createdAt).toISOString()}>
              {(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </header>

        <div className="prose prose-stone max-w-none prose-headings:font-display prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline dark:prose-invert dark:prose-a:text-teal-400">
          <MarkdownContent content={post.content} />
        </div>
      </article>
    </main>
  );
}
