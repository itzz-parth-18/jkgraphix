import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CustomerOrdersPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#F9F6F2]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <h1 className="mb-8 text-4xl font-serif font-bold text-[#1F1816]">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-[#EFE8E2] bg-white p-10 text-center">
            <p className="text-[#6E625C]">
              You haven't placed any orders yet.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-xl bg-[#1F1816] px-6 py-3 text-white"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/customer/orders/${order.id}`}
                className="block rounded-2xl border border-[#EFE8E2] bg-white p-6 transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="font-semibold text-[#1F1816]">
                      {order.orderNumber}
                    </h2>

                    <p className="mt-2 text-sm text-[#6E625C]">
                      {order.items.length} item(s)
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="font-semibold text-[#1F1816]">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </p>

                    <p className="mt-2 text-sm text-[#6E625C]">
                      {order.status}
                    </p>

                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}