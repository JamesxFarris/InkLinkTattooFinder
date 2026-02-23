"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type ChangePasswordResult = { success: boolean; message: string };

export async function changePassword(
  _prev: ChangePasswordResult | null,
  formData: FormData
): Promise<ChangePasswordResult> {
  const session = await auth();
  if (!session) {
    return { success: false, message: "You must be logged in." };
  }

  const currentPassword = (formData.get("currentPassword") as string | null)?.trim();
  const newPassword = (formData.get("newPassword") as string | null)?.trim();
  const confirmPassword = (formData.get("confirmPassword") as string | null)?.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Please fill in all fields." };
  }

  if (newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match." };
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id, 10) },
    select: { passwordHash: true },
  });

  if (!user) {
    return { success: false, message: "User not found." };
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, message: "Current password is incorrect." };
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: parseInt(session.user.id, 10) },
    data: { passwordHash: newHash },
  });

  return { success: true, message: "Password changed successfully." };
}
