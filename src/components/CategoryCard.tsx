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
      className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-stone-700 bg-stone-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Icon container */}
      <span
        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          border: `1px solid ${colors.accent}30`,
        }}
      >
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

      {/* Arrow */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-700 bg-stone-800 transition-all duration-300 group-hover:border-transparent"
        style={{ ["--accent" as string]: colors.accent }}
      >
        <svg
          className="h-4 w-4 text-stone-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
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
        style={{
          background: colors.accent,
        }}
        aria-hidden="true"
      />
    </Link>
  );
}
