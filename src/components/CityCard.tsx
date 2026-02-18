import Link from "next/link";
import type { CityWithCount } from "@/types";

export function CityCard({ city }: { city: CityWithCount }) {
  return (
    <Link
      href={`/${city.state.slug}/${city.slug}`}
      className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-red-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-red-800"
    >
      <div>
        <h3 className="font-medium text-neutral-900 group-hover:text-red-600 dark:text-neutral-100 dark:group-hover:text-red-400">
          {city.name}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {city.state.name} &middot; {city._count.listings}{" "}
          {city._count.listings === 1 ? "shop" : "shops"}
        </p>
      </div>
      <svg
        className="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-1"
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
