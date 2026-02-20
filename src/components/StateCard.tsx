import Link from "next/link";
import type { StateWithCount } from "@/types";

export function StateCard({ state }: { state: StateWithCount }) {
  return (
    <Link
      href={`/tattoo-shops/${state.slug}`}
      className="group flex items-center justify-between rounded-2xl bg-white p-5 shadow-[var(--card-shadow)] ring-1 ring-stone-900/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--card-shadow-hover)] dark:bg-stone-900 dark:ring-stone-700"
    >
      <div className="min-w-0">
        <h3 className="font-semibold text-stone-900 transition-colors group-hover:text-teal-500 dark:text-stone-100 dark:group-hover:text-teal-400">
          {state.name}
        </h3>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {state._count.listings} {state._count.listings === 1 ? "shop" : "shops"} &middot;{" "}
          {state._count.cities} {state._count.cities === 1 ? "city" : "cities"}
        </p>
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 transition-all duration-300 group-hover:bg-teal-500 group-hover:text-white dark:bg-stone-800 dark:group-hover:bg-teal-500">
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
