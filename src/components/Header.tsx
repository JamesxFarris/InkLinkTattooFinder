import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "@/components/auth/UserMenu";

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ornate diamond frame */}
      <path
        d="M18 3L33 18L18 33L3 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner diamond */}
      <path
        d="M18 9L27 18L18 27L9 18Z"
        stroke="currentColor"
        strokeWidth="0.75"
        fill="none"
        opacity="0.4"
      />
      {/* Tattoo needle — diagonal through center */}
      <line
        x1="11"
        y1="11"
        x2="25"
        y2="25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Needle tip (ink drop) */}
      <circle cx="25.5" cy="25.5" r="2" fill="currentColor" />
      {/* Grip detail lines */}
      <line x1="14" y1="16" x2="16" y2="14" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
      <line x1="16" y1="18" x2="18" y2="16" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
      <line x1="18" y1="20" x2="20" y2="18" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
      {/* Corner ornaments */}
      <circle cx="18" cy="3" r="1" fill="currentColor" />
      <circle cx="33" cy="18" r="1" fill="currentColor" />
      <circle cx="18" cy="33" r="1" fill="currentColor" />
      <circle cx="3" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-white/95 backdrop-blur-lg dark:border-stone-800/40 dark:bg-stone-950/95">
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

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
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

        <div className="flex items-center gap-3">
          {session ? (
            <UserMenu />
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-stone-600 transition-colors hover:text-teal-500 dark:text-stone-400 dark:hover:text-teal-400"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/list-your-shop"
            className="rounded-full border border-teal-500 bg-teal-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-600 hover:border-teal-600 hover:shadow-lg hover:shadow-teal-500/20"
          >
            List Your Shop
          </Link>
        </div>
      </div>
    </header>
  );
}
