"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function approveListing(id: number) {
  await requireAdmin();
  await prisma.listing.update({
    where: { id },
    data: { status: "active" },
  });
  revalidatePath("/dashboard/admin");
}

export async function rejectListing(id: number) {
  await requireAdmin();
  await prisma.listing.update({
    where: { id },
    data: { status: "inactive" },
  });
  revalidatePath("/dashboard/admin");
}

export async function revokeOwnership(id: number) {
  await requireAdmin();
  await prisma.listing.update({
    where: { id },
    data: { ownerId: null },
  });
  // Mark any approved claims for this listing as denied so the slot reopens
  await prisma.claim.updateMany({
    where: { listingId: id, status: "approved" },
    data: { status: "denied", adminNotes: "Ownership revoked by admin" },
  });
  revalidatePath("/dashboard/admin");
}

export async function adminDeleteListing(id: number) {
  await requireAdmin();
  await prisma.listing.delete({ where: { id } });
  revalidatePath("/dashboard/admin");
}

export async function adminDeleteCity(id: number) {
  await requireAdmin();

  // Delete all listings in the city first (and their related data)
  await prisma.listingCategory.deleteMany({
    where: { listing: { cityId: id } },
  });
  await prisma.claim.deleteMany({
    where: { listing: { cityId: id } },
  });
  await prisma.listing.deleteMany({ where: { cityId: id } });
  await prisma.city.delete({ where: { id } });

  revalidatePath("/dashboard/admin/cities");
}
