"use client";

import { useActionState, useState } from "react";
import { updateListing } from "./actions";
import { Button } from "@/components/ui/Button";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { ArtistEditor } from "@/components/ui/ArtistEditor";
import { inputClass, labelClass } from "@/lib/formClasses";

type State = { id: number; name: string };
type CategoryOption = { id: number; name: string; slug: string };

type ListingData = {
  id: number;
  name: string;
  description: string | null;
  type: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  stateId: number;
  cityName: string;
  zipCode: string | null;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  categoryIds: number[];
  acceptsWalkIns: boolean;
  piercingServices: boolean;
  photos: string[] | null;
  artists: string[];
};

export function EditListingForm({
  listing,
  states,
  categories,
}: {
  listing: ListingData;
  states: State[];
  categories: CategoryOption[];
}) {
  const boundUpdate = updateListing.bind(null, listing.id);
  const [result, formAction, isPending] = useActionState(boundUpdate, null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(listing.categoryIds);

  return (
    <form action={formAction} className="space-y-6">
      {result && !result.success && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {result.message}
        </div>
      )}

      {result?.success && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400">
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
          defaultValue={listing.name}
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
            defaultValue={listing.stateId}
            className={`mt-1 ${inputClass}`}
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
          <input
            type="text"
            id="cityName"
            name="cityName"
            required
            defaultValue={listing.cityName}
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
            defaultValue={listing.address ?? ""}
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
            defaultValue={listing.zipCode ?? ""}
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
            defaultValue={listing.phone ?? ""}
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
            defaultValue={listing.email ?? ""}
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
          defaultValue={listing.website ?? ""}
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
          defaultValue={listing.description ?? ""}
          className={`mt-1 ${inputClass}`}
          placeholder="Tell us about your shop, specialties, and what makes you unique..."
        />
      </div>

      {/* Photos */}
      <div>
        <label className={labelClass}>Photos (optional, up to 6)</label>
        <div className="mt-1">
          <PhotoUpload existingPhotos={listing.photos ?? []} />
        </div>
      </div>

      {/* Artists */}
      <div>
        <label className={labelClass}>Artists</label>
        <div className="mt-1">
          <ArtistEditor existing={listing.artists} />
        </div>
      </div>

      {/* Type & Hourly Rate */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className={labelClass}>
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={listing.type}
            className={`mt-1 ${inputClass}`}
          >
            <option value="shop">Tattoo Shop</option>
            <option value="artist">Independent Artist</option>
            <option value="supplier">Supplier</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Hourly Rate ($/hr)</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              name="hourlyRateMin"
              placeholder="Min"
              min={0}
              max={9999}
              defaultValue={listing.hourlyRateMin ?? ""}
              className={inputClass}
            />
            <span className="text-stone-400">–</span>
            <input
              type="number"
              name="hourlyRateMax"
              placeholder="Max"
              min={0}
              max={9999}
              defaultValue={listing.hourlyRateMax ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Styles / Categories */}
      <div>
        <label className={labelClass}>Styles Offered</label>
        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
          Select the tattoo styles this shop specializes in.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const selected = selectedCategoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setSelectedCategoryIds((prev) =>
                    selected ? prev.filter((id) => id !== cat.id) : [...prev, cat.id]
                  )
                }
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  selected
                    ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-stone-600"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
        {selectedCategoryIds.map((id) => (
          <input key={id} type="hidden" name="categoryIds" value={id} />
        ))}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
          <input
            type="checkbox"
            name="acceptsWalkIns"
            defaultChecked={listing.acceptsWalkIns}
            className="rounded border-stone-300 text-teal-500 focus:ring-teal-500 dark:border-stone-600"
          />
          Accepts walk-ins
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
          <input
            type="checkbox"
            name="piercingServices"
            defaultChecked={listing.piercingServices}
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
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
