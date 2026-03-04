import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

// Emails that are always admin, regardless of how they registered.
// Set ADMIN_EMAILS as a comma-separated list in your environment variables.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValid) return null;

        // Auto-promote hardcoded admin emails on login
        const isHardcodedAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
        if (isHardcodedAdmin && user.role !== "admin") {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "admin" },
          });
          user.role = "admin";
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
        };
        } catch (err) {
          console.error("authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.plan = user.plan;
      } else if (token.id) {
        // Refresh role + plan from DB so changes take effect immediately
        const dbUser = await prisma.user.findUnique({
          where: { id: parseInt(token.id as string, 10) },
          select: { role: true, plan: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.plan = dbUser.plan;
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "owner" | "admin";
      session.user.plan = token.plan as "free" | "premium";
      return session;
    },
  },
});
