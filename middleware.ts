// middleware.ts
      import { auth } from "@/lib/auth";
      import { NextResponse } from "next/server";

      export default auth((req) => {
        const { nextUrl } = req;
        const isAuthed = !!req.auth;
        const isAuthPage = nextUrl.pathname.startsWith("/(auth)");

        if (!isAuthed && !isAuthPage && nextUrl.pathname.startsWith("/dashboard")) {
          const signInUrl = new URL("/(auth)/sign-in", nextUrl.origin);
          signInUrl.searchParams.set("callbackUrl", nextUrl.href);
          return NextResponse.redirect(signInUrl);
        }

        if (isAuthed && isAuthPage) {
          return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
        }

        return NextResponse.next();
      });

      export const config = {
        matcher: ["/dashboard/:path*", "/(auth)/:path*"]
      };