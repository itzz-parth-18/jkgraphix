import { auth } from "@/lib/auth";

export default async function CustomerDashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1F1816]">
        Welcome back,
      </h1>

      <p className="mt-2 text-lg text-[#6E625C]">
        {session?.user?.name}
      </p>

      <p className="text-sm text-[#8A7D76]">
        {session?.user?.email}
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-[#EFE8E2] bg-white p-6">
          <h2 className="font-semibold">My Orders</h2>
          <p className="mt-2 text-sm text-[#6E625C]">
            View your previous orders.
          </p>
        </div>

        <div className="rounded-xl border border-[#EFE8E2] bg-white p-6">
          <h2 className="font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-[#6E625C]">
            Manage your personal information.
          </p>
        </div>

        <div className="rounded-xl border border-[#EFE8E2] bg-white p-6">
          <h2 className="font-semibold">Settings</h2>
          <p className="mt-2 text-sm text-[#6E625C]">
            Account settings and logout.
          </p>
        </div>
      </div>
    </div>
  );
}