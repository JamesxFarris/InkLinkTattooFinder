import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-compatible middleware — does NOT import bcrypt or prisma.
// Auth logic (role checks, redirects) is in authConfig.callbacks.authorized.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
