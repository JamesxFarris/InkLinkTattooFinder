import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-baseline gap-1.5" aria-label="InkLink Tattoo Finder — Home">
          <span className="text-2xl font-bold text-red-600">InkLink</span>
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Tattoo Finder</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <Link
            href="/categories"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Styles
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Search
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Find a Shop
          </Link>
        </div>
      </div>
    </header>
  );
}
