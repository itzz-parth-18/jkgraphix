import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CustomerSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-[#1F1816]">
        Settings
      </h1>

      <p className="mt-2 text-[#6E625C]">
        Manage your account settings.
      </p>

      <div className="mt-8 space-y-8 rounded-2xl border border-[#EFE8E2] bg-white p-8">

        <div>
          <h2 className="text-lg font-semibold text-[#1F1816]">
            Account Information
          </h2>

          <div className="mt-4 space-y-2 text-[#6E625C]">
            <p>
              <span className="font-medium text-[#1F1816]">Name:</span>{" "}
              {user.name}
            </p>

            <p>
              <span className="font-medium text-[#1F1816]">Email:</span>{" "}
              {user.email}
            </p>

            <p>
              <span className="font-medium text-[#1F1816]">Phone:</span>{" "}
              {user.phone || "Not provided"}
            </p>
          </div>
        </div>

        <div className="border-t border-[#EFE8E2] pt-6">
          <h2 className="text-lg font-semibold text-[#1F1816]">
            Future Settings
          </h2>

          <p className="mt-2 text-[#6E625C]">
            More account settings will be available in future updates.
          </p>
        </div>

        <div className="border-t border-[#EFE8E2] pt-6">
          <form
            action={async () => {
              "use server";

              await signOut({
                redirectTo: "/",
              });
            }}
          >
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}