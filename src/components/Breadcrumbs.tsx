import Link from "next/link";
import type { BreadcrumbItem } from "@/types";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
        <li>
          <Link
            href="/"
            className="hover:text-red-600 dark:hover:text-red-400"
          >
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className="text-stone-300 dark:text-stone-600">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-red-600 dark:hover:text-red-400"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-stone-900 dark:text-stone-100">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
