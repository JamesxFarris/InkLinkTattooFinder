"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ className, size = "default" }: { className?: string; size?: "default" | "large" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/search?${params.toString()}`);
  }

  function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`,
          );
          const data = await res.json();
          const zip = data?.address?.postcode;
          if (zip) {
            setQuery(zip);
          }
        } catch {
          // silently fail
        }
        setLocating(false);
      },
      () => setLocating(false),
    );
  }

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className={`${isLarge ? "w-full" : ""} ${className || ""}`} role="search" aria-label="Search tattoo shops">
      <div className={`flex w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-stone-900/5 dark:bg-stone-900 dark:ring-white/10 ${isLarge ? "shadow-2xl" : "max-w-2xl"}`}>
        <div className="flex flex-1 items-center px-5">
          <svg
            className={`shrink-0 text-stone-400 ${isLarge ? "h-6 w-6" : "h-5 w-5"}`}
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
            placeholder="Zip Code"
            aria-label="Search by zip code"
            className={`w-full bg-transparent px-4 text-stone-900 outline-none placeholder:text-stone-400 dark:text-stone-100 ${isLarge ? "py-5 text-lg" : "py-3.5 text-base"}`}
          />
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-teal-400 hover:bg-teal-50 hover:text-teal-600 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-teal-500 dark:hover:bg-teal-500/10 dark:hover:text-teal-400"
          >
            {locating ? (
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span className="hidden sm:inline">{locating ? "Locating..." : "Use my location"}</span>
          </button>
        </div>
        <button
          type="submit"
          className={`bg-teal-500 font-semibold text-white transition-colors hover:bg-teal-600 ${isLarge ? "px-10 text-lg" : "px-6 text-sm"}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
