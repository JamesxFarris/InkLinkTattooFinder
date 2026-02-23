-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('free', 'premium');

-- AlterTable: Add subscription fields to User
ALTER TABLE "User" ADD COLUMN "plan" "UserPlan" NOT NULL DEFAULT 'free';
ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "User" ADD COLUMN "stripeSubscriptionId" TEXT;
ALTER TABLE "User" ADD COLUMN "planExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");

-- AlterTable: Add viewCount to Listing
ALTER TABLE "Listing" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;
