"use client";

import { useActionState, useState, useEffect, useRef, useCallback } from "react";
import { submitListing } from "./actions";
import { Button } from "@/components/ui/Button";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { ArtistEditor } from "@/components/ui/ArtistEditor";
import { CityAutocomplete } from "@/components/ui/CityAutocomplete";
import { inputClass, labelClass } from "@/lib/formClasses";

type State = { id: number; name: string };

type DuplicateMatch = {
  id: number;
  name: string;
  slug: string;
  city: string;
  citySlug: string;
  stateSlug: string;
  stateAbbr: string;
  ownerId: number | null;
  url: string;
};

async function handleSubmit(
  _prev: { success: boolean; message: string } | null,
  formData: FormData
) {
  return submitListing(formData);
}

export function SubmissionForm({ states }: { states: State[] }) {
  const [result, formAction, isPending] = useActionState(handleSubmit, null);
  const [stateId, setStateId] = useState<string | null>(null);
  const [shopName, setShopName] = useState("");
  const [cityName, setCityName] = useState("");
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const checkDuplicates = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!shopName || shopName.length < 3 || !stateId) {
      setDuplicates([]);
      setChecking(false);
      return;
    }

    setChecking(true);
    timerRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          name: shopName,
          stateId,
          ...(cityName ? { cityName } : {}),
        });
        const res = await fetch(`/api/listings/check-duplicate?${params}`);
        if (res.ok) {
          const data = await res.json();
          setDuplicates(data.matches || []);
          setDismissed(false);
        }
      } catch {
        // ignore
      } finally {
        setChecking(false);
      }
    }, 500);
  }, [shopName, stateId, cityName]);

  useEffect(() => {
    checkDuplicates();
  }, [checkDuplicates]);

  const showWarning = duplicates.length > 0 && !dismissed;

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Submission Received
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

      {/* Hidden field: user confirmed no duplicate */}
      {dismissed && (
        <input type="hidden" name="confirmedNoDuplicate" value="1" />
      )}

      {/* Shop Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Shop Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className={`mt-1 ${inputClass}`}
          placeholder="e.g. Iron Rose Tattoo"
        />
      </div>

      {/* State & City */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="stateId" className={labelClass}>
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="stateId"
            name="stateId"
            required
            className={`mt-1 ${inputClass}`}
            onChange={(e) => setStateId(e.target.value || null)}
          >
            <option value="">Select a state</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cityName" className={labelClass}>
            City <span className="text-red-500">*</span>
          </label>
          <CityAutocomplete
            stateId={stateId}
            required
            onCityChange={setCityName}
          />
        </div>
      </div>

      {/* Duplicate Warning Banner */}
      {showWarning && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-4 dark:border-amber-700 dark:bg-amber-900/20">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                We found similar listings that may already exist:
              </p>
              <ul className="mt-2 space-y-2">
                {duplicates.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2 text-sm dark:bg-stone-800/60"
                  >
                    <span className="text-stone-800 dark:text-stone-200">
                      <span className="font-medium">{d.name}</span>
                      <span className="ml-1 text-stone-500 dark:text-stone-400">
                        &mdash; {d.city}, {d.stateAbbr}
                      </span>
                    </span>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 shrink-0 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      {d.ownerId ? "View listing" : "Claim this listing"}
                      <span className="ml-0.5">&rarr;</span>
                    </a>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="mt-3 text-sm font-medium text-amber-700 underline underline-offset-2 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
              >
                This is a different shop &mdash; continue submitting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checking indicator */}
      {checking && shopName.length >= 3 && stateId && (
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Checking for duplicates...
        </p>
      )}

      {/* Address & Zip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClass}>
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className={`mt-1 ${inputClass}`}
            placeholder="123 Main St"
          />
        </div>
        <div>
          <label htmlFor="zipCode" className={labelClass}>
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            className={`mt-1 ${inputClass}`}
            placeholder="78701"
          />
        </div>
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={`mt-1 ${inputClass}`}
            placeholder="(512) 555-0100"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`mt-1 ${inputClass}`}
            placeholder="info@yourshop.com"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className={labelClass}>
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          className={`mt-1 ${inputClass}`}
          placeholder="https://yourshop.com"
        />
      </div>

      {/* Social URLs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="facebookUrl" className={labelClass}>
            Facebook URL
          </label>
          <input
            type="url"
            id="facebookUrl"
            name="facebookUrl"
            className={`mt-1 ${inputClass}`}
            placeholder="https://facebook.com/yourshop"
          />
        </div>
        <div>
          <label htmlFor="instagramUrl" className={labelClass}>
            Instagram URL
          </label>
          <input
            type="url"
            id="instagramUrl"
            name="instagramUrl"
            className={`mt-1 ${inputClass}`}
            placeholder="https://instagram.com/yourshop"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className={`mt-1 ${inputClass}`}
          placeholder="Tell us about your shop, specialties, and what makes you unique..."
        />
      </div>

      {/* Photos */}
      <div>
        <label className={labelClass}>Photos (optional, up to 12)</label>
        <div className="mt-1">
          <PhotoUpload maxPhotos={12} />
        </div>
      </div>

      {/* Artists */}
      <div>
        <label className={labelClass}>Artists</label>
        <div className="mt-1">
          <ArtistEditor showInstagram />
        </div>
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className={labelClass}>
          Type
        </label>
        <select id="type" name="type" className={`mt-1 ${inputClass}`}>
          <option value="shop">Tattoo Shop</option>
          <option value="artist">Independent Artist</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
          <input
            type="checkbox"
            name="acceptsWalkIns"
            className="rounded border-stone-300 text-teal-500 focus:ring-teal-500 dark:border-stone-600"
          />
          Accepts walk-ins
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
          <input
            type="checkbox"
            name="piercingServices"
            className="rounded border-stone-300 text-teal-500 focus:ring-teal-500 dark:border-stone-600"
          />
          Offers piercing services
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
        {isPending ? "Submitting..." : "Submit Your Shop"}
      </Button>
    </form>
  );
}
