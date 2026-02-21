"use client";

import { useActionState } from "react";
import { updateListing } from "./actions";
import { Button } from "@/components/ui/Button";
import { PhotoUpload } from "@/components/ui/PhotoUpload";

type State = { id: number; name: string };

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
  priceRange: string | null;
  acceptsWalkIns: boolean;
  piercingServices: boolean;
  photos: string[] | null;
};

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500";

const labelClass = "block text-sm font-medium text-stone-700 dark:text-stone-300";

export function EditListingForm({
  listing,
  states,
}: {
  listing: ListingData;
  states: State[];
}) {
  const boundUpdate = updateListing.bind(null, listing.id);
  const [result, formAction, isPending] = useActionState(boundUpdate, null);

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

      {/* Type & Price Range */}
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
          <label htmlFor="priceRange" className={labelClass}>
            Price Range
          </label>
          <select
            id="priceRange"
            name="priceRange"
            defaultValue={listing.priceRange ?? ""}
            className={`mt-1 ${inputClass}`}
          >
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
