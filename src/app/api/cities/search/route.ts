import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { searchLimiter } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = searchLimiter.check(ip);
  if (!allowed) {
    return NextResponse.json({ cities: [] }, { status: 429 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim()?.slice(0, 100);
  const stateId = request.nextUrl.searchParams.get("stateId");

  if (!q || q.length < 2 || !stateId) {
    return NextResponse.json({ cities: [] });
  }

  const cities = await prisma.city.findMany({
    where: {
      stateId: Number(stateId),
      name: { startsWith: q, mode: "insensitive" },
    },
    select: { name: true },
    orderBy: { population: "desc" },
    take: 10,
  });

  return NextResponse.json({ cities });
}
