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
      className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-red-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-red-800"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-2xl dark:bg-neutral-800">
        {category.icon || "🎨"}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-neutral-900 group-hover:text-red-600 dark:text-neutral-100 dark:group-hover:text-red-400">
          {category.name}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {category._count.listings}{" "}
          {category._count.listings === 1 ? "listing" : "listings"}
        </p>
      </div>
      <svg
        className="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}
