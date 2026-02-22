"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

type UpdateResult = { success: boolean; message: string };

export async function updateListing(
  listingId: number,
  _prev: UpdateResult | null,
  formData: FormData
): Promise<UpdateResult> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, message: "You must be signed in." };
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { city: { select: { slug: true, state: { select: { slug: true } } } } },
    });
    if (!listing) {
      return { success: false, message: "Listing not found." };
    }

    const isOwner = listing.ownerId === parseInt(session.user.id);
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return { success: false, message: "You are not authorized to edit this listing." };
    }

    const name = formData.get("name") as string | null;
    const stateId = formData.get("stateId") as string | null;
    const cityName = formData.get("cityName") as string | null;
    const address = formData.get("address") as string | null;
    const zipCode = formData.get("zipCode") as string | null;
    const phone = formData.get("phone") as string | null;
    const email = formData.get("email") as string | null;
    const website = formData.get("website") as string | null;
    const description = formData.get("description") as string | null;
    const type = (formData.get("type") as string) || "shop";
    const priceRange = formData.get("priceRange") as string | null;
    const hourlyRateMinRaw = formData.get("hourlyRateMin") as string | null;
    const hourlyRateMaxRaw = formData.get("hourlyRateMax") as string | null;
    const hourlyRateMin = hourlyRateMinRaw ? parseInt(hourlyRateMinRaw, 10) : null;
    const hourlyRateMax = hourlyRateMaxRaw ? parseInt(hourlyRateMaxRaw, 10) : null;
    const acceptsWalkIns = formData.get("acceptsWalkIns") === "on";
    const piercingServices = formData.get("piercingServices") === "on";
    const categoryIds = formData.getAll("categoryIds").map((id) => parseInt(id as string, 10)).filter((id) => !isNaN(id));
    const photos = formData.getAll("photos").filter((p) => typeof p === "string" && p.length > 0) as string[];
    const artists = formData.getAll("artists").filter((a) => typeof a === "string" && a.length > 0) as string[];

    if (!name?.trim() || !stateId?.trim() || !cityName?.trim()) {
      return { success: false, message: "Shop name, state, and city are required." };
    }

    const parsedStateId = parseInt(stateId, 10);
    if (isNaN(parsedStateId)) {
      return { success: false, message: "Invalid state selection." };
    }

    // Find or create city
    const citySlug = slugify(cityName.trim());
    let city = await prisma.city.findFirst({
      where: { slug: citySlug, stateId: parsedStateId },
    });

    if (!city) {
      city = await prisma.city.create({
        data: {
          name: cityName.trim(),
          slug: citySlug,
          stateId: parsedStateId,
        },
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.listing.update({
        where: { id: listingId },
        data: {
          name: name.trim(),
          // slug is NOT changed (preserves URLs)
          description: description?.trim() || null,
          type: type as "shop" | "artist" | "supplier",
          phone: phone?.trim() || null,
          email: email?.trim() || null,
          website: website?.trim() || null,
          address: address?.trim() || null,
          cityId: city.id,
          stateId: parsedStateId,
          zipCode: zipCode?.trim() || null,
          priceRange: priceRange ? (priceRange as "budget" | "moderate" | "premium" | "luxury") : null,
          hourlyRateMin: hourlyRateMin && !isNaN(hourlyRateMin) ? hourlyRateMin : null,
          hourlyRateMax: hourlyRateMax && !isNaN(hourlyRateMax) ? hourlyRateMax : null,
          acceptsWalkIns,
          piercingServices,
          photos: photos.length > 0 ? photos : Prisma.JsonNull,
          artists: artists.length > 0 ? artists : Prisma.JsonNull,
          // status is NOT changed (edits stay live if active, stay pending if pending)
        },
      });

      // Sync categories
      await tx.listingCategory.deleteMany({ where: { listingId } });
      if (categoryIds.length > 0) {
        await tx.listingCategory.createMany({
          data: categoryIds.map((categoryId) => ({ listingId, categoryId })),
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/tattoo-shops/${listing.city.state.slug}/${listing.city.slug}/${listing.slug}`);

    return {
      success: true,
      message: "Your listing has been updated successfully.",
    };
  } catch (error) {
    console.error("Error updating listing:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
