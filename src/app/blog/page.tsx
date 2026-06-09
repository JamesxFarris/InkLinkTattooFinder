export const dynamic = "force-dynamic";

import Link from "next/link";
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

const CARD_THEMES = [
  { gradient: "from-teal-500 to-emerald-600", icon: "pen" },
  { gradient: "from-violet-500 to-purple-600", icon: "book" },
  { gradient: "from-amber-500 to-orange-600", icon: "lightbulb" },
  { gradient: "from-rose-500 to-pink-600", icon: "heart" },
  { gradient: "from-sky-500 to-blue-600", icon: "map" },
  { gradient: "from-fuchsia-500 to-pink-600", icon: "star" },
] as const;

function CardIcon({ icon }: { icon: string }) {
  const cls = "h-10 w-10 text-white/30";
  switch (icon) {
    case "pen":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
        </svg>
      );
    case "book":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      );
    case "heart":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      );
    case "map":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      );
  }
}

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published", publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: {
      title: true,
      slug: true,
      excerpt: true,
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
          {posts.map((post, i) => {
            const theme = CARD_THEMES[i % CARD_THEMES.length];
            return (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
                  <div className={`relative flex aspect-[16/9] items-end bg-gradient-to-br ${theme.gradient} p-5`}>
                    <div className="absolute top-4 right-4 opacity-60 transition-transform duration-300 group-hover:scale-110">
                      <CardIcon icon={theme.icon} />
                    </div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoNnptMC0zMHY2aC02VjRoNnptMCA2djZoLTZ2LTZoNnptMCA2djZoLTZ2LTZoNnptMCA2djZoLTZ2LTZoNnptMCA2djZoLTZ2LTZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
                    <h2 className="relative z-10 font-display text-lg font-bold leading-snug text-white drop-shadow-sm">
                      {post.title}
                    </h2>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex-1 line-clamp-2 text-sm text-stone-500 dark:text-stone-400">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-stone-400 dark:text-stone-500">
                      {post.author && <span>By {post.author.name}</span>}
                      <time dateTime={post.publishedAt!.toISOString()}>
                        {post.publishedAt!.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
