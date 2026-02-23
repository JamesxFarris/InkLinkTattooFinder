"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { formLimiter } from "@/lib/rate-limit";
import {
  sanitizeString,
  isValidEmail,
  isValidUrl,
  isValidPhone,
  MAX_BUSINESS_NAME,
  MAX_EMAIL,
  MAX_DESCRIPTION,
  MAX_ADDRESS,
  MAX_URL,
  MAX_PHONE,
  MAX_ZIP,
  MAX_NAME,
} from "@/lib/validation";

type SubmitResult = { success: boolean; message: string };

export async function submitListing(formData: FormData): Promise<SubmitResult> {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, message: "You must be signed in to submit a listing." };
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success: allowed } = formLimiter.check(ip);
    if (!allowed) {
      return { success: false, message: "Too many submissions. Please try again in a minute." };
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
    const acceptsWalkIns = formData.get("acceptsWalkIns") === "on";
    const piercingServices = formData.get("piercingServices") === "on";
    const photos = formData.getAll("photos").filter((p) => typeof p === "string" && p.length > 0) as string[];
    // Parse artists from JSON format
    const artistsJsonRaw = formData.get("artistsJson") as string | null;
    let artists: { name: string; instagramUrl?: string }[] = [];
    if (artistsJsonRaw) {
      try {
        const parsed = JSON.parse(artistsJsonRaw);
        if (Array.isArray(parsed)) {
          artists = parsed
            .filter((a: unknown) => typeof a === "object" && a !== null && "name" in a && typeof (a as { name: unknown }).name === "string" && (a as { name: string }).name.trim().length > 0)
            .map((a: { name: string; instagramUrl?: string }) => ({
              name: a.name.trim(),
              ...(a.instagramUrl?.trim() ? { instagramUrl: a.instagramUrl.trim() } : {}),
            }));
        }
      } catch {
        // ignore invalid JSON
      }
    }

    // Validate required fields
    if (!name || !stateId || !cityName) {
      return { success: false, message: "Shop name, state, and city are required." };
    }

    if (email && !isValidEmail(email)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    if (phone && !isValidPhone(phone)) {
      return { success: false, message: "Please enter a valid phone number." };
    }

    if (website && !isValidUrl(website)) {
      return { success: false, message: "Please enter a valid website URL (must start with http:// or https://)." };
    }

    if (facebookUrl && !isValidUrl(facebookUrl)) {
      return { success: false, message: "Please enter a valid Facebook URL." };
    }

    if (instagramUrl && !isValidUrl(instagramUrl)) {
      return { success: false, message: "Please enter a valid Instagram URL." };
    }

    const parsedStateId = parseInt(stateId, 10);
    if (isNaN(parsedStateId)) {
      return { success: false, message: "Invalid state selection." };
    }

    // Find or create city
    const citySlug = slugify(cityName);
    let city = await prisma.city.findFirst({
      where: { slug: citySlug, stateId: parsedStateId },
    });

    if (!city) {
      city = await prisma.city.create({
        data: {
          name: cityName,
          slug: citySlug,
          stateId: parsedStateId,
        },
      });
    }

    // Generate unique slug
    let listingSlug = slugify(name);
    const existing = await prisma.listing.findUnique({
      where: { slug: listingSlug },
    });
    if (existing) {
      listingSlug = `${listingSlug}-${Date.now()}`;
    }

    // Create listing as pending
    await prisma.listing.create({
      data: {
        name,
        slug: listingSlug,
        description: description || null,
        type: type as "shop" | "artist" | "supplier",
        phone: phone || null,
        email: email || null,
        website: website || null,
        facebookUrl: facebookUrl || null,
        instagramUrl: instagramUrl || null,
        address: address || null,
        cityId: city.id,
        stateId: parsedStateId,
        zipCode: zipCode || null,
        acceptsWalkIns,
        piercingServices,
        photos: photos.length > 0 ? photos : Prisma.JsonNull,
        artists: artists.length > 0 ? (artists as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        status: "pending",
        ownerId: parseInt(session.user.id),
      },
    });

    return {
      success: true,
      message: "Your shop has been submitted successfully! It will appear on the site after review.",
    };
  } catch (error) {
    console.error("Error submitting listing:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
