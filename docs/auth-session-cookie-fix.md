# Fix: Auth.js Session Cookie Not Detected in Middleware

## Problem

If you are always redirected to `/sign-in` even after logging in, check your session cookie name.  
Auth.js (NextAuth.js v5+) uses `authjs.session-token` by default, but older middleware or docs may check for `next-auth.session-token` or `__Secure-next-auth.session-token`.

**Symptoms:**
- Only these cookies are present:  
  - `authjs.session-token`
  - `authjs.csrf-token`
  - `authjs.callback-url`
- Middleware only checks for `next-auth.session-token` and/or `__Secure-next-auth.session-token`
- Authenticated users are still redirected to `/sign-in`

## Solution

Update your `middleware.ts` to check for all possible session cookie names, including `authjs.session-token`:

```typescript
// middleware.ts
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