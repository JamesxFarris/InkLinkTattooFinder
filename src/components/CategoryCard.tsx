import Link from "next/link";
import { CategoryIcon, categoryColors } from "./CategoryIcon";
import type { CategoryWithCount } from "@/types";

export function CategoryCard({
  category,
  href,
}: {
  category: CategoryWithCount;
  href: string;
}) {
  const colors = categoryColors[category.slug] ?? {
    from: "#1c1917",
    to: "#292524",
    accent: "#14b8a6",
  };

  return (
    <Link
      href={href}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-stone-800/60 bg-stone-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-stone-700/80 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]"
    >
      {/* Subtle accent glow behind the card on hover */}
      <span
        className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: colors.accent }}
        aria-hidden="true"
      />

      {/* Icon container with themed gradient background */}
      <span
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] shadow-inner"
        style={{
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
        }}
      >
        {/* Subtle inner highlight */}
        <span
          className="pointer-events-none absolute inset-0 rounded-xl opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${colors.accent}33, transparent 70%)`,
          }}
          aria-hidden="true"
        />
        <CategoryIcon slug={category.slug} />
      </span>

      {/* Text content */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-stone-100 transition-colors group-hover:text-teal-400">
          {category.name}
        </h3>
        <p className="mt-0.5 text-sm text-stone-500">
          {category._count.listings}{" "}
          {category._count.listings === 1 ? "listing" : "listings"}
        </p>
      </div>

      {/* Arrow with accent ring on hover */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-700/50 bg-stone-800 transition-all duration-300 group-hover:border-transparent group-hover:text-white"
        style={
          {
            "--tw-ring-color": colors.accent,
          } as React.CSSProperties
        }
      >
        <span
          className="absolute h-9 w-9 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: colors.accent }}
          aria-hidden="true"
        />
        <svg
          className="relative h-4 w-4 text-stone-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Bottom accent line */}
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(90deg, ${colors.accent}, transparent)` }}
        aria-hidden="true"
      />
    </Link>
  );
}
