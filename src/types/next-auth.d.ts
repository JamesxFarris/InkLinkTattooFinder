import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "owner" | "admin";
      plan: "free" | "premium";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "owner" | "admin";
    plan: "free" | "premium";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "owner" | "admin";
    plan: "free" | "premium";
  }
}
