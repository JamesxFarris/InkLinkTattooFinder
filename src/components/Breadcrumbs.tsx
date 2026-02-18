import Link from "next/link";
import type { BreadcrumbItem } from "@/types";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
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
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-red-600 dark:hover:text-red-400"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
