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

    const isDeletedByAdmin = Boolean(order.adminDeletedAt);

  return (
    <main className="min-h-screen bg-[#F9F6F2]">
      <div className="mx-auto max-w-5xl px-6 py-12">

        <h1 className="text-4xl font-serif font-bold text-[#1F1816]">
          Order Details
        </h1>

        {/* Order Summary */}
        <div
          className={`mt-8 rounded-2xl border p-8 shadow-sm ${
            isDeletedByAdmin
              ? "border-[#E8DDD7] bg-[#F5F1EE]"
              : "border-[#EFE8E2] bg-white"
          }`}
        >
          {isDeletedByAdmin && (
            <div className="mb-6">
              <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                Deleted by Admin
              </span>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className={isDeletedByAdmin ? "opacity-55" : ""}>
              <p className="text-sm text-[#6E625C]">
                Order Number
              </p>

              <p
                className={`mt-1 font-semibold text-[#1F1816] ${
                  isDeletedByAdmin
                    ? "line-through decoration-[#8C7C74]"
                    : ""
                }`}
              >
                {order.orderNumber}
              </p>
            </div>

            <div className={isDeletedByAdmin ? "opacity-55" : ""}>
  <p className="text-sm text-[#6E625C]">
    Status
  </p>

  {isDeletedByAdmin ? (
    <p className="mt-1 font-semibold text-red-500 line-through decoration-red-400">
      {order.status}
    </p>
  ) : (
    <p className="mt-1 font-semibold text-[#1F1816]">
      {order.status}
    </p>
  )}
</div>

            <div className={isDeletedByAdmin ? "opacity-55" : ""}>
              <p className="text-sm text-[#6E625C]">
                Payment
              </p>

              <p className="mt-1 font-semibold text-emerald-600">
                {order.paymentStatus}
              </p>
            </div>

            <div className={isDeletedByAdmin ? "opacity-55" : ""}>
              <p className="text-sm text-[#6E625C]">
                Total
              </p>

              <p className="mt-1 font-semibold text-[#1F1816]">
                ₹{Number(order.totalAmount).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-[#EFE8E2] pt-6">
  {isDeletedByAdmin ? (
    <div className="py-4">
      <h2 className="text-2xl font-serif font-semibold text-[#8C7C74]">
        Order Progress
      </h2>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-red-400" />

        <p className="font-semibold text-red-500 line-through decoration-red-400">
          {order.status}
        </p>

        <span className="text-sm font-medium text-red-500">
          — DELETED BY ADMIN
        </span>
      </div>
    </div>
  ) : (
    <OrderTimeline status={order.status} />
  )}
</div>
        </div>

        {/* Products & Customization */}
        <div
          className={`mt-8 rounded-2xl border p-8 shadow-sm ${
            isDeletedByAdmin
              ? "border-[#E8DDD7] bg-[#F5F1EE]"
              : "border-[#EFE8E2] bg-white"
          }`}
        >
          <h2 className="mb-6 text-2xl font-serif font-semibold text-[#1F1816]">
            Products & Customization
          </h2>

          <div className="space-y-6 divide-y divide-[#EFE8E2]">
            {order.items.map((item: any) => {
              const customData = item.customizations || {};
              const photoUrl =
                customData.customPhotoUrl ||
                customData.photo_upload;
              const customName =
                customData.customName ||
                customData.name;
              const customMessage =
                customData.customMessage ||
                customData.message;
              const customNotes =
                customData.customNotes ||
                customData.notes;
              const deliveryDate =
                customData.deliveryDate;

              return (
                <div
                  key={item.id}
                  className={`pt-6 first:pt-0 flex flex-col md:flex-row gap-6 ${
                    isDeletedByAdmin ? "opacity-55" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <Image
                      src={
                        item.productImage ??
                        "/placeholder.png"
                      }
                      alt={item.productName}
                      width={100}
                      height={100}
                      className="rounded-xl object-cover border border-[#EFE8E2]"
                    />

                    <div>
                      <h3 className="font-semibold text-lg text-[#1F1816]">
                        {item.productName}
                      </h3>

                      <p className="mt-1 text-sm text-[#6E625C]">
                        Quantity:{" "}
                        <span className="font-medium text-[#1F1816]">
                          {item.quantity}
                        </span>
                      </p>

                      <p className="mt-1 font-semibold text-[#1F1816]">
                        ₹{Number(item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 bg-[#F9F6F2] p-4 rounded-xl border border-[#EFE8E2] text-sm space-y-2">
                    <p className="font-semibold text-[#1F1816] text-xs uppercase tracking-wider mb-2">
                      Customization Details:
                    </p>

                    {photoUrl && (
                      <div className="flex items-center gap-3">
                        <span className="text-[#6E625C]">
                          Uploaded Photo:
                        </span>

                        <a
                          href={photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={photoUrl}
                            alt="Custom Upload"
                            className="w-12 h-12 rounded-lg object-cover border border-[#EFE8E2] hover:opacity-80 transition"
                          />
                        </a>
                      </div>
                    )}

                    {customName && (
                      <p>
                        <span className="text-[#6E625C]">
                          Custom Name:
                        </span>{" "}
                        <span className="font-medium text-[#1F1816]">
                          {customName}
                        </span>
                      </p>
                    )}

                    {customMessage && (
                      <p>
                        <span className="text-[#6E625C]">
                          Custom Message:
                        </span>{" "}
                        <span className="font-medium text-[#1F1816]">
                          {customMessage}
                        </span>
                      </p>
                    )}

                    {customNotes && (
                      <p>
                        <span className="text-[#6E625C]">
                          Notes:
                        </span>{" "}
                        <span className="font-medium text-[#1F1816]">
                          {customNotes}
                        </span>
                      </p>
                    )}

                    {deliveryDate && (
                      <p>
                        <span className="text-[#6E625C]">
                          Delivery Date:
                        </span>{" "}
                        <span className="font-medium text-[#1F1816]">
                          {new Date(
                            deliveryDate
                          ).toLocaleDateString()}
                        </span>
                      </p>
                    )}

                    {!photoUrl &&
                      !customName &&
                      !customMessage &&
                      !customNotes &&
                      !deliveryDate && (
                        <p className="text-xs text-[#8C7A72] italic">
                          No custom options provided for this item.
                        </p>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}