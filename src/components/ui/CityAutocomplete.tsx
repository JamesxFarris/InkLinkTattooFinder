"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { inputClass } from "@/lib/formClasses";

type CityAutocompleteProps = {
  stateId: string | null;
  defaultValue?: string;
  required?: boolean;
  onCityChange?: (city: string) => void;
};

export function CityAutocomplete({
  stateId,
  defaultValue = "",
  required,
  onCityChange,
}: CityAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasFetched, setHasFetched] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Reset when state changes
  useEffect(() => {
    setSuggestions([]);
    setIsOpen(false);
    setHasFetched(false);
  }, [stateId]);

  const fetchSuggestions = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      if (!stateId || value.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        setHasFetched(false);
        return;
      }

      timerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/cities/search?stateId=${encodeURIComponent(stateId)}&q=${encodeURIComponent(value)}`
          );
          const data = await res.json();
          const names: string[] = data.cities.map(
            (c: { name: string }) => c.name
          );
          setSuggestions(names);
          setIsOpen(names.length > 0);
          setHasFetched(true);
          setActiveIndex(-1);
        } catch {
          setSuggestions([]);
          setIsOpen(false);
          setHasFetched(true);
        }
      }, 300);
    },
    [stateId]
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectCity(name: string) {
    setQuery(name);
    setIsOpen(false);
    setSuggestions([]);
    setHasFetched(false);
    onCityChange?.(name);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectCity(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const showWarning =
    hasFetched &&
    query.length >= 2 &&
    stateId &&
    !suggestions.some((s) => s.toLowerCase() === query.toLowerCase());

  return (
    <div ref={wrapperRef} className="relative">
      <input type="hidden" name="cityName" value={query} />
      <input
        type="text"
        id="cityName"
        autoComplete="off"
        required={required}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchSuggestions(e.target.value);
          onCityChange?.(e.target.value);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className={`mt-1 ${inputClass}`}
        placeholder={stateId ? "e.g. Austin" : "Select a state first"}
      />

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-stone-300 bg-white shadow-lg dark:border-stone-700 dark:bg-stone-800">
          {suggestions.map((name, i) => (
            <li
              key={name}
              onMouseDown={() => selectCity(name)}
              className={`cursor-pointer px-4 py-2 text-sm ${
                i === activeIndex
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                  : "text-stone-900 hover:bg-stone-50 dark:text-stone-100 dark:hover:bg-stone-700"
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      )}

      {/* No state selected helper */}
      {!stateId && query.length === 0 && (
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          Select a state to get city suggestions
        </p>
      )}

      {/* Amber warning for new city */}
      {showWarning && (
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
          This city doesn&apos;t exist yet and will be created
        </p>
      )}
    </div>
  );
}
