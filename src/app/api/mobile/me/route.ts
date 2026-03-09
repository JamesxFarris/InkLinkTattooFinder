import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-jwt";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const tokenUser = await getMobileUser(request);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(tokenUser.sub, 10) },
    select: { id: true, email: true, name: true, role: true, plan: true, planExpiresAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
