"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const name = formData.get("name")?.toString() ?? "";
  const phone = formData.get("phone")?.toString() ?? "";

  await prisma.user.update({
    where: {
      email: session.user.email!,
    },
    data: {
      name,
      phone,
    },
  });
}