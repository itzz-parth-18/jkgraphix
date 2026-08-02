"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
};

export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  disabled = false,
}: Props) {
  return (
    <div className="inline-flex items-center rounded-xl border border-[#EFE8E2] bg-white">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="p-2 text-[#6E625C] transition hover:bg-[#F9F6F2] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span className="min-w-[48px] px-3 text-center text-sm font-semibold text-[#1F1816]">
        {quantity}
      </span>

      <button
  type="button"
  onClick={onIncrease}
  disabled={disabled}
  className="p-2 text-[#6E625C] transition hover:bg-[#F9F6F2] disabled:cursor-not-allowed disabled:opacity-40"
>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}