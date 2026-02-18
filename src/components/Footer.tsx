import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:pr-8">
            <Link href="/" className="inline-flex items-baseline gap-1.5" aria-label="InkLink Tattoo Finder">
              <span className="text-xl font-bold text-red-600">InkLink</span>
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
                    className="text-sm text-stone-500 transition-colors hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400"
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
              {[
                { name: "New York", path: "/new-york/new-york" },
                { name: "Los Angeles", path: "/california/los-angeles" },
                { name: "Chicago", path: "/illinois/chicago" },
                { name: "Houston", path: "/texas/houston" },
                { name: "Miami", path: "/florida/miami" },
              ].map((city) => (
                <li key={city.path}>
                  <Link
                    href={city.path}
                    className="text-sm text-stone-500 transition-colors hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
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
                { name: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 transition-colors hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400"
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
