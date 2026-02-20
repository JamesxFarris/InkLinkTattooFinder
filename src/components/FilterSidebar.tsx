"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type FilterOption = { label: string; value: string };

const priceOptions: FilterOption[] = [
  { label: "$ Budget", value: "budget" },
  { label: "$$ Moderate", value: "moderate" },
  { label: "$$$ Premium", value: "premium" },
  { label: "$$$$ Luxury", value: "luxury" },
];

const priceSteps = [
  { label: "Any", value: "" },
  { label: "$", value: "budget" },
  { label: "$$", value: "moderate" },
  { label: "$$$", value: "premium" },
  { label: "$$$$", value: "luxury" },
];

const sortOptions: FilterOption[] = [
  { label: "Relevance", value: "relevance" },
  { label: "Name A-Z", value: "name" },
  { label: "Highest Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

// ── Multi-select Style Dropdown (mobile) ──────────────────

function MobileStyleDropdown({
  categories,
  selectedSlugs,
  onChange,
}: {
  categories: { name: string; slug: string }[];
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (slug: string) => {
    const next = selectedSlugs.includes(slug)
      ? selectedSlugs.filter((s) => s !== slug)
      : [...selectedSlugs, slug];
    onChange(next);
  };

  const label =
    selectedSlugs.length === 0
      ? "All Styles"
      : selectedSlugs.length === 1
        ? categories.find((c) => c.slug === selectedSlugs[0])?.name || "1 style"
        : `${selectedSlugs.length} styles`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-100"
      >
        <span className="truncate">{label}</span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-stone-700 bg-stone-900 py-1 shadow-lg">
          {categories.map((cat) => {
            const checked = selectedSlugs.includes(cat.slug);
            return (
              <label
                key={cat.slug}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-stone-200 hover:bg-stone-800"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(cat.slug)}
                  className="rounded border-stone-600 bg-stone-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                />
                <span>{cat.name}</span>
              </label>
            );
          })}
          {selectedSlugs.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full border-t border-stone-700 px-3 py-2 text-left text-sm text-teal-400 hover:bg-stone-800"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Price Range Slider (mobile) ───────────────────────────

function MobilePriceSlider({
  currentValue,
  onChange,
}: {
  currentValue: string;
  onChange: (value: string | null) => void;
}) {
  const currentIndex = priceSteps.findIndex((s) => s.value === currentValue);
  const sliderValue = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div>
      <input
        type="range"
        min={0}
        max={priceSteps.length - 1}
        step={1}
        value={sliderValue}
        onChange={(e) => {
          const idx = parseInt(e.target.value, 10);
          const step = priceSteps[idx];
          onChange(step.value || null);
        }}
        className="price-slider w-full"
      />
      <div className="mt-1 flex justify-between px-0.5">
        {priceSteps.map((step) => (
          <span
            key={step.value || "any"}
            className="text-xs text-stone-400"
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main FilterSidebar ────────────────────────────────────

export function FilterSidebar({
  categories,
}: {
  categories: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const currentCategory = searchParams.get("category") || "";
  const selectedSlugs = currentCategory ? currentCategory.split(",").filter(Boolean) : [];
  const currentPrice = searchParams.get("price") || "";
  const currentSort = searchParams.get("sort") || "relevance";
  const currentWalkIns = searchParams.get("walkIns") === "true";

  const handleStyleChange = useCallback(
    (slugs: string[]) => {
      updateParam("category", slugs.length > 0 ? slugs.join(",") : null);
    },
    [updateParam]
  );

  return (
    <aside className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Sort By
        </h3>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value === "relevance" ? null : e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Style — Mobile: multi-select dropdown, Desktop: button list */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Style
        </h3>

        {/* Mobile dropdown */}
        <div className="lg:hidden">
          <MobileStyleDropdown
            categories={categories}
            selectedSlugs={selectedSlugs}
            onChange={handleStyleChange}
          />
        </div>

        {/* Desktop button list */}
        <div className="hidden space-y-2 lg:block">
          <button
            onClick={() => updateParam("category", null)}
            className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
              selectedSlugs.length === 0
                ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-950 dark:text-teal-300"
                : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
            }`}
          >
            All Styles
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                const next = selectedSlugs.includes(cat.slug)
                  ? selectedSlugs.filter((s) => s !== cat.slug)
                  : [...selectedSlugs, cat.slug];
                handleStyleChange(next);
              }}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                selectedSlugs.includes(cat.slug)
                  ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-950 dark:text-teal-300"
                  : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range — Mobile: slider, Desktop: button list */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Price Range
        </h3>

        {/* Mobile slider */}
        <div className="lg:hidden">
          <MobilePriceSlider
            currentValue={currentPrice}
            onChange={(val) => updateParam("price", val)}
          />
        </div>

        {/* Desktop button list */}
        <div className="hidden space-y-2 lg:block">
          <button
            onClick={() => updateParam("price", null)}
            className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
              !currentPrice
                ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-950 dark:text-teal-300"
                : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
            }`}
          >
            Any Price
          </button>
          {priceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("price", opt.value)}
              className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                currentPrice === opt.value
                  ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-950 dark:text-teal-300"
                  : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Features
        </h3>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={currentWalkIns}
            onChange={(e) =>
              updateParam("walkIns", e.target.checked ? "true" : null)
            }
            className="rounded border-stone-300 text-teal-500 focus:ring-teal-500"
          />
          <span className="text-sm text-stone-700 dark:text-stone-300">
            Walk-ins Welcome
          </span>
        </label>
      </div>
    </aside>
  );
}
