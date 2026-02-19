import Link from "next/link";
import { StatesDropdown } from "./StatesDropdown";
import { UserMenu } from "./UserMenu";
import { getAllStates } from "@/lib/queries";

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ink swirl circle */}
      <path
        d="M38 18c2 6 1 13-4 18s-13 6-19 3"
        stroke="#14B8A6"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 30c-2-6-1-13 4-18s13-6 19-3"
        stroke="#14B8A6"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Splash accents */}
      <path
        d="M37 14c1-2 3-3 4-2"
        stroke="#14B8A6"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M8 35c-1 1-2 3-1 4"
        stroke="#14B8A6"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      {/* Ink splatter dots */}
      <circle cx="40" cy="11" r="1.2" fill="#14B8A6" opacity="0.5" />
      <circle cx="42" cy="15" r="0.8" fill="#14B8A6" opacity="0.4" />
      <circle cx="6" cy="37" r="1" fill="#14B8A6" opacity="0.4" />
      <circle cx="4" cy="33" r="0.7" fill="#14B8A6" opacity="0.3" />
      {/* Tattoo pen body */}
      <rect
        x="17.5"
        y="8"
        width="6"
        height="18"
        rx="1.5"
        transform="rotate(35 20.5 17)"
        fill="#374151"
        stroke="#1f2937"
        strokeWidth="0.5"
      />
      {/* Pen grip bands */}
      <line x1="18" y1="18" x2="22" y2="15" stroke="#6b7280" strokeWidth="0.8" opacity="0.6" />
      <line x1="19" y1="20" x2="23" y2="17" stroke="#6b7280" strokeWidth="0.8" opacity="0.6" />
      <line x1="20" y1="22" x2="24" y2="19" stroke="#6b7280" strokeWidth="0.8" opacity="0.6" />
      {/* Pen tip / needle */}
      <line
        x1="26"
        y1="28"
        x2="30"
        y2="34"
        stroke="#1f2937"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Ink drop at tip */}
      <circle cx="31" cy="35.5" r="1.8" fill="#14B8A6" />
      {/* Pen top detail */}
      <circle cx="14.5" cy="11" r="0.8" fill="#6b7280" />
      <circle cx="16" cy="9.5" r="0.8" fill="#6b7280" />
    </svg>
  );
}

export async function Header() {
  let states: Awaited<ReturnType<typeof getAllStates>> = [];
  try {
    states = await getAllStates();
  } catch {
    // DB unavailable during static pre-rendering
  }
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-stone-950/95 backdrop-blur-lg dark:border-stone-800/40 dark:bg-stone-950/95">
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
          <StatesDropdown states={states.map((s) => ({
            name: s.name,
            slug: s.slug,
            abbreviation: s.abbreviation,
            _count: { listings: s._count.listings },
          }))} />
          {[
            { href: "/categories", label: "Styles" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
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
          <UserMenu />
          <Link
            href="/list-your-shop"
            className="rounded-full border border-teal-500 bg-teal-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-600 hover:border-teal-600 hover:shadow-lg hover:shadow-teal-500/20"
          >
            Add Your Shop
          </Link>
        </div>
      </div>
    </header>
  );
}
