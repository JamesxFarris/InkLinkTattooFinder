"use server";

import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

type SubmitResult = { success: boolean; message: string };

export async function submitListing(formData: FormData): Promise<SubmitResult> {
  try {
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
    const acceptsWalkIns = formData.get("acceptsWalkIns") === "on";
    const piercingServices = formData.get("piercingServices") === "on";

    // Validate required fields
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

    // Generate unique slug
    let listingSlug = slugify(name.trim());
    const existing = await prisma.listing.findUnique({
      where: { slug: listingSlug },
    });
    if (existing) {
      listingSlug = `${listingSlug}-${Date.now()}`;
    }

    // Create listing as pending
    await prisma.listing.create({
      data: {
        name: name.trim(),
        slug: listingSlug,
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
        acceptsWalkIns,
        piercingServices,
        status: "pending",
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
