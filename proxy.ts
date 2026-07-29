import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login", // User ko yahan bhej do agar login nahi hai
  },
});

// Yahan hum batate hain kin-kin raaston (routes) par taala lagana hai
export const config = {
  matcher: [
    "/admin",
    "/admin/dashboard/:path*",
    "/admin/orders/:path*",
    "/admin/products/:path*",
    "/admin/settings/:path*"
  ],
};