import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow the login page without authentication
  if (pathname === "/admin/login") {
    return;
  }

  const isAdminRoute = pathname.startsWith("/admin");

  if (!req.auth && isAdminRoute) {
    return Response.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};