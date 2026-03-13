-- AlterTable
ALTER TABLE "Listing" ADD COLUMN "outreachOptOut" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Listing" ADD COLUMN "outreachSentAt" TIMESTAMP(3);
