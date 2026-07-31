import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CustomerOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-[#1F1816]">
        My Orders
      </h1>

      <p className="mt-2 text-[#6E625C]">
        View your previous purchases.
      </p>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[#EFE8E2] bg-white p-12 text-center">
          <h2 className="text-xl font-semibold text-[#1F1816]">
            No orders yet
          </h2>

          <p className="mt-3 text-[#6E625C]">
            You haven't placed any orders yet.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block rounded-xl bg-[#1F1816] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#322724]"
          >
            Browse Collection
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-[#EFE8E2] bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {order.orderNumber}
                  </p>

                  <p className="mt-1 text-sm text-[#6E625C]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </p>

                  <p className="text-sm text-[#6E625C]">
                    {order.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}