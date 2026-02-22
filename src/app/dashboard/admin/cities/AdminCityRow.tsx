"use client";

import { useState } from "react";
import Image from "next/image";
import { adminDeleteCity, fetchCityImage, clearCityImage } from "../actions";
import { getCityImageUrl } from "@/lib/images";

type CityRowProps = {
  city: {
    id: number;
    name: string;
    slug: string;
    state: { name: string; abbreviation: string; slug: string };
    listingCount: number;
    population: number | null;
    imageUrl: string | null;
  };
};

export function AdminCityRow({ city }: CityRowProps) {
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [clearing, setClearing] = useState(false);

  const displayImage = getCityImageUrl({
    slug: city.slug,
    imageUrl: city.imageUrl,
    state: { slug: city.state.slug },
  });

  async function handleDelete() {
    setLoading(true);
    await adminDeleteCity(city.id);
    setLoading(false);
    setConfirming(false);
  }

  async function handleFetch() {
    setFetching(true);
    try {
      await fetchCityImage(city.id);
    } catch {
      // handled server-side
    }
    setFetching(false);
  }

  async function handleClear() {
    setClearing(true);
    try {
      await clearCityImage(city.id);
    } catch {
      // handled server-side
    }
    setClearing(false);
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Thumbnail + status dot */}
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={displayImage}
            alt={city.name}
            fill
            className="object-cover"
            sizes="48px"
          />
          <span
            className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border border-white dark:border-stone-900 ${
              city.imageUrl ? "bg-green-500" : "bg-amber-400"
            }`}
            title={city.imageUrl ? "Custom image" : "Using state fallback"}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-stone-900 dark:text-stone-100">
              {city.name}
            </h2>
            <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-0.5 text-xs font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400">
              {city.state.abbreviation}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {city.listingCount} {city.listingCount === 1 ? "listing" : "listings"}
            {city.population && (
              <span className="ml-3 text-stone-400 dark:text-stone-500">
                Pop. {city.population.toLocaleString()}
              </span>
            )}
            <span className="ml-3 text-stone-400 dark:text-stone-500">
              /{city.slug}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Image actions */}
          <button
            onClick={handleFetch}
            disabled={fetching}
            className="rounded-lg bg-teal-600/20 px-3 py-1.5 text-xs font-medium text-teal-600 transition hover:bg-teal-600/30 disabled:opacity-50 dark:text-teal-400"
          >
            {fetching ? "Fetching..." : "Fetch"}
          </button>
          {city.imageUrl && (
            <button
              onClick={handleClear}
              disabled={clearing}
              className="rounded-lg bg-amber-600/20 px-3 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-600/30 disabled:opacity-50 dark:text-amber-400"
            >
              {clearing ? "Clearing..." : "Clear"}
            </button>
          )}

          {/* Delete */}
          {confirming ? (
            <>
              <span className="text-xs text-red-400">
                Delete city{city.listingCount > 0 ? ` and ${city.listingCount} listing${city.listingCount === 1 ? "" : "s"}` : ""}?
              </span>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={loading}
                className="rounded-lg bg-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-300 disabled:opacity-50 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-600/30"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
