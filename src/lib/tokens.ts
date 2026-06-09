import crypto from "crypto";
import { prisma } from "./db";
import type { AuthToken, AuthTokenType } from "@prisma/client";

/**
 * Single-use auth tokens for password reset and email verification.
 * Only the SHA-256 hash is stored — the raw token exists only in the emailed link.
 */

const TOKEN_TTL_MS: Record<AuthTokenType, number> = {
  password_reset: 60 * 60 * 1000, // 1 hour
  email_verify: 24 * 60 * 60 * 1000, // 24 hours
};

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Create a token for the user, invalidating any outstanding tokens of the same type. */
export async function createAuthToken(
  userId: number,
  type: AuthTokenType
): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.authToken.deleteMany({ where: { userId, type } });
  await prisma.authToken.create({
    data: {
      userId,
      type,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS[type]),
    },
  });
  return token;
}

/**
 * Look up a valid (unexpired, unused) token without consuming it.
 * Used to render the reset form on GET without letting email prefetchers burn the token.
 */
export async function findValidAuthToken(
  token: string,
  type: AuthTokenType
): Promise<AuthToken | null> {
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const row = await prisma.authToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!row || row.type !== type || row.usedAt || row.expiresAt < new Date()) {
    return null;
  }
  return row;
}

/** Validate and mark a token as used. Returns the token row, or null if invalid. */
export async function consumeAuthToken(
  token: string,
  type: AuthTokenType
): Promise<AuthToken | null> {
  const row = await findValidAuthToken(token, type);
  if (!row) return null;
  await prisma.authToken.update({
    where: { id: row.id },
    data: { usedAt: new Date() },
  });
  return row;
}
