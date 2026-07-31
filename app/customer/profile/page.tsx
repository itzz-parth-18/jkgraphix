import { updateProfile } from "./actions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


export default async function CustomerProfilePage() {
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
        Profile
      </h1>

      <p className="mt-2 text-[#6E625C]">
        Manage your personal information.
      </p>

      <form
        action={updateProfile}
        className="mt-8 rounded-2xl border border-[#EFE8E2] bg-white p-8"
      >
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              name="name"
              defaultValue={user.name ?? ""}
              className="w-full rounded-xl border border-[#E5DDD6] px-4 py-3 outline-none focus:border-[#C89A84]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              value={user.email}
              readOnly
              className="w-full rounded-xl border border-[#E5DDD6] bg-gray-100 px-4 py-3 text-gray-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <input
              name="phone"
              defaultValue={user.phone ?? ""}
              placeholder="Enter your phone number"
              className="w-full rounded-xl border border-[#E5DDD6] px-4 py-3 outline-none focus:border-[#C89A84]"
            />
          </div>

          {/* Save */}
          <button
            type="submit"
            className="rounded-xl bg-[#1F1816] px-6 py-3 font-medium text-white transition hover:bg-[#322724]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}