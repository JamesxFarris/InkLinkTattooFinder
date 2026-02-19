"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/faq";

export function CityFaq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-stone-200 divide-y divide-stone-200 dark:border-stone-700 dark:divide-stone-700">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50 dark:text-stone-100 dark:hover:bg-stone-800/50"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-5 w-5 shrink-0 text-teal-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
