import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "owner" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "owner" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "owner" | "admin";
  }
}
