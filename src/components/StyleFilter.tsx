"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export function StyleFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeStyle = searchParams.get("style");

  function handleClick(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("style", slug);
    } else {
      params.delete("style");
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleClick(null)}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          !activeStyle
            ? "bg-teal-500 text-white"
            : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.slug)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeStyle === cat.slug
              ? "bg-teal-500 text-white"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
