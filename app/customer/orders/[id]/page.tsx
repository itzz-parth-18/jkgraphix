import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import OrderTimeline from "@/components/orders/OrderTimeline";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage({
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

  if (!user) {
    redirect("/login");
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: user.id,
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
      <div className="mx-auto max-w-5xl px-6 py-12">

        <h1 className="text-4xl font-serif font-bold text-[#1F1816]">
          Order Details
        </h1>

        <div className="mt-8 rounded-2xl border border-[#EFE8E2] bg-white p-8">

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-[#6E625C]">
                Order Number
              </p>

              <p className="mt-1 font-semibold text-[#1F1816]">
                {order.orderNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#6E625C]">
                Status
              </p>

              <p className="mt-1 font-semibold text-[#1F1816]">
                {order.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#6E625C]">
                Payment
              </p>

              <p className="mt-1 font-semibold text-green-600">
                {order.paymentStatus}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#6E625C]">
                Total
              </p>

              <p className="mt-1 font-semibold text-[#1F1816]">
                ₹{Number(order.totalAmount).toFixed(2)}
              </p>
            </div>

          </div>

<OrderTimeline status={order.status} />

        </div>

        <div className="mt-8 rounded-2xl border border-[#EFE8E2] bg-white p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Products
          </h2>

          <div className="space-y-6">

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5"
              >
                <Image
                  src={
                    item.productImage ??
                    "/placeholder.png"
                  }
                  alt={item.productName}
                  width={90}
                  height={90}
                  className="rounded-xl object-cover"
                />

                <div className="flex-1">

                  <h3 className="font-semibold">
                    {item.productName}
                  </h3>

                  <p className="mt-2 text-sm text-[#6E625C]">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-2 font-semibold">
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