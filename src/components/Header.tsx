import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "@/components/auth/UserMenu";
import { MobileNav } from "@/components/MobileNav";

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" fill="currentColor" />
    </svg>
  );
}

export async function Header() {
  let session = null;
  try {
    session = await auth();
  } catch {
    // Gracefully handle auth errors (e.g. corrupt JWT during signout)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-stone-50 md:bg-white/95 md:backdrop-blur-lg dark:border-stone-800/40 dark:bg-stone-950 dark:md:bg-stone-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="InkLink Tattoo Finder — Home">
          <LogoMark className="h-8 w-8 text-teal-500 dark:text-teal-500" />
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Ink<span className="text-teal-500 dark:text-teal-500">Link</span>
            </span>
            <span className="hidden text-xs font-medium uppercase tracking-widest text-stone-400 sm:inline dark:text-stone-500">
              Tattoo Finder
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {[
            { href: "/tattoo-shops", label: "Browse States" },
            { href: "/categories", label: "Styles" },
            { href: "/search", label: "Search" },
            { href: "/about", label: "About" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-500 transition-colors hover:text-teal-500 dark:text-stone-400 dark:hover:text-teal-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {session ? (
            <UserMenu />
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-700 transition-all hover:border-teal-500 hover:text-teal-600 md:inline-flex dark:border-stone-600 dark:text-stone-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/list-your-shop"
            className="hidden rounded-full bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/20 md:inline-flex"
          >
            List Your Shop
          </Link>
          <MobileNav isSignedIn={!!session} />
        </div>
      </div>
    </header>
  );
}
