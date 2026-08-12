import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CustomerLoginForm from "@/components/auth/CustomerLoginForm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
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

  return <CustomerLoginForm />;
}