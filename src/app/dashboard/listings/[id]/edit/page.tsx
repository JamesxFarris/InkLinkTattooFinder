import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getListingById, getAllStates, getAllCategories } from "@/lib/queries";
import { EditListingForm } from "./EditListingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Listing",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) notFound();

  const listing = await getListingById(listingId);
  if (!listing) notFound();

  const isOwner = listing.ownerId === parseInt(session.user.id);
  const isAdmin = session.user.role === "admin";
  if (!isOwner && !isAdmin) redirect("/dashboard");

  const [allStates, allCategories] = await Promise.all([
    getAllStates(),
    getAllCategories(),
  ]);
  const states = allStates.map((s) => ({ id: s.id, name: s.name }));
  const categories = allCategories
    .filter((c) => c.type === "shop")
    .map((c) => ({ id: c.id, name: c.name, slug: c.slug }));

  const listingData = {
    id: listing.id,
    name: listing.name,
    description: listing.description,
    type: listing.type,
    phone: listing.phone,
    email: listing.email,
    website: listing.website,
    address: listing.address,
    stateId: listing.stateId,
    cityName: listing.city.name,
    zipCode: listing.zipCode,
    priceRange: listing.priceRange,
    hourlyRateMin: listing.hourlyRateMin,
    hourlyRateMax: listing.hourlyRateMax,
    acceptsWalkIns: listing.acceptsWalkIns,
    piercingServices: listing.piercingServices,
    categoryIds: listing.categories.map((c) => c.category.id),
    photos: listing.photos as string[] | null,
    artists: Array.isArray(listing.artists) ? (listing.artists as string[]) : [],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Edit Listing
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Update details for <strong>{listing.name}</strong>
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <EditListingForm listing={listingData} states={states} categories={categories} />
      </div>
    </div>
  );
}
