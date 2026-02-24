"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { enrichListingFromGoogle } from "@/lib/google-places";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function approveListing(id: number) {
  const session = await requireAdmin();
  const listing = await prisma.listing.update({
    where: { id },
    data: { status: "active" },
    select: {
      id: true,
      name: true,
      googlePlaceId: true,
      city: { select: { name: true } },
      state: { select: { abbreviation: true } },
    },
  });
  await auditLog({
    userId: parseInt(session.user.id),
    action: "listing.approve",
    targetType: "listing",
    targetId: id,
  });

  // Fire-and-forget: enrich with Google Places data if missing
  if (!listing.googlePlaceId) {
    enrichListingFromGoogle(
      listing.id,
      listing.name,
      listing.city.name,
      listing.state.abbreviation
    );
  }

  revalidatePath("/dashboard/admin");
}

export async function rejectListing(id: number) {
  const session = await requireAdmin();
  await prisma.listing.update({
    where: { id },
    data: { status: "inactive" },
  });
  await auditLog({
    userId: parseInt(session.user.id),
    action: "listing.reject",
    targetType: "listing",
    targetId: id,
  });
  revalidatePath("/dashboard/admin");
}

export async function revokeOwnership(id: number) {
  const session = await requireAdmin();
  await prisma.listing.update({
    where: { id },
    data: { ownerId: null },
  });
  // Mark any approved claims for this listing as denied so the slot reopens
  await prisma.claim.updateMany({
    where: { listingId: id, status: "approved" },
    data: { status: "denied", adminNotes: "Ownership revoked by admin" },
  });
  await auditLog({
    userId: parseInt(session.user.id),
    action: "listing.revokeOwnership",
    targetType: "listing",
    targetId: id,
  });
  revalidatePath("/dashboard/admin");
}

export async function adminDeleteListing(id: number) {
  const session = await requireAdmin();
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { name: true },
  });
  await prisma.listing.delete({ where: { id } });
  await auditLog({
    userId: parseInt(session.user.id),
    action: "listing.delete",
    targetType: "listing",
    targetId: id,
    details: { name: listing?.name },
  });
  revalidatePath("/dashboard/admin");
}

export async function adminDeleteClaim(id: number) {
  const session = await requireAdmin();
  await prisma.claim.delete({ where: { id } });
  await auditLog({
    userId: parseInt(session.user.id),
    action: "claim.delete",
    targetType: "claim",
    targetId: id,
  });
  revalidatePath("/dashboard/admin/claims");
}

export async function changeUserRole(id: number, role: "owner" | "admin") {
  const session = await requireAdmin();
  if (parseInt(session.user.id) === id) {
    throw new Error("Cannot change your own role");
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: { role: true },
  });
  await prisma.user.update({
    where: { id },
    data: { role },
  });
  await auditLog({
    userId: parseInt(session.user.id),
    action: "user.changeRole",
    targetType: "user",
    targetId: id,
    details: { oldRole: user?.role, newRole: role },
  });
  revalidatePath("/dashboard/admin/users");
}

export async function adminDeleteUser(id: number) {
  const session = await requireAdmin();
  if (parseInt(session.user.id) === id) {
    throw new Error("Cannot delete your own account");
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: { email: true },
  });
  await prisma.user.delete({ where: { id } });
  await auditLog({
    userId: parseInt(session.user.id),
    action: "user.delete",
    targetType: "user",
    targetId: id,
    details: { email: user?.email },
  });
  revalidatePath("/dashboard/admin/users");
}

export async function adminDeleteCity(id: number) {
  const session = await requireAdmin();

  const city = await prisma.city.findUnique({
    where: { id },
    select: { name: true, _count: { select: { listings: true } } },
  });

  // Delete all listings in the city first (and their related data)
  await prisma.listingCategory.deleteMany({
    where: { listing: { cityId: id } },
  });
  await prisma.claim.deleteMany({
    where: { listing: { cityId: id } },
  });
  await prisma.listing.deleteMany({ where: { cityId: id } });
  await prisma.city.delete({ where: { id } });

  await auditLog({
    userId: parseInt(session.user.id),
    action: "city.delete",
    targetType: "city",
    targetId: id,
    details: { name: city?.name, listingCount: city?._count.listings },
  });

  revalidatePath("/dashboard/admin/cities");
}
