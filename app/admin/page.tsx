import { redirect } from "next/navigation";

export default function AdminIndex() {
  // TODO: Replace with real authentication check (NextAuth/Clerk)
  const isLoggedIn = false; 

  if (!isLoggedIn) {
    redirect("/admin/login");
  } else {
    redirect("/admin/dashboard");
  }
}