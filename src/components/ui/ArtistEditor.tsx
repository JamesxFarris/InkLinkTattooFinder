"use client";

import { useState, useRef } from "react";
import { inputClass } from "@/lib/formClasses";

type ArtistEntry = { name: string; instagramUrl: string };

/** Normalize legacy string[] or object[] into ArtistEntry[] */
function normalizeArtists(raw: unknown): ArtistEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (typeof item === "string") return { name: item, instagramUrl: "" };
    if (typeof item === "object" && item !== null && "name" in item) {
      return {
        name: String((item as { name: unknown }).name),
        instagramUrl: String((item as { instagramUrl?: unknown }).instagramUrl ?? ""),
      };
    }
    return { name: String(item), instagramUrl: "" };
  });
}

export function ArtistEditor({
  existing = [],
  showInstagram = false,
}: {
  existing?: unknown[];
  showInstagram?: boolean;
}) {
  const [artists, setArtists] = useState<ArtistEntry[]>(() => normalizeArtists(existing));
  const inputRef = useRef<HTMLInputElement>(null);

  const addArtist = () => {
    const value = inputRef.current?.value.trim();
    if (!value) return;
    if (artists.some((a) => a.name === value)) return;
    setArtists((prev) => [...prev, { name: value, instagramUrl: "" }]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeArtist = (index: number) => {
    setArtists((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInstagramUrl = (index: number, url: string) => {
    setArtists((prev) => prev.map((a, i) => (i === index ? { ...a, instagramUrl: url } : a)));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addArtist();
    }
  };

  return (
    <div>
      {/* Single hidden input for JSON submission */}
      <input type="hidden" name="artistsJson" value={JSON.stringify(artists)} />

      {/* Input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Artist name"
          onKeyDown={handleKeyDown}
          className={inputClass}
        />
        <button
          type="button"
          onClick={addArtist}
          className="shrink-0 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
        >
          Add
        </button>
      </div>

      {/* Artist tags */}
      {artists.length > 0 && (
        <div className="mt-3 space-y-2">
          {artists.map((artist, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                {artist.name}
                <button
                  type="button"
                  onClick={() => removeArtist(i)}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-300 hover:text-stone-600 dark:hover:bg-stone-600 dark:hover:text-stone-200"
                >
                  <span className="text-xs leading-none">&times;</span>
                </button>
              </span>
              {showInstagram && (
                <input
                  type="url"
                  value={artist.instagramUrl}
                  onChange={(e) => updateInstagramUrl(i, e.target.value)}
                  placeholder="Instagram URL (optional)"
                  className={`flex-1 text-sm ${inputClass}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
