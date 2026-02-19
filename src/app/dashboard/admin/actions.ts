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

export async function adminDeleteListing(id: number) {
  await requireAdmin();
  await prisma.listing.delete({ where: { id } });
  revalidatePath("/dashboard/admin");
}
