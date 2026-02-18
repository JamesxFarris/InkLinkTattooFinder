import Link from "next/link";
import type { CategoryWithCount } from "@/types";

export function CategoryCard({
  category,
  href,
}: {
  category: CategoryWithCount;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[var(--card-shadow)] ring-1 ring-stone-900/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--card-shadow-hover)] dark:bg-stone-900 dark:ring-white/[0.06]"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl dark:bg-amber-950/40">
        {category.icon || "🎨"}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-stone-900 transition-colors group-hover:text-red-600 dark:text-stone-100 dark:group-hover:text-red-400">
          {category.name}
        </h3>
        <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
          {category._count.listings}{" "}
          {category._count.listings === 1 ? "listing" : "listings"}
        </p>
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white dark:bg-stone-800 dark:group-hover:bg-red-600">
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
    </Link>
  );
}
