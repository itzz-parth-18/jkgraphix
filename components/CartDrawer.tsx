"use client";

import React from "react";
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
  onUpdateQuantity?: (id: string, newQty: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const itemPrice = Number(item.price ?? (item as any).basePrice ?? 0);
    const itemQty = Number(item.quantity ?? 1);
    return acc + (isNaN(itemPrice) ? 0 : itemPrice) * (isNaN(itemQty) ? 1 : itemQty);
  }, 0);

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    window.location.href = "/checkout";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-espresso/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream border-l border-taupe-border shadow-2xl flex flex-col">
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
              onClick={onClose}
              className="text-taupe hover:text-espresso transition p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
                const itemPrice = Number(item.price ?? (item as any).basePrice ?? 0);
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white border border-taupe-border/60 rounded-xl items-center"
                  >
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-taupe-border/40 shrink-0"
                    />

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-medium text-sm text-espresso truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-taupe-light hover:text-red-500 transition ml-2 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-espresso">
                        ₹{itemPrice.toFixed(2)}
                      </p>

                      {/* Super Fast Quantity + and - controls */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="inline-flex items-center border border-taupe-border rounded-lg bg-cream/30 px-2 py-0.5">
                          <button
                            onClick={() => {
                              if (onUpdateQuantity && item.quantity > 1) {
                                onUpdateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="px-1.5 text-xs font-bold text-taupe hover:text-espresso cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold text-espresso">{item.quantity}</span>
                          <button
                            onClick={() => {
                              if (onUpdateQuantity) {
                                onUpdateQuantity(item.id, item.quantity + 1);
                              }
                            }}
                            className="px-1.5 text-xs font-bold text-taupe hover:text-espresso cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

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

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-espresso hover:bg-espresso-hover text-cream py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-soft transition active:scale-[0.99] cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}