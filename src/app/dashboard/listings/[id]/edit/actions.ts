"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notifyIndexNow, listingChangedUrls } from "@/lib/indexnow";
import {
  sanitizeString,
  isValidUrl,
  isValidPhone,
  isValidEmail,
  isAllowedImageUrl,
  parseArtistsJson,
  MAX_BUSINESS_NAME,
  MAX_NAME,
  MAX_ADDRESS,
  MAX_ZIP,
  MAX_PHONE,
  MAX_EMAIL,
  MAX_URL,
  MAX_DESCRIPTION,
} from "@/lib/validation";

export async function deleteListing(listingId: number): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session) {
    return { success: false, message: "You must be signed in." };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });
  if (!listing) {
    return { success: false, message: "Listing not found." };
  }

  const isOwner = listing.ownerId === parseInt(session.user.id);
  const isAdmin = session.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return { success: false, message: "You are not authorized to delete this listing." };
  }

  await prisma.listing.delete({ where: { id: listingId } });
  await auditLog({
    userId: parseInt(session.user.id),
    action: "listing.delete",
    targetType: "listing",
    targetId: listingId,
    details: { name: listing.name },
  });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

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

    const name = sanitizeString(formData.get("name") as string | null, MAX_BUSINESS_NAME);
    const stateId = sanitizeString(formData.get("stateId") as string | null, 10);
    const cityName = sanitizeString(formData.get("cityName") as string | null, MAX_NAME);
    const address = sanitizeString(formData.get("address") as string | null, MAX_ADDRESS);
    const zipCode = sanitizeString(formData.get("zipCode") as string | null, MAX_ZIP);
    const phone = sanitizeString(formData.get("phone") as string | null, MAX_PHONE);
    const email = sanitizeString(formData.get("email") as string | null, MAX_EMAIL);
    const website = sanitizeString(formData.get("website") as string | null, MAX_URL);
    const facebookUrl = sanitizeString(formData.get("facebookUrl") as string | null, MAX_URL);
    const instagramUrl = sanitizeString(formData.get("instagramUrl") as string | null, MAX_URL);
    const description = sanitizeString(formData.get("description") as string | null, MAX_DESCRIPTION);
    const type = (formData.get("type") as string) || "shop";
    const hourlyRateMinRaw = formData.get("hourlyRateMin") as string | null;
    const hourlyRateMaxRaw = formData.get("hourlyRateMax") as string | null;
    const hourlyRateMin = hourlyRateMinRaw ? parseInt(hourlyRateMinRaw, 10) : null;
    const hourlyRateMax = hourlyRateMaxRaw ? parseInt(hourlyRateMaxRaw, 10) : null;
    const acceptsWalkIns = formData.get("acceptsWalkIns") === "on";
    const piercingServices = formData.get("piercingServices") === "on";
    const tattooRemoval = formData.get("tattooRemoval") === "on";
    const ctaLabel = sanitizeString(formData.get("ctaLabel") as string | null, MAX_NAME);
    const ctaUrl = sanitizeString(formData.get("ctaUrl") as string | null, MAX_URL);
    const hoursRaw = formData.get("hours") as string | null;
    const categoryIds = formData.getAll("categoryIds").map((id) => parseInt(id as string, 10)).filter((id) => !isNaN(id));
    const photos = formData.getAll("photos").filter((p) => typeof p === "string" && p.length > 0) as string[];
    const artists = parseArtistsJson(formData.get("artistsJson") as string | null);

    // These values are rendered as links/images on public pages — reject anything
    // that isn't a plain http(s) URL (or an allowed image host for photos).
    if (phone && !isValidPhone(phone)) {
      return { success: false, message: "Please enter a valid phone number." };
    }
    if (email && !isValidEmail(email)) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (website && !isValidUrl(website)) {
      return { success: false, message: "Website must be a valid URL starting with http:// or https://." };
    }
    if (facebookUrl && !isValidUrl(facebookUrl)) {
      return { success: false, message: "Facebook link must be a valid URL starting with http:// or https://." };
    }
    if (instagramUrl && !isValidUrl(instagramUrl)) {
      return { success: false, message: "Instagram link must be a valid URL starting with http:// or https://." };
    }
    if (ctaUrl && !isValidUrl(ctaUrl)) {
      return { success: false, message: "Button link must be a valid URL starting with http:// or https://." };
    }
    if (photos.some((p) => !isAllowedImageUrl(p))) {
      return { success: false, message: "One or more photo URLs are invalid. Please re-upload your photos." };
    }

    // Parse hours JSON
    const VALID_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    let parsedHours: Record<string, string> | null = null;
    if (hoursRaw) {
      try {
        const obj = JSON.parse(hoursRaw);
        if (typeof obj === "object" && obj !== null) {
          const valid = Object.keys(obj).every(
            (k) => VALID_DAYS.includes(k) && typeof obj[k] === "string"
          );
          if (valid) parsedHours = obj;
        }
      } catch {
        // ignore invalid JSON — hours will be left unchanged
      }
    }

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
          facebookUrl: facebookUrl?.trim() || null,
          instagramUrl: instagramUrl?.trim() || null,
          address: address?.trim() || null,
          cityId: city.id,
          stateId: parsedStateId,
          zipCode: zipCode?.trim() || null,
          hourlyRateMin: hourlyRateMin && !isNaN(hourlyRateMin) ? hourlyRateMin : null,
          hourlyRateMax: hourlyRateMax && !isNaN(hourlyRateMax) ? hourlyRateMax : null,
          acceptsWalkIns,
          piercingServices,
          tattooRemoval,
          hours: parsedHours ?? Prisma.JsonNull,
          photos: photos.length > 0 ? photos : Prisma.JsonNull,
          artists: artists.length > 0 ? (artists as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
          ctaLabel: ctaLabel?.trim() || null,
          ctaUrl: ctaUrl?.trim() || null,
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

    await auditLog({
      userId: parseInt(session.user.id),
      action: "listing.update",
      targetType: "listing",
      targetId: listingId,
      details: { name: name.trim() },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/tattoo-shops/${listing.city.state.slug}/${listing.city.slug}/${listing.slug}`);

    // Notify search engines about the updated content
    if (listing.status === "active") {
      notifyIndexNow(listingChangedUrls(listing));
    }

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
