"use client";

import React, { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import CustomizationEngine, { CustomField } from "@/components/CustomizationEngine";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { ShoppingBag, Sparkles, Truck, ShieldCheck, CheckCircle2, Trash2 } from "lucide-react";
import { OurFileRouter } from "@/app/api/uploadthing/core";



type Props = {
  product: any;
  relatedProducts: any[];
};

export default function ProductDetailClient({
  product,
  relatedProducts,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(
  product.imageUrl ||
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=60"
);
  const [customizationData, setCustomizationData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const validateCustomFields = () => {
  const errors: string[] = [];

  product.customFields.forEach((field: any) => {
    if (
      field.isRequired &&
      !customizationData[field.id]
    ) {
      errors.push(field.label);
    }
  });

  setValidationErrors(errors);

  return errors.length === 0;
};
 const handleAddToCart = async () => {
  if (!validateCustomFields()) {
    return;
  }

  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
        quantity,
        customizations: customizationData,
      }),
    });

    if (res.status === 401) {
      window.location.href = "/login?callbackUrl=/cart";
      return;
    }

    if (!res.ok) {
      alert("Failed to add item to cart.");
      return;
    }

    alert("Product added to cart!");

    setIsCartOpen(false);
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
};

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-dark border border-taupe-border">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-cream/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-espresso flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose" /> Handcrafted
            </span>
          </div>

          <div className="flex gap-4">
            {[
  product.imageUrl ||
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=60",
].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                  selectedImage === img ? "border-rose scale-95" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Customization & Purchase */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-rose uppercase">Personalized Collection</p>
            <h1 className="text-3xl font-serif text-espresso font-semibold mt-1">{product.name}</h1>
            <p className="text-sm text-taupe mt-2">{product.description}</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-serif font-bold text-espresso">${Number(product.basePrice).toFixed(2)}</span>
            </div>
          </div>

         <CustomizationEngine
  fields={product.customFields}
  onChange={(data) => {
    setCustomizationData((prev) => ({
      ...prev,
      ...data,
    }));

    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }}
/>

          {validationErrors.length > 0 && (
  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
    <p className="mb-2 text-sm font-semibold text-red-700">
      Please complete the required fields:
    </p>

    <ul className="list-disc pl-5 text-sm text-red-600">
      {validationErrors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  </div>
)}

          {/* Uploadthing Integration Box */}
          <div className="space-y-2 pt-2 border-t border-taupe-border/60">
            <label className="block text-sm font-medium text-espresso">
              Upload High-Resolution Photo (Cloud)
            </label>
            <div className="border border-dashed border-taupe-border rounded-xl p-4 bg-white flex flex-col items-center justify-center">
              {customizationData.photo_upload ? (
                <div className="w-full flex items-center justify-between gap-3 bg-cream/50 p-2.5 rounded-xl border border-taupe-border">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={customizationData.photo_upload}
                      alt="Uploaded customer photo"
                      className="w-14 h-14 object-cover rounded-lg border border-taupe-border flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Photo Attached
                      </p>
                      <p className="text-[10px] text-taupe truncate mt-0.5 max-w-[180px]">
                        {customizationData.photo_upload}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomizationData((prev) => ({ ...prev, photo_upload: undefined }))}
                    className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ) : (
                <div className="w-full py-2 flex flex-col items-center">
                  <UploadButton<OurFileRouter, "customerPhotoUploader">
                    endpoint="customerPhotoUploader"
                    onClientUploadComplete={(res: any) => {
                      if (res && res[0]) {
                        const url = res[0].ufsUrl;
                        if (url) {
                          setCustomizationData((prev) => ({
                            ...prev,
                            photo_upload: url,
                          }));
                        }
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                  />
                  <span className="text-[11px] text-taupe mt-1">Supports PNG, JPG up to 4MB</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-taupe-border rounded-xl bg-white px-3 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 font-bold text-taupe hover:text-espresso">-</button>
                <span className="px-4 text-sm font-semibold text-espresso">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-2 font-bold text-taupe hover:text-espresso">+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-espresso hover:bg-espresso-hover text-cream py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-soft transition active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" />
                Add Personalized Item — ${(Number(product.basePrice) * quantity).toFixed(2)}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-taupe-border/60 text-xs text-taupe">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-rose" /> Ships in 2–3 workshop days</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-sage" /> Quality guarantee</div>
            </div>
          </div>
        </div>

      </div>

{relatedProducts.length > 0 && (
  <section className="mt-16">
    <h2 className="mb-6 text-2xl font-serif font-semibold text-espresso">
      Related Products
    </h2>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {relatedProducts.map((item) => (
        <a
          key={item.id}
          href={`/shop/${item.slug}`}
          className="overflow-hidden rounded-2xl border border-taupe-border bg-white transition hover:shadow-lg"
        >
          <img
            src={
              item.imageUrl ||
              "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=60"
            }
            alt={item.name}
            className="h-52 w-full object-cover"
          />

          <div className="p-4">
            <h3 className="line-clamp-2 font-medium text-espresso">
              {item.name}
            </h3>

            <p className="mt-2 text-lg font-semibold text-espresso">
              ₹{Number(item.basePrice).toFixed(2)}
            </p>
          </div>
        </a>
      ))}
    </div>
  </section>
)}

      {/* Cart Drawer Component */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}