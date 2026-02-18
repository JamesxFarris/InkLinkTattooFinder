"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex flex-1 items-center px-4">
          <svg
            className="h-5 w-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-neutral-400"
          />
        </div>
        <button
          type="submit"
          className="bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
