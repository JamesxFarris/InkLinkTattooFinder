"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ className, size = "default" }: { className?: string; size?: "default" | "large" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/search?${params.toString()}`);
  }

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className={className} role="search" aria-label="Search tattoo shops">
      <div className={`flex w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-stone-900/5 dark:bg-stone-900 dark:ring-white/10 ${isLarge ? "shadow-2xl" : ""}`}>
        <div className="flex flex-1 items-center px-5">
          <svg
            className={`text-stone-400 ${isLarge ? "h-6 w-6" : "h-5 w-5"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tattoo shops, styles, or cities..."
            aria-label="Search tattoo shops, styles, or cities"
            className={`w-full bg-transparent px-4 outline-none placeholder:text-stone-400 ${isLarge ? "py-5 text-base" : "py-3.5 text-sm"}`}
          />
        </div>
        <button
          type="submit"
          className={`bg-red-600 font-semibold text-white transition-colors hover:bg-red-700 ${isLarge ? "px-8 text-base" : "px-6 text-sm"}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
