"use client";

import { useState } from "react";
import { fetchCityImage } from "../actions";

export function BulkFetchImagesButton({ cityIds }: { cityIds: number[] }) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ fetched: number; skipped: number } | null>(null);

  async function handleBulkFetch() {
    setRunning(true);
    setProgress(0);
    setResults(null);

    let fetched = 0;
    let skipped = 0;

    for (let i = 0; i < cityIds.length; i++) {
      setProgress(i + 1);
      try {
        const result = await fetchCityImage(cityIds[i]);
        if (result.success) {
          fetched++;
        } else {
          skipped++;
        }
      } catch {
        skipped++;
      }
    }

    setResults({ fetched, skipped });
    setRunning(false);
  }

  if (cityIds.length === 0) return null;

  return (
    <div className="mb-6 flex items-center gap-4">
      <button
        onClick={handleBulkFetch}
        disabled={running}
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
      >
        {running
          ? `Fetching ${progress} of ${cityIds.length}...`
          : `Fetch Missing Images (${cityIds.length})`}
      </button>

      {running && (
        <div className="flex-1 max-w-xs">
          <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700">
            <div
              className="h-2 rounded-full bg-teal-500 transition-all"
              style={{ width: `${(progress / cityIds.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {results && (
        <span className="text-sm text-stone-500 dark:text-stone-400">
          {results.fetched} fetched, {results.skipped} skipped
        </span>
      )}
    </div>
  );
}
