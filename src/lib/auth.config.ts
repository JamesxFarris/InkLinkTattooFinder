import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — used by middleware.
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      if (pathname.startsWith("/dashboard")) {
        return isLoggedIn;
      }

      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        if ((auth.user as { role?: string })?.role !== "admin") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
