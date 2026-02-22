import Link from "next/link";
import type { CityWithCount } from "@/types";

export function CityCard({ city }: { city: CityWithCount }) {
  return (
    <Link
      href={`/tattoo-shops/${city.state.slug}/${city.slug}`}
      className="group flex items-center justify-between rounded-xl border border-stone-200/60 bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-lg dark:border-stone-700/50 dark:bg-stone-800/60 dark:hover:border-teal-500/40"
    >
      <div>
        <span className="font-semibold text-stone-800 transition-colors group-hover:text-teal-600 dark:text-stone-200 dark:group-hover:text-teal-400">
          {city.name}
        </span>
        <span className="mt-1 block text-sm text-stone-500 dark:text-stone-400">
          {city.state.name} &middot; {city._count.listings}{" "}
          {city._count.listings === 1 ? "shop" : "shops"}
        </span>
      </div>
      <svg
        className="h-4 w-4 flex-shrink-0 text-stone-300 transition-colors group-hover:text-teal-500 dark:text-stone-600 dark:group-hover:text-teal-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
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
