"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

type RegisterResult = { success: boolean; message: string };

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, message: "An account with this email already exists." };
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      passwordHash: hashed,
      name: name || null,
      role: "owner",
    },
  });

  return { success: true, message: "Account created successfully!" };
}
