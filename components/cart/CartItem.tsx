"use client";

import { Trash2 } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

type Props = {
  item: any;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  return (
    <div className="rounded-2xl border border-[#EFE8E2] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row">
        <img
          src={
            item.product.imageUrl ||
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=60"
          }
          alt={item.product.name}
          className="h-32 w-32 rounded-xl object-cover"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#1F1816]">
                {item.product.name}
              </h3>

              <p className="mt-1 text-sm text-[#6E625C]">
                ₹{Number(item.product.basePrice).toFixed(2)}
              </p>
            </div>

            <button
              onClick={onRemove}
              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {item.customizations &&
            Object.keys(item.customizations).length > 0 && (
              <div className="mt-4 rounded-xl bg-[#F9F6F2] p-3">
                <p className="mb-2 text-xs font-semibold uppercase text-[#6E625C]">
                  Customizations
                </p>

                <div className="space-y-2 text-sm">
                  {Object.entries(item.customizations ?? {}).map(([fieldId, value]) => {
  const field = item.product.customFields.find(
    (f: any) => f.id === fieldId
  );

  return (
    <div
      key={fieldId}
      className="flex justify-between gap-6 text-sm"
    >
      <span className="font-medium text-[#6E625C]">
        {field?.label ?? "Customization"}
      </span>

      <span className="text-right">
        {String(value)}
      </span>
    </div>
  );
})}
                </div>
              </div>
            )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <QuantitySelector
  quantity={item.quantity}
  onIncrease={onIncrease}
  onDecrease={onDecrease}
  
/>

            <p className="text-lg font-semibold text-[#1F1816]">
              ₹
              {(
                Number(item.product.basePrice) *
                item.quantity
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}