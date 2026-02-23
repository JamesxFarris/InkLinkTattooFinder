import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function auditLog(params: {
  userId?: number | null;
  action: string;
  targetType?: string;
  targetId?: number;
  details?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        targetType: params.targetType ?? null,
        targetId: params.targetId ?? null,
        details: params.details
          ? (params.details as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}
