import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Skip middleware for public/auth routes
  if (
    nextUrl.pathname.startsWith("/api/") ||
    nextUrl.pathname.startsWith("/_next/") ||
    nextUrl.pathname.includes("favicon") ||
    nextUrl.pathname === "/sign-in" ||
    nextUrl.pathname === "/sign-up" ||
    nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Check for all possible session cookie names
  const sessionCookie =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token") ||
    req.cookies.get("authjs.session-token");

  if (!sessionCookie?.value && nextUrl.pathname.startsWith("/dashboard")) {
    const signInUrl = new URL("/sign-in", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};