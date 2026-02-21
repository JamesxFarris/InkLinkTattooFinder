import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — used by middleware AND spread into auth.ts.
 * NO Node.js-only imports (no bcrypt, no prisma).
 * Providers are added in auth.ts for server-side use.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "owner" | "admin";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
