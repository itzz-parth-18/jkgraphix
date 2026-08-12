import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import AccountCard from "@/components/account/AccountCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-espresso">
          My Account
        </h1>

        <p className="mt-2 text-taupe">
          Welcome back, {session.user.name}
        </p>

        <div className="mt-8 rounded-2xl border border-taupe-border bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-espresso">
            Account Details
          </h2>

<div className="mt-8 grid gap-6 md:grid-cols-2">
  <AccountCard
    title="My Orders"
    description="Track your current and previous orders."
  />

  <AccountCard
    title="Saved Addresses"
    description="Manage your shipping addresses."
  />

  <AccountCard
    title="Wishlist"
    description="Your favourite products in one place."
  />

  <AccountCard
    title="Profile Settings"
    description="Update your personal information."
  />

<div className="mt-10">
  <form
    action={async () => {
      "use server";

      await signOut({
        redirectTo: "/login",
      });
    }}
  >
    <button
      type="submit"
      className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
    >
      Logout
    </button>
  </form>
</div>

</div>

          <div className="mt-4 space-y-3">
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>

            <p>
              <strong>Email:</strong> {session.user.email}
            </p>

            <p>
              <strong>Role:</strong> {session.user.role}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}