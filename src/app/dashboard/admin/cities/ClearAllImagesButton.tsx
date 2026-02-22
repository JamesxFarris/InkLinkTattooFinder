"use client";

import { useState } from "react";
import { clearAllCityImages } from "../actions";

export function ClearAllImagesButton() {
  const [state, setState] = useState<"idle" | "confirm" | "running" | "done">("idle");

  async function handleClear() {
    setState("running");
    await clearAllCityImages();
    setState("done");
  }

  if (state === "done") {
    return (
      <span className="text-sm text-green-600 dark:text-green-400">
        All city imageUrls cleared.
      </span>
    );
  }

  if (state === "confirm") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-amber-600 dark:text-amber-400">
          Set imageUrl to null on all cities?
        </span>
        <button
          onClick={handleClear}
          disabled={state === "running"}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          Yes, Clear All
        </button>
        <button
          onClick={() => setState("idle")}
          className="rounded-lg bg-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setState("confirm")}
      disabled={state === "running"}
      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
    >
      {state === "running" ? "Clearing..." : "Clear All City Images"}
    </button>
  );
}
