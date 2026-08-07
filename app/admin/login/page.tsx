import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (user?.role === "ADMIN") {
      redirect("/admin/dashboard");
    }

    redirect("/");
  }

  return <AdminLoginForm />;
}