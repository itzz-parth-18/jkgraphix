"use client";

import React from "react";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export type CartItem = {
  id: string;
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
}

export default function CartDrawer({ isOpen, onClose, items, onRemoveItem }: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-espresso/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream border-l border-taupe-border shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-taupe-border/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-espresso" />
              <h2 className="font-serif text-lg font-semibold text-espresso">Your Gift Cart</h2>
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

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-taupe-light" />
                <p className="font-serif text-lg text-espresso">Your cart is currently empty</p>
                <p className="text-xs text-taupe max-w-[200px]">
                  Explore our collection of personalized gifts to add something special.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white border border-taupe-border/60 rounded-xl">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg border border-taupe-border/40" 
                  />
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif font-medium text-sm text-espresso line-clamp-1">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-taupe-light hover:text-red-500 transition ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-espresso">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>

                    {/* Displays Personalization Summary */}
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <div className="mt-2 text-[11px] bg-cream-dark/60 p-2 rounded-md space-y-1">
                        {Object.entries(item.customizations).map(([key, val]) => (
                          <div key={key} className="text-taupe line-clamp-1">
                            <span className="font-medium text-espresso capitalize">{key}:</span> {String(val)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-taupe-border bg-white space-y-4">
              <div className="space-y-2 text-xs text-taupe">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-espresso">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-sage font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-espresso pt-2 border-t border-taupe-border/40">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => alert("Proceeding to Checkout step!")}
                className="w-full bg-espresso hover:bg-espresso-hover text-cream py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-soft transition active:scale-[0.99]"
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