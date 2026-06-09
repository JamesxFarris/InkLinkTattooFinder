import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/components/JsonLd";
import { fullMeta } from "@/lib/seo";
import { affiliateCategories } from "@/data/affiliate-products";
import type { Metadata } from "next";

export const metadata: Metadata = fullMeta({
  title: "Tattoo Products We Recommend",
  description:
    "The aftercare products, sun protection, and supplies that tattoo artists and collectors actually use. Curated recommendations with honest reviews.",
  url: "/tattoo-products",
});

export default function TattooProductsPage() {
  const breadcrumbs = [{ label: "Tattoo Products" }];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://inklinktattoofinder.com" },
          { name: "Tattoo Products", url: "https://inklinktattoofinder.com/tattoo-products" },
        ])}
      />
      <JsonLd
        data={webPageJsonLd({
          name: "Tattoo Products We Recommend",
          description:
            "The aftercare products, sun protection, and supplies that tattoo artists and collectors actually use.",
          url: "/tattoo-products",
        })}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-teal-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mt-4 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Products We{" "}
              <span className="text-teal-400">Actually Recommend</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-300">
              Aftercare that works, sun protection worth using, and supplies trusted
              by professional artists. No fluff — just the stuff that matters for
              keeping your ink looking its best.
            </p>
          </div>

          {/* Category quick-links */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {affiliateCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="rounded-full border border-stone-700 px-4 py-1.5 text-sm font-medium text-stone-300 transition hover:border-teal-500 hover:text-teal-400"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FTC Disclosure ───────────────────────────────────────────────── */}
      <div className="border-b border-stone-200 bg-amber-50 dark:border-stone-800 dark:bg-amber-950/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-amber-800 dark:text-amber-400">
            <strong>Disclosure:</strong> Some links on this page are affiliate links. If you
            purchase through them, InkLink may earn a small commission at no extra cost to you.
            We only recommend products we genuinely believe in.
          </p>
        </div>
      </div>

      {/* ── Product Categories ───────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="space-y-20">
          {affiliateCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-6">
              {/* Category header */}
              <div className="border-b border-stone-200 pb-4 dark:border-stone-800">
                <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {category.description}
                </p>
              </div>

              {/* Product grid */}
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.products.map((product) => (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
                  >
                    {/* Product image or placeholder */}
                    <div className="relative aspect-square w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-4 transition group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <svg
                            className="h-16 w-16 text-stone-300 dark:text-stone-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Badge */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 rounded-full bg-teal-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-semibold text-stone-900 leading-snug dark:text-stone-100">
                        {product.name}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {product.price}
                        </span>
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
                        >
                          Shop Now
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
        <div className="mt-20 rounded-2xl border border-stone-200 bg-stone-50 px-8 py-12 text-center dark:border-stone-800 dark:bg-stone-900/50">
          <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            Ready to find your next tattoo artist?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-stone-500 dark:text-stone-400">
            Browse thousands of tattoo shops across the US, filtered by style,
            city, and ratings.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-flex rounded-full bg-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
          >
            Find a Tattoo Artist
          </Link>
        </div>
      </main>
    </>
  );
}
