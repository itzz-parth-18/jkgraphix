import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Role } from "@prisma/client";
import Image from "next/image";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminOrderPage({
  params,
}: Props) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user || user.role !== Role.ADMIN) {
    redirect("/");
  }

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F9F6F2]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <h1 className="mb-8 text-4xl font-serif font-bold">
          Order Details
        </h1>

        <div className="rounded-2xl border border-[#EFE8E2] bg-white p-8">

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-[#6E625C]">
                Order Number
              </p>

              <p className="font-semibold">
                {order.orderNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#6E625C]">
                Customer
              </p>

              <p className="font-semibold">
                {order.customerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#6E625C]">
                Payment
              </p>

              <p className="font-semibold">
                {order.paymentStatus}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#6E625C]">
                Status
              </p>

              <p className="font-semibold">
                {order.status}
              </p>
            </div>

          </div>

        </div>

<OrderStatusSelect
  orderId={order.id}
  currentStatus={order.status}
/>

        <div className="mt-8 rounded-2xl border border-[#EFE8E2] bg-white p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Products
          </h2>

          <div className="space-y-6">

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4"
              >
                <Image
                  src={item.productImage ?? "/placeholder.png"}
                  alt={item.productName}
                  width={90}
                  height={90}
                  className="rounded-xl object-cover"
                />

                <div>

                  <h3 className="font-semibold">
                    {item.productName}
                  </h3>

                  <p className="text-[#6E625C]">
                    Qty: {item.quantity}
                  </p>

                  <p className="font-semibold">
                    ₹{Number(item.unitPrice).toFixed(2)}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  );
}