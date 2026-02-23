import { prisma } from "@/lib/db";

export const FREE_PHOTO_LIMIT = 6;
export const PREMIUM_PHOTO_LIMIT = 12;

export type PlanInfo = {
  plan: "free" | "premium";
  isPremium: boolean;
  planExpiresAt: Date | null;
  photoLimit: number;
};

export async function getUserPlanInfo(userId: number): Promise<PlanInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiresAt: true },
  });

  if (!user) {
    return { plan: "free", isPremium: false, planExpiresAt: null, photoLimit: FREE_PHOTO_LIMIT };
  }

  const isPremium =
    user.plan === "premium" &&
    (user.planExpiresAt === null || user.planExpiresAt > new Date());

  return {
    plan: user.plan,
    isPremium,
    planExpiresAt: user.planExpiresAt,
    photoLimit: isPremium ? PREMIUM_PHOTO_LIMIT : FREE_PHOTO_LIMIT,
  };
}
