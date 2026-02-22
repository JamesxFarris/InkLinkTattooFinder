"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type StyleFilterProps = {
  categories: Category[];
  basePath: string;
  activeStyle?: string;
};

export function StyleFilter({ categories, basePath, activeStyle }: StyleFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          !activeStyle
            ? "bg-teal-500 text-white"
            : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`${basePath}/style/${cat.slug}`}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeStyle === cat.slug
              ? "bg-teal-500 text-white"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
