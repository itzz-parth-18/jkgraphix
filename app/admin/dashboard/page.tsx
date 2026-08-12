import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const session = await auth();

  // Existing Security Checks
  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // NAYA KAAM: Database se saare required counts parallelly fetch karna
  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalProducts,
    totalCategories,
    totalCustomers
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } })
  ]);

  const stats = [
    { label: "Total Orders", value: totalOrders },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Completed Orders", value: completedOrders },
    { label: "Total Products", value: totalProducts },
    { label: "Total Categories", value: totalCategories },
    { label: "Total Customers", value: totalCustomers },
  ];

  return (
    <div className="p-8">
      {/* Existing Header */}
      <h1 className="mb-4 font-serif text-3xl font-bold text-espresso">
        Workshop Dashboard
      </h1>

      <p className="mb-8 text-taupe">
        Welcome back, {session.user.name}
      </p>

      {/* NAYA KAAM: Milestone 9 Stat Cards (Aapke theme colors ke sath) */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-taupe-border bg-cream-dark p-6 shadow-sm">
            <h2 className="text-sm font-medium uppercase tracking-wider text-taupe">
              {stat.label}
            </h2>
            <p className="mt-2 text-4xl font-bold text-espresso">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Existing User Info Box */}
      <div className="mt-4 space-y-2 rounded-lg border border-taupe-border bg-white p-4">
        <p className="text-espresso">
          <strong>Email:</strong> {session.user.email}
        </p>
        <p className="text-espresso">
          <strong>Role:</strong> {session.user.role}
        </p>
      </div>

      {/* Existing Logout Button */}
      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: "/admin/login",
          });
        }}
      >
        <button
          type="submit"
          className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
        >
          Logout
        </button>
      </form>
    </div>
  );
}