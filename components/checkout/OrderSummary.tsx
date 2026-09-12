import PaymentButton from "@/components/checkout/PaymentButton";

type Props = {
  cart: any;
  shippingSaved: boolean;
  shippingCost: number | null;
};

export default function OrderSummary({
  cart,
  shippingSaved,
  shippingCost,
}: Props) {
  const subtotal =
    cart?.items?.reduce(
      (sum: number, item: any) =>
        sum + Number(item.product.basePrice) * item.quantity,
      0
    ) ?? 0;

  const currentShippingCost =
    shippingSaved && shippingCost !== null
      ? shippingCost
      : 0;

  const grandTotal =
    subtotal + currentShippingCost;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="border-b border-[#EFE8E2] pb-3 sm:pb-4">
        <h2 className="text-xl font-semibold text-[#1F1816] sm:text-2xl">
          Order Summary
        </h2>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[#1F1816] sm:text-lg">
          Products
        </h3>

        <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
          {cart?.items?.map((item: any) => (
            <div
              key={item.id}
              className="flex min-w-0 items-start gap-3 rounded-xl border border-[#EFE8E2] p-3 sm:gap-4 sm:p-4"
            >
              <img
                src={
                  item.product.imageUrl ??
                  "/placeholder.png"
                }
                alt={item.product.name}
                className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20"
              />

              <div className="min-w-0 flex-1">
                <h4 className="break-words text-sm font-medium text-[#1F1816] sm:text-base">
                  {item.product.name}
                </h4>

                <p className="mt-1 text-xs text-[#6E625C] sm:text-sm">
                  Quantity: {item.quantity}
                </p>

                <p className="mt-1 text-sm font-semibold text-[#1F1816] sm:text-base">
                  ₹
                  {Number(
                    item.product.basePrice
                  ).toFixed(2)}
                </p>

                {item.customizations &&
                  Object.keys(
                    item.customizations
                  ).length > 0 && (
                    <div className="mt-2.5 sm:mt-3">
                      <p className="text-xs font-medium text-[#1F1816] sm:text-sm">
                        Customization
                      </p>

                      <div className="mt-1.5 space-y-1 sm:mt-2">
                        {Object.entries(
                          item.customizations
                        ).map(([key, value]) => {
                          const field =
                            item.product.customFields.find(
                              (field: any) =>
                                field.id === key
                            );

                          return (
                            <p
                              key={key}
                              className="break-words text-[11px] leading-relaxed text-[#6E625C] sm:text-sm"
                            >
                              <span className="font-medium">
                                {field?.label ?? key}:
                              </span>{" "}
                              {String(value)}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-[#EFE8E2] pt-5 sm:pt-6">
        <div className="flex items-center justify-between gap-4 text-sm text-[#6E625C]">
          <span>Subtotal</span>

          <span className="shrink-0">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm text-[#6E625C]">
          <span>Shipping</span>

          <span className="shrink-0">
            {!shippingSaved ? (
              "—"
            ) : currentShippingCost === 0 ? (
              <span className="font-medium text-green-600">
                FREE
              </span>
            ) : (
              `₹${currentShippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#EFE8E2] pt-3 text-base font-semibold text-[#1F1816] sm:text-lg">
          <span>Grand Total</span>

          <span className="shrink-0">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <PaymentButton
        shippingSaved={shippingSaved}
        shippingCost={currentShippingCost}
        phone={cart?.phone ?? ""}
        email={cart?.email ?? ""}
        name={cart?.fullName ?? ""}
      />
    </div>
  );
}