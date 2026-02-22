"use client";

import { useState, useRef } from "react";
import { inputClass } from "@/lib/formClasses";

export function ArtistEditor({ existing = [] }: { existing?: string[] }) {
  const [artists, setArtists] = useState<string[]>(existing);
  const inputRef = useRef<HTMLInputElement>(null);

  const addArtist = () => {
    const value = inputRef.current?.value.trim();
    if (!value) return;
    if (artists.includes(value)) return;
    setArtists((prev) => [...prev, value]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeArtist = (index: number) => {
    setArtists((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addArtist();
    }
  };

  return (
    <div>
      {/* Hidden inputs for form submission */}
      {artists.map((name, i) => (
        <input key={i} type="hidden" name="artists" value={name} />
      ))}

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
        <div className="mt-3 flex flex-wrap gap-2">
          {artists.map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700 dark:bg-stone-800 dark:text-stone-300"
            >
              {name}
              <button
                type="button"
                onClick={() => removeArtist(i)}
                className="flex h-4 w-4 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-300 hover:text-stone-600 dark:hover:bg-stone-600 dark:hover:text-stone-200"
              >
                <span className="text-xs leading-none">&times;</span>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
