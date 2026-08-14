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
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream border-l border-taupe-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-taupe-border/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-espresso" />

              <h2 className="font-serif text-lg font-semibold text-espresso">
                Your Gift Cart
              </h2>

              <span className="bg-rose-light text-espresso text-xs font-medium px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-taupe hover:text-espresso transition p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-taupe-light" />

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
                    className="flex gap-4 p-4 bg-white border border-taupe-border/60 rounded-xl items-center"
                  >
                    {/* Product Image */}
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60"
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-taupe-border/40 shrink-0"
                    />

                    {/* Product Details */}
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-medium text-sm text-espresso truncate">
                          {item.name}
                        </h4>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          disabled={isUpdating}
                          className="text-taupe-light hover:text-red-500 transition ml-2 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-espresso">
                        ₹{itemPrice.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="inline-flex items-center border border-taupe-border rounded-lg bg-cream/30 px-2 py-0.5">
                          <button
                            type="button"
                            disabled={
                              isUpdating || item.quantity <= 1
                            }
                            onClick={() => handleDecrease(item)}
                            className="px-1.5 text-xs font-bold text-taupe hover:text-espresso cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            -
                          </button>

                          <span className="px-2 text-xs font-semibold text-espresso min-w-[24px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleIncrease(item)}
                            className="px-1.5 text-xs font-bold text-taupe hover:text-espresso cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {isUpdating && (
                          <span className="text-[10px] text-taupe">
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
            <div className="p-6 border-t border-taupe-border bg-white space-y-4">
              <div className="space-y-2 text-xs text-taupe">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span className="font-medium text-espresso">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-espresso pt-2 border-t border-taupe-border/40">
                  <span>Total</span>

                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                disabled={updatingItems.size > 0}
                onClick={handleProceedToCheckout}
                className={`w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-soft transition ${
                  updatingItems.size > 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-espresso hover:bg-espresso-hover text-cream cursor-pointer active:scale-[0.99]"
                }`}
              >
                {updatingItems.size > 0
                  ? "Updating Cart..."
                  : "Proceed to Checkout"}

                {updatingItems.size === 0 && (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}