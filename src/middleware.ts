import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight Edge-compatible middleware.
 * Only checks for the session cookie — no NextAuth import needed.
 * Actual session validation + role checks happen in page components via auth().
 */
export function middleware(req: NextRequest) {
  const hasSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token");

  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
