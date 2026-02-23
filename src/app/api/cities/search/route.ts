import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
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
