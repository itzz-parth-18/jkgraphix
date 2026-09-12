"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export type CartItem = {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customizations?: Record<string, any>;
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity?: (
    id: string,
    newQty: number
  ) => Promise<void> | void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
}: CartDrawerProps) {
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(
    new Set()
  );

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const itemPrice = Number(
      item.price ?? (item as any).basePrice ?? 0
    );

    const itemQty = Number(item.quantity ?? 1);

    return (
      acc +
      (isNaN(itemPrice) ? 0 : itemPrice) *
        (isNaN(itemQty) ? 1 : itemQty)
    );
  }, 0);

  const handleProceedToCheckout = () => {
    if (items.length === 0 || updatingItems.size > 0) return;

    window.location.href = "/checkout";
  };

  const handleDecrease = async (item: CartItem) => {
    if (!onUpdateQuantity || item.quantity <= 1) return;

    setUpdatingItems((prev) => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });

    try {
      await onUpdateQuantity(item.id, item.quantity - 1);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleIncrease = async (item: CartItem) => {
    if (!onUpdateQuantity) return;

    setUpdatingItems((prev) => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });

    try {
      await onUpdateQuantity(item.id, item.quantity + 1);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-6 lg:pl-10">
        <div className="flex h-full w-screen max-w-md flex-col border-l border-taupe-border bg-cream shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-taupe-border/60 p-4 sm:p-6">
            <div className="flex min-w-0 items-center gap-2">
              <ShoppingBag className="h-5 w-5 shrink-0 text-espresso" />

              <h2 className="truncate font-serif text-base font-semibold text-espresso sm:text-lg">
                Your Gift Cart
              </h2>

              <span className="shrink-0 rounded-full bg-rose-light px-2 py-0.5 text-xs font-medium text-espresso">
                {items.length}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-taupe transition hover:bg-white hover:text-espresso"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-3 px-4 text-center">
                <ShoppingBag className="h-12 w-12 text-taupe-light" />

                <p className="font-serif text-lg text-espresso">
                  Your cart is currently empty
                </p>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = Number(
                  item.price ?? (item as any).basePrice ?? 0
                );

                const isUpdating = updatingItems.has(item.id);

                return (
                  <div
                    key={item.id}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-taupe-border/60 bg-white p-3 sm:gap-4 sm:p-4"
                  >
                    {/* Product Image */}
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60"
                      }
                      alt={item.name}
                      className="h-14 w-14 shrink-0 rounded-lg border border-taupe-border/40 object-cover sm:h-16 sm:w-16"
                    />

                    {/* Product Details */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex min-w-0 items-start justify-between gap-2">
                        <h4 className="min-w-0 truncate font-serif text-sm font-medium text-espresso">
                          {item.name}
                        </h4>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          disabled={isUpdating}
                          aria-label={`Remove ${item.name}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-taupe-light transition hover:bg-rose-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-espresso">
                        ₹{itemPrice.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex min-w-0 items-center gap-2 pt-1">
                        <div className="inline-flex shrink-0 items-center rounded-lg border border-taupe-border bg-cream/30">
                          <button
                            type="button"
                            disabled={
                              isUpdating || item.quantity <= 1
                            }
                            onClick={() => handleDecrease(item)}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center text-sm font-bold text-taupe transition hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="flex h-8 min-w-[28px] items-center justify-center px-1 text-xs font-semibold text-espresso">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleIncrease(item)}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center text-sm font-bold text-taupe transition hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        {isUpdating && (
                          <span className="truncate text-[10px] text-taupe">
                            Updating...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="space-y-3 border-t border-taupe-border bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:space-y-4 sm:p-6">
              <div className="space-y-2 text-xs text-taupe">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span className="font-medium text-espresso">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-taupe-border/40 pt-2 text-sm font-semibold text-espresso">
                  <span>Total</span>

                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                disabled={updatingItems.size > 0}
                onClick={handleProceedToCheckout}
                className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium shadow-soft transition ${
                  updatingItems.size > 0
                    ? "cursor-not-allowed bg-gray-400 text-white"
                    : "cursor-pointer bg-espresso text-cream hover:bg-espresso-hover active:scale-[0.99]"
                }`}
              >
                {updatingItems.size > 0
                  ? "Updating Cart..."
                  : "Proceed to Checkout"}

                {updatingItems.size === 0 && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}