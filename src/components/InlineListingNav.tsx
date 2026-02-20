"use client";

export function InlineListingNav({
  items,
}: {
  items: { index: number; name: string }[];
}) {
  return (
    <nav aria-label="Quick jump to listings" className="flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.index}
          href={`#listing-${item.index}`}
          title={item.name}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700 transition-colors hover:bg-teal-500 hover:text-white dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-teal-500 dark:hover:text-white"
        >
          {item.index}
        </a>
      ))}
    </nav>
  );
}
