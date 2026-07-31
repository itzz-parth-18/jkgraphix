import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/customer");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      <div className="mx-auto flex max-w-7xl">

        {/* Sidebar */}

        <aside className="hidden min-h-screen w-64 border-r border-[#EFE8E2] bg-white p-6 md:block">
          <h2 className="mb-8 font-serif text-2xl font-bold text-[#1F1816]">
            My Account
          </h2>

          <nav className="space-y-3">

            <Link
              href="/customer"
              className="block rounded-lg px-4 py-2 hover:bg-[#F9F6F2]"
            >
              Dashboard
            </Link>

            <Link
              href="/customer/orders"
              className="block rounded-lg px-4 py-2 hover:bg-[#F9F6F2]"
            >
              My Orders
            </Link>

            <Link
              href="/customer/profile"
              className="block rounded-lg px-4 py-2 hover:bg-[#F9F6F2]"
            >
              Profile
            </Link>

            <Link
              href="/customer/settings"
              className="block rounded-lg px-4 py-2 hover:bg-[#F9F6F2]"
            >
              Settings
            </Link>

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
                className="mt-6 text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </form>

          </nav>
        </aside>

        {/* Main Content */}

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>
    </div>
  );
}