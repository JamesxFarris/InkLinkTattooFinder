"use client";

import { useActionState } from "react";
import { submitListing } from "./actions";
import { Button } from "@/components/ui/Button";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { ArtistEditor } from "@/components/ui/ArtistEditor";
import { inputClass, labelClass } from "@/lib/formClasses";

type State = { id: number; name: string };

async function handleSubmit(
  _prev: { success: boolean; message: string } | null,
  formData: FormData
) {
  return submitListing(formData);
}

export function SubmissionForm({ states }: { states: State[] }) {
  const [result, formAction, isPending] = useActionState(handleSubmit, null);

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
          <select id="stateId" name="stateId" required className={`mt-1 ${inputClass}`}>
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
          <input
            type="text"
            id="cityName"
            name="cityName"
            required
            className={`mt-1 ${inputClass}`}
            placeholder="e.g. Austin"
          />
        </div>
      </div>

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
        <label className={labelClass}>Photos (optional, up to 6)</label>
        <div className="mt-1">
          <PhotoUpload />
        </div>
      </div>

      {/* Artists */}
      <div>
        <label className={labelClass}>Artists</label>
        <div className="mt-1">
          <ArtistEditor />
        </div>
      </div>

      {/* Type & Price Range */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <div>
          <label htmlFor="priceRange" className={labelClass}>
            Price Range
          </label>
          <select id="priceRange" name="priceRange" className={`mt-1 ${inputClass}`}>
            <option value="">Select...</option>
            <option value="budget">$ — Budget</option>
            <option value="moderate">$$ — Moderate</option>
            <option value="premium">$$$ — Premium</option>
            <option value="luxury">$$$$ — Luxury</option>
          </select>
        </div>
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
