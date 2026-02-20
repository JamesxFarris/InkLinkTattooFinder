import Link from "next/link";
import { getTopCitiesWithListings, getTopStatesByListingCount } from "@/lib/queries";

export async function Footer() {
  const [topCities, topStates] = await Promise.all([
    getTopCitiesWithListings(10),
    getTopStatesByListingCount(8),
  ]);

  return (
    <footer className="border-t border-stone-200 bg-stone-950 dark:border-stone-800 dark:bg-stone-950" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:pr-8">
            <Link href="/" className="inline-flex items-baseline gap-1.5" aria-label="InkLink Tattoo Finder">
              <span className="text-xl font-bold text-teal-500">InkLink</span>
              <span className="text-xs font-medium text-stone-400 dark:text-stone-500">
                Tattoo Finder
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
              Find the best tattoo artists and shops near you. Browse by style,
              city, and read reviews to find your perfect artist.
            </p>
          </div>

          {/* Popular Styles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Popular Styles
            </h4>
            <ul className="mt-4 space-y-3">
              {[
                { name: "Traditional", slug: "traditional" },
                { name: "Realism", slug: "realism" },
                { name: "Japanese", slug: "japanese" },
                { name: "Fine Line", slug: "fine-line" },
                { name: "Blackwork", slug: "blackwork" },
              ].map((style) => (
                <li key={style.slug}>
                  <Link
                    href={`/categories/${style.slug}`}
                    className="text-sm text-stone-500 transition-colors hover:text-teal-500 dark:text-stone-400 dark:hover:text-teal-400"
                  >
                    {style.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Top Cities
            </h4>
            <ul className="mt-4 space-y-3">
              {topCities.map((city) => (
                <li key={city.id}>
                  <Link
                    href={`/tattoo-shops/${city.state.slug}/${city.slug}`}
                    className="text-sm text-stone-500 transition-colors hover:text-teal-500 dark:text-stone-400 dark:hover:text-teal-400"
                  >
                    {city.name}, {city.state.abbreviation}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tattoo-shops"
                  className="text-sm font-medium text-teal-500 transition-colors hover:text-teal-400"
                >
                  Browse All States
                </Link>
              </li>
            </ul>
          </div>

          {/* Browse by State */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Browse by State
            </h4>
            <ul className="mt-4 space-y-3">
              {topStates.map((state) => (
                <li key={state.id}>
                  <Link
                    href={`/tattoo-shops/${state.slug}`}
                    className="text-sm text-stone-500 transition-colors hover:text-teal-500 dark:text-stone-400 dark:hover:text-teal-400"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tattoo-shops"
                  className="text-sm font-medium text-teal-500 transition-colors hover:text-teal-400"
                >
                  All States
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {[
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "List Your Shop", href: "/list-your-shop" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 transition-colors hover:text-teal-500 dark:text-stone-400 dark:hover:text-teal-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-stone-200 pt-8 dark:border-stone-800">
          <p className="text-center text-sm text-stone-400 dark:text-stone-500">
            &copy; {new Date().getFullYear()} InkLink Tattoo Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
