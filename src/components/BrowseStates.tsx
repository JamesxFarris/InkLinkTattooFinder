import Link from "next/link";
import type { StateWithCount } from "@/types";

export function BrowseStates({
  states,
  currentStateSlug,
}: {
  states: StateWithCount[];
  currentStateSlug?: string;
}) {
  const filtered = states
    .filter((s) => s.slug !== currentStateSlug)
    .sort((a, b) => b._count.listings - a._count.listings)
    .slice(0, 10);

  if (filtered.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
        Browse Other States
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {filtered.map((state) => (
          <Link
            key={state.id}
            href={`/tattoo-shops/${state.slug}`}
            className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-teal-500 hover:text-white dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-teal-500 dark:hover:text-white"
          >
            {state.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
