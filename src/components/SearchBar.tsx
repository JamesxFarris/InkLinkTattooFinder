"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchBar({ className, size = "default" }: { className?: string; size?: "default" | "large" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryList | MediaQueryListEvent) => {
      setPlaceholder(e.matches ? "Search by shop name, city, or zip code..." : "Zip code");
    };
    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/search?${params.toString()}`);
  }

  function handleGeolocation() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        router.push(`/search?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
      },
      () => {
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  }

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className={`${isLarge ? "w-full" : ""} ${className || ""}`} role="search" aria-label="Search tattoo shops">
      <div className={`flex w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-stone-900/5 dark:bg-stone-900 dark:ring-white/10 ${isLarge ? "shadow-2xl" : "max-w-2xl"}`}>
        <div className="flex flex-1 items-center px-3 md:px-5">
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
            placeholder={placeholder}
            aria-label="Search by shop name, city, or zip code"
            className={`w-full bg-transparent px-4 text-stone-900 outline-none placeholder:text-stone-400 dark:text-stone-100 ${isLarge ? "py-5 text-lg" : "py-3.5 text-base"}`}
          />
        </div>
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={geoLoading}
          className={`flex shrink-0 items-center justify-center border-l border-stone-200 text-stone-400 transition-colors hover:text-teal-500 disabled:opacity-50 dark:border-stone-700 ${isLarge ? "px-4" : "px-3"}`}
          aria-label="Use my location"
          title="Use my location"
        >
          {geoLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-teal-500" />
          ) : (
            <svg className={`${isLarge ? "h-6 w-6" : "h-5 w-5"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          )}
        </button>
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
