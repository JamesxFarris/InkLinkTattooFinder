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
    from: "#3a3530",
    to: "#4a4540",
    accent: "#14b8a6",
  };

  return (
    <Link
      href={href}
      className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-stone-700/50 bg-gradient-to-br from-stone-900 to-stone-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.7)]"
    >
      {/* Ambient accent glow — visible on hover */}
      <span
        className="pointer-events-none absolute -left-6 -top-6 h-40 w-40 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: colors.accent }}
        aria-hidden="true"
      />

      {/* Decorative corner flourish — tattoo flash inspired */}
      <span
        className="pointer-events-none absolute -right-1 -top-1 h-16 w-16 opacity-[0.04] transition-opacity duration-300 group-hover:opacity-[0.08]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 64 64" fill="none" className="h-full w-full">
          <path
            d="M64 0C50 0 40 4 32 12C24 20 16 24 0 28"
            stroke={colors.accent}
            strokeWidth="1.5"
          />
          <path
            d="M64 0C56 8 52 16 52 28"
            stroke={colors.accent}
            strokeWidth="1"
          />
          <circle cx="52" cy="28" r="2" fill={colors.accent} />
        </svg>
      </span>

      {/* Icon container — larger with visible gradient + ring */}
      <span
        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-lg transition-transform duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          borderColor: `${colors.accent}30`,
          boxShadow: `0 4px 20px -4px ${colors.accent}25, inset 0 1px 0 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Inner radial glow */}
        <span
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${colors.accent}40, transparent 65%)`,
          }}
          aria-hidden="true"
        />
        {/* Subtle stipple/dot texture overlay for tattoo feel */}
        <span
          className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "6px 6px",
          }}
          aria-hidden="true"
        />
        <CategoryIcon slug={category.slug} className="relative h-8 w-8" />
      </span>

      {/* Text content */}
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-bold tracking-wide text-stone-100 transition-colors group-hover:text-white">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-stone-500 transition-colors group-hover:text-stone-400">
          {category._count.listings}{" "}
          {category._count.listings === 1 ? "listing" : "listings"}
        </p>
      </div>

      {/* Arrow button with accent fill on hover */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-700/40 bg-stone-800/80 transition-all duration-300 group-hover:border-transparent">
        <span
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: colors.accent }}
          aria-hidden="true"
        />
        <svg
          className="relative h-4 w-4 text-stone-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
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

      {/* Bottom accent bar — sweeps in on hover */}
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}80, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle top edge highlight */}
      <span
        className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        aria-hidden="true"
      />
    </Link>
  );
}
