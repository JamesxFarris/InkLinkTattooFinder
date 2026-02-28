export const revalidate = 300; // ISR: rebuild every 5 minutes

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { fullMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = fullMeta({
  title: "Blog — Tattoo Tips, Guides & Industry Insights",
  description:
    "Read expert guides on tattoo costs, styles, aftercare, and finding the best artists. Stay informed with the latest from InkLink.",
  url: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published", publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  const breadcrumbs = [{ label: "Blog" }];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "https://inklinktattoofinder.com" }, { name: "Blog", url: "https://inklinktattoofinder.com/blog" }])} />
      <JsonLd data={collectionPageJsonLd({ name: "Blog", description: "Tattoo tips, guides, and industry insights from InkLink.", url: "/blog" })} />

      <Breadcrumbs items={breadcrumbs} />

      <h1 className="font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
        Blog
      </h1>
      <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">
        Tattoo tips, cost guides, style breakdowns, and industry insights.
      </p>

      {posts.length === 0 ? (
        <div className="mt-12 rounded-xl border border-stone-200 bg-stone-50 p-12 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">
            No posts yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
            >
              <Link href={`/blog/${post.slug}`}>
                {post.coverImage ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center bg-stone-100 dark:bg-stone-800">
                    <svg className="h-12 w-12 text-stone-300 dark:text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5" />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <time
                    dateTime={post.publishedAt!.toISOString()}
                    className="text-xs font-medium text-stone-400 dark:text-stone-500"
                  >
                    {post.publishedAt!.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <h2 className="mt-1.5 font-display text-lg font-semibold text-stone-900 group-hover:text-teal-600 dark:text-stone-100 dark:group-hover:text-teal-400">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-stone-500 dark:text-stone-400">
                    {post.excerpt}
                  </p>
                  {post.author && (
                    <p className="mt-3 text-xs text-stone-400 dark:text-stone-500">
                      By {post.author.name}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
