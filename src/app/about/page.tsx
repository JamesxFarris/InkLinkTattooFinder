import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About InkLink Tattoo Finder | Our Mission to Connect You With Great Tattoo Artists",
  description:
    "InkLink Tattoo Finder was built to make finding a quality tattoo artist easy — no matter where you live. Browse shops by style, city, and ratings across all 50 states.",
  openGraph: {
    title: "About InkLink Tattoo Finder",
    description:
      "We built InkLink to make finding a quality tattoo artist easy — no matter where you live.",
  },
};

const features = [
  {
    title: "Search by Location",
    description:
      "Browse tattoo shops in every major city across all 50 states. Whether you're in a big metro or a smaller town, InkLink helps you find artists nearby.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    title: "Filter by Style",
    description:
      "From traditional Americana and Japanese to fine line and realism — filter artists by the exact tattoo style you want so you find someone who matches your vision.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
  },
  {
    title: "Real Ratings & Reviews",
    description:
      "Every listing features Google ratings and review counts so you can compare shops with confidence and pick an artist with a proven track record.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
  {
    title: "Walk-In Friendly",
    description:
      "Need ink today? Filter for shops that accept walk-ins so you can find an available artist without the wait for an appointment.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    title: "Detailed Shop Info",
    description:
      "Get the full picture before you visit — hours, pricing, contact details, portfolio links, and whether they offer services like piercings.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    title: "Completely Free",
    description:
      "InkLink is 100% free for anyone searching for a tattoo artist. No sign-ups, no paywalls — just the information you need to make a great choice.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "50", label: "States Covered" },
  { value: "1,000+", label: "Cities Listed" },
  { value: "15+", label: "Tattoo Styles" },
  { value: "100%", label: "Free to Use" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "About" }])} />
      <JsonLd
        data={webPageJsonLd({
          name: "About InkLink Tattoo Finder",
          description:
            "InkLink Tattoo Finder was built to make finding a quality tattoo artist easy — no matter where you live.",
          url: "/about",
          type: "AboutPage",
        })}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-950">
        {/* Decorative background pattern */}
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
        {/* Teal glow */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-teal-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-16 lg:px-8">
          <Breadcrumbs items={[{ label: "About" }]} />

          <div className="mt-4 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Finding Great Ink,{" "}
              <span className="text-teal-400">Made Simple</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-300">
              We built InkLink because finding a quality tattoo artist shouldn&apos;t
              depend on where you live. Whether you&apos;re in downtown LA or a
              small town in the Midwest, everyone deserves access to great artists
              and the information they need to choose with confidence.
            </p>
          </div>

          {/* Stats bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-stone-800 bg-stone-900/60 px-4 py-5 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-teal-400">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-stone-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="border-y border-stone-200/60 bg-stone-100/40 dark:border-stone-800/40 dark:bg-stone-900/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Illustration */}
            <div className="flex justify-center" aria-hidden="true">
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-teal-500/10 blur-2xl" />
                <div className="relative rounded-2xl border border-stone-200 bg-white p-8 shadow-lg dark:border-stone-700 dark:bg-stone-800">
                  <svg viewBox="0 0 200 200" className="h-48 w-48 sm:h-56 sm:w-56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* US map outline (simplified) */}
                    <rect x="20" y="50" width="160" height="100" rx="12" className="stroke-stone-300 dark:stroke-stone-600" strokeWidth="1.5" strokeDasharray="4 4" />
                    {/* Location pins */}
                    <circle cx="55" cy="85" r="6" className="fill-teal-500/20 stroke-teal-500" strokeWidth="1.5" />
                    <circle cx="55" cy="85" r="2" className="fill-teal-500" />
                    <circle cx="130" cy="75" r="6" className="fill-teal-500/20 stroke-teal-500" strokeWidth="1.5" />
                    <circle cx="130" cy="75" r="2" className="fill-teal-500" />
                    <circle cx="90" cy="115" r="6" className="fill-teal-500/20 stroke-teal-500" strokeWidth="1.5" />
                    <circle cx="90" cy="115" r="2" className="fill-teal-500" />
                    <circle cx="155" cy="105" r="6" className="fill-teal-500/20 stroke-teal-500" strokeWidth="1.5" />
                    <circle cx="155" cy="105" r="2" className="fill-teal-500" />
                    <circle cx="45" cy="125" r="6" className="fill-teal-500/20 stroke-teal-500" strokeWidth="1.5" />
                    <circle cx="45" cy="125" r="2" className="fill-teal-500" />
                    {/* Connection lines */}
                    <line x1="55" y1="85" x2="130" y2="75" className="stroke-teal-500/30" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="130" y1="75" x2="155" y2="105" className="stroke-teal-500/30" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="55" y1="85" x2="90" y2="115" className="stroke-teal-500/30" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="90" y1="115" x2="155" y2="105" className="stroke-teal-500/30" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="45" y1="125" x2="90" y2="115" className="stroke-teal-500/30" strokeWidth="1" strokeDasharray="3 3" />
                    {/* Needle icon center */}
                    <line x1="88" y1="65" x2="112" y2="89" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="114" cy="91" r="3" className="fill-stone-400 dark:fill-stone-500" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Story text */}
            <div>
              <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
                Why We Built InkLink
              </h2>
              <div className="mt-6 space-y-4 text-stone-600 dark:text-stone-400 leading-relaxed">
                <p>
                  Getting a tattoo is personal. It&apos;s a piece of art you carry
                  with you for life — and finding the right artist matters. But for
                  too many people, that search is harder than it should be.
                </p>
                <p>
                  We designed InkLink to solve that problem. Our directory brings
                  together tattoo shops and artists from across the entire United
                  States into one searchable, filterable platform. No more sifting
                  through scattered review sites or relying on word-of-mouth alone.
                </p>
                <p>
                  Whether you&apos;re planning a sleeve or getting your first small
                  piece, InkLink gives you the tools to compare artists by style,
                  read real reviews, check pricing, and find someone whose work
                  speaks to you —{" "}
                  <strong className="text-stone-900 dark:text-stone-200">
                    regardless of your location
                  </strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
            What Makes InkLink Different
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-stone-500 dark:text-stone-400">
            Everything you need to find your next tattoo artist, all in one place.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-stone-200/60 bg-white p-6 transition-all hover:border-teal-500/40 hover:shadow-lg dark:border-stone-700/60 dark:bg-stone-800/50 dark:hover:border-teal-500/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 transition-colors group-hover:bg-teal-500/20">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA for shop owners */}
      <section className="border-t border-stone-200/60 bg-stone-950 dark:border-stone-800/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-white">
              Own a Tattoo Shop?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-stone-400">
              Get your shop in front of thousands of people searching for their
              next tattoo artist. Listing on InkLink is fast, easy, and helps new
              clients find you.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/list-your-shop"
                className="inline-flex rounded-full bg-teal-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-500/30"
              >
                List Your Shop
              </Link>
              <Link
                href="/contact"
                className="inline-flex rounded-full border border-stone-700 px-8 py-3.5 text-sm font-semibold text-stone-300 transition-all hover:border-teal-500 hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
