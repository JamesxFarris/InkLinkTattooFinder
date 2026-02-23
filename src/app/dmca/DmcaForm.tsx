"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { submitDmca } from "./actions";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass } from "@/lib/formClasses";

type ListingResult = {
  id: string;
  name: string;
  city: string;
  state: string;
};

export function DmcaForm() {
  const [result, formAction, isPending] = useActionState(submitDmca, null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ListingResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/listings/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSuggestions(data.listings ?? []);
        setShowDropdown(true);
      } catch {
        // aborted or network error
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (result?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-8 w-8 text-teal-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Request Submitted
        </p>
        <p className="max-w-md text-sm text-stone-600 dark:text-stone-400">
          {result.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {result && !result.success && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {result.message}
        </div>
      )}

      {/* Your Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className={`mt-1 ${inputClass}`}
          placeholder="Your full name"
        />
      </div>

      {/* Your Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Your Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={`mt-1 ${inputClass}`}
          placeholder="you@example.com"
        />
      </div>

      {/* Business Name with autocomplete */}
      <div ref={dropdownRef} className="relative">
        <label htmlFor="businessName" className={labelClass}>
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          required
          className={`mt-1 ${inputClass}`}
          placeholder="Search for your shop or type a name"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedListingId("");
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          autoComplete="off"
        />
        <input type="hidden" name="listingId" value={selectedListingId} />
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-stone-300 bg-white shadow-lg dark:border-stone-700 dark:bg-stone-800">
            {suggestions.map((listing) => (
              <li key={listing.id}>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-stone-900 hover:bg-teal-50 dark:text-stone-100 dark:hover:bg-stone-700"
                  onClick={() => {
                    setQuery(listing.name);
                    setSelectedListingId(listing.id);
                    setShowDropdown(false);
                  }}
                >
                  {listing.name}{" "}
                  <span className="text-stone-500 dark:text-stone-400">
                    — {listing.city}, {listing.state}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Request Type */}
      <div>
        <label htmlFor="requestType" className={labelClass}>
          Request Type <span className="text-red-500">*</span>
        </label>
        <select
          id="requestType"
          name="requestType"
          required
          className={`mt-1 ${inputClass}`}
        >
          <option value="Remove my photos">Remove my photos</option>
          <option value="Remove my listing entirely">
            Remove my listing entirely
          </option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Details */}
      <div>
        <label htmlFor="details" className={labelClass}>
          Details <span className="text-red-500">*</span>
        </label>
        <textarea
          id="details"
          name="details"
          rows={5}
          required
          className={`mt-1 ${inputClass}`}
          placeholder="Describe which content you want removed and provide any proof of ownership (e.g., link to your Instagram, business license number)."
        />
      </div>

      {/* Sworn Statement */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="sworn"
          name="sworn"
          required
          className="mt-1 h-4 w-4 rounded border-stone-300 text-teal-500 focus:ring-teal-500 dark:border-stone-600 dark:bg-stone-800"
        />
        <label
          htmlFor="sworn"
          className="text-sm text-stone-600 dark:text-stone-400"
        >
          I swear under penalty of perjury that I am the owner or authorized
          representative of the business identified above, and the information in
          this notice is accurate.{" "}
          <span className="text-red-500">*</span>
        </label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Takedown Request"}
      </Button>
    </form>
  );
}
