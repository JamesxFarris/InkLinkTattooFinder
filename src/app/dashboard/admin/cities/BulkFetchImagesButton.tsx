"use client";

import { useState } from "react";
import { clearCityImage, fetchCityImage } from "../actions";

type Props = {
  missingIds: number[];
  allIds: number[];
};

export function BulkFetchImagesButton({ missingIds, allIds }: Props) {
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"missing" | "all">("missing");
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState<{ fetched: number; skipped: number } | null>(null);

  async function handleBulkFetch(ids: number[], clearFirst: boolean) {
    setRunning(true);
    setProgress(0);
    setTotal(ids.length);
    setResults(null);

    let fetched = 0;
    let skipped = 0;

    for (let i = 0; i < ids.length; i++) {
      setProgress(i + 1);
      try {
        if (clearFirst) await clearCityImage(ids[i]);
        const result = await fetchCityImage(ids[i]);
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

  if (allIds.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      {missingIds.length > 0 && (
        <button
          onClick={() => { setMode("missing"); handleBulkFetch(missingIds, false); }}
          disabled={running}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
        >
          {running && mode === "missing"
            ? `Fetching ${progress} of ${total}...`
            : `Fetch Missing (${missingIds.length})`}
        </button>
      )}

      <button
        onClick={() => { setMode("all"); handleBulkFetch(allIds, true); }}
        disabled={running}
        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
      >
        {running && mode === "all"
          ? `Re-fetching ${progress} of ${total}...`
          : `Re-fetch All (${allIds.length})`}
      </button>

      {running && (
        <div className="flex-1 max-w-xs">
          <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700">
            <div
              className="h-2 rounded-full bg-teal-500 transition-all"
              style={{ width: `${(progress / total) * 100}%` }}
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
