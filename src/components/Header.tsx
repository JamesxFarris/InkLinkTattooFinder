import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 shadow-sm backdrop-blur-lg dark:bg-stone-950/90">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-baseline gap-1.5" aria-label="InkLink Tattoo Finder — Home">
          <span className="text-2xl font-bold tracking-tight text-red-600">InkLink</span>
          <span className="hidden text-sm font-medium text-stone-400 sm:inline dark:text-stone-500">Tattoo Finder</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {[
            { href: "/categories", label: "Styles" },
            { href: "/search", label: "Search" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/25 transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30"
          >
            Find a Shop
          </Link>
        </div>
      </div>
    </header>
  );
}
