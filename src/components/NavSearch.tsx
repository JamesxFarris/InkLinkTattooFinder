"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/search?${params.toString()}`);
    setQuery("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden md:flex"
      role="search"
      aria-label="Quick search"
    >
      <div className="flex items-center rounded-full border border-stone-700 bg-stone-900 transition-colors focus-within:border-teal-500/60 focus-within:ring-1 focus-within:ring-teal-500/30">
        <svg
          className="ml-3 h-4 w-4 shrink-0 text-stone-500"
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
          placeholder="Search shops..."
          aria-label="Search tattoo shops"
          className="w-36 bg-transparent px-2.5 py-1.5 text-sm text-stone-200 outline-none placeholder:text-stone-500 lg:w-44"
        />
      </div>
    </form>
  );
}
