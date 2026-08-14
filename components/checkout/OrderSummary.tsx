import PaymentButton from "@/components/checkout/PaymentButton";
type Props = {
  cart: any;
  shippingSaved: boolean;
};

export default function OrderSummary({
  cart,
  shippingSaved,
}: Props) {

const subtotal =
  cart?.items?.reduce(
    (sum: number, item: any) =>
      sum + Number(item.product.basePrice) * item.quantity,
    0
  ) ?? 0;

  const grandTotal = subtotal;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#1F1816]">
        Order Summary
      </h2>

<div>
  <h3 className="text-lg font-semibold text-[#1F1816]">
    Products
  </h3>

<div className="mt-4 space-y-4">
 {cart?.items?.map((item: any) => (
    

    <div
      key={item.id}
      className="flex items-center gap-4 rounded-xl border border-[#EFE8E2] p-4"
    >
      <img
        src={item.product.imageUrl ?? "/placeholder.png"}
        alt={item.product.name}
        className="h-20 w-20 rounded-lg object-cover"
      />

      <div className="flex-1">
        <h4 className="font-medium text-[#1F1816]">
          {item.product.name}
        </h4>

        <p className="mt-1 text-sm text-[#6E625C]">
          Quantity: {item.quantity}
        </p>

        <p className="mt-1 font-semibold text-[#1F1816]">
          ₹{Number(item.product.basePrice).toFixed(2)}
        </p>

{item.customizations &&
  Object.keys(item.customizations).length > 0 && (
    <div className="mt-3">
      <p className="text-sm font-medium text-[#1F1816]">
        Customization
      </p>

      <div className="mt-2 space-y-1">
        {Object.entries(item.customizations).map(([key, value]) => {
          const field = item.product.customFields.find(
            (field: any) => field.id === key
          );

          return (
            <p
              key={key}
              className="text-sm text-[#6E625C]"
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

<div className="border-t border-[#EFE8E2] pt-6 space-y-3">
  <div className="flex items-center justify-between text-[#6E625C]">
    <span>Subtotal</span>
    <span>₹{subtotal.toFixed(2)}</span>
  </div>

  <div className="flex items-center justify-between text-lg font-semibold text-[#1F1816]">
    <span>Grand Total</span>
    <span>₹{grandTotal.toFixed(2)}</span>
  </div>
</div>

<PaymentButton
  shippingSaved={shippingSaved}
  phone={cart?.phone ?? ""}
  email={cart?.email ?? ""}
  name={cart?.fullName ?? ""}
/>

</div>
  );
}