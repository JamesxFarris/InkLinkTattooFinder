import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read the session token cookie (next-auth uses this name)
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!token;

  // Redirect auth pages to dashboard if already logged in
  if ((pathname === "/sign-in" || pathname === "/sign-up") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect routes that require authentication
  if (
    (pathname.startsWith("/dashboard") || pathname.startsWith("/list-your-shop")) &&
    !isLoggedIn
  ) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/list-your-shop/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
