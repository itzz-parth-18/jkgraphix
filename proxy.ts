import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname, searchParams } = req.nextUrl;

  // Allow login pages
  if (pathname === "/login" || pathname === "/admin/login") {
    return;
  }

  // Admin protection
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (req.auth.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Customer checkout protection
  if (pathname.startsWith("/checkout")) {
    if (!req.auth) {
      const loginUrl = new URL("/login", req.url);

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname +
          (searchParams.toString()
            ? `?${searchParams.toString()}`
            : "")
      );

      return NextResponse.redirect(loginUrl);
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};