"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type StateItem = {
  name: string;
  slug: string;
  abbreviation: string;
  _count: { listings: number };
};

export function StatesDropdown({ states }: { states: StateItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-stone-500 transition-colors hover:text-teal-500 dark:text-stone-400 dark:hover:text-teal-400"
        aria-expanded={open}
        aria-haspopup="true"
      >
        States
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-[32rem] -translate-x-1/2 rounded-xl border border-stone-800 bg-stone-950 p-4 shadow-2xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
            Browse by State
          </div>
          <div className="grid max-h-80 grid-cols-3 gap-x-4 gap-y-0.5 overflow-y-auto">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1.5 text-sm text-stone-400 transition-colors hover:bg-stone-800 hover:text-teal-400"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
