import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-red-600">InkLink <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Tattoo Finder</span></h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Find the best tattoo artists and shops near you. Browse by style,
              city, and read reviews.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Popular Styles
            </h4>
            <ul className="mt-3 space-y-2">
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
                    className="text-sm text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                  >
                    {style.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Top Cities
            </h4>
            <ul className="mt-3 space-y-2">
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
                    className="text-sm text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Company
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} InkLink Tattoo Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
