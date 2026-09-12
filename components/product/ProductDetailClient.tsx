"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { UploadButton } from "@uploadthing/react";
import CustomizationEngine, {
  CustomField,
} from "@/components/CustomizationEngine";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import {
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

type Props = {
  product: any;
  relatedProducts: any[];
};

export default function ProductDetailClient({
  product,
  relatedProducts,
}: Props) {
  const { data: session, status: sessionStatus } = useSession();

  const [selectedImage, setSelectedImage] = useState(
    product.imageUrl ||
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=60"
  );

  const [customizationData, setCustomizationData] = useState<
    Record<string, any>
  >({});

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [whatsappNumber, setWhatsappNumber] = useState("");

  const isCR = product.productType === "DESIGN_CONSULTATION";

  const validateCustomFields = () => {
    const errors: string[] = [];

    product.customFields?.forEach((field: any) => {
      if (field.isRequired && !customizationData[field.id]) {
        errors.push(field.label);
      }
    });

    if (isCR && !whatsappNumber.trim()) {
      errors.push("WhatsApp Number (Required for Consultation)");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");

      if (res.ok) {
        const data = await res.json();
        const rawItems = Array.isArray(data) ? data : data.items || [];

        const formattedItems = rawItems.map((item: any) => ({
          id: item.id,
          productId: item.productId || item.product?.id,
          name: item.name || item.product?.name || "Custom Item",
          price: Number(
            item.price ?? item.basePrice ?? item.product?.basePrice ?? 0
          ),
          quantity: Number(item.quantity ?? 1),
          image:
            item.image ||
            item.imageUrl ||
            item.product?.imageUrl ||
            "",
          customizations: item.customizations || {},
        }));

        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;

    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );

    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: newQty,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart quantity");
      }
    } catch (error) {
      console.error("Failed to update quantity", error);

      // Re-fetch server state if update failed
      await fetchCart();
    }
  };

  const handleAddToCart = async () => {
    if (!validateCustomFields()) {
      return;
    }

    try {
      const finalCustomizations = {
        ...customizationData,
        customPhotoUrl:
          customizationData.photo_upload ||
          customizationData.customPhotoUrl ||
          "",
      };

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          customizations: finalCustomizations,
        }),
      });

      // Agar user logged-in nahi hai (401 Unauthorized)
      if (res.status === 401) {
        localStorage.setItem(
          "pending_cart_item",
          JSON.stringify({
            productId: product.id,
            quantity,
            customizations: finalCustomizations,
          })
        );

        window.location.href =
          "/login?callbackUrl=" +
          encodeURIComponent(window.location.pathname);

        return;
      }

      if (!res.ok) {
        alert("Failed to add item to cart.");
        return;
      }

      if (isCR && whatsappNumber.trim()) {
        localStorage.setItem(
          "checkout_whatsapp",
          whatsappNumber.trim()
        );
      }

      await fetchCart();
      setIsCartOpen(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const handleRemoveItem = async (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-3 lg:col-span-7 lg:space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#EFE8E2] bg-[#F9F6F2]">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />

            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[#1F1816] shadow-sm backdrop-blur-md sm:left-4 sm:top-4 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-rose-500" />
              Handcrafted
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-4">
            {[
              product.imageUrl ||
                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=60",
            ].map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-20 ${
                  selectedImage === img
                    ? "scale-95 border-[#C89A84]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Customization & Purchase */}
        <div className="space-y-5 lg:col-span-5 lg:space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C89A84] sm:text-xs">
              {isCR
                ? "Consultation Required"
                : "Personalized Collection"}
            </p>

            <h1 className="mt-1 font-serif text-2xl font-semibold leading-tight text-[#1F1816] sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-[#6E625C]">
              {product.description}
            </p>

            <div className="mt-3 flex items-baseline gap-3 sm:mt-4">
              <span className="font-serif text-xl font-bold text-[#1F1816] sm:text-2xl">
                ₹{Number(product.basePrice).toFixed(2)}
              </span>
            </div>
          </div>

          <CustomizationEngine
            fields={product.customFields || []}
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

          {/* Upload */}
          <div className="space-y-2 border-t border-[#EFE8E2] pt-4">
            <label className="block text-sm font-medium text-[#1F1816]">
              Upload High-Resolution Photo (Cloud)
            </label>

            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#EFE8E2] bg-[#F9F6F2] p-4 transition hover:border-[#C89A84] sm:p-5">
              {customizationData.photo_upload ? (
                <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#EFE8E2] bg-white p-2.5 sm:gap-3 sm:p-3">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <img
                      src={customizationData.photo_upload}
                      alt="Uploaded customer photo"
                      className="h-12 w-12 shrink-0 rounded-lg border border-[#EFE8E2] object-cover sm:h-14 sm:w-14"
                    />

                    <div className="min-w-0">
                      <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 sm:text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        Photo Attached Successfully
                      </p>

                      <p className="mt-0.5 max-w-[150px] truncate text-[10px] text-[#6E625C] sm:max-w-[180px]">
                        {customizationData.photo_upload}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCustomizationData((prev) => ({
                        ...prev,
                        photo_upload: undefined,
                        customPhotoUrl: undefined,
                      }))
                    }
                    className="flex shrink-0 items-center gap-1 rounded-lg p-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center justify-center">
                  {sessionStatus === "loading" ? (
                    <p className="text-xs text-[#6E625C]">
                      Checking login status...
                    </p>
                  ) : !session ? (
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href =
                          "/login?callbackUrl=" +
                          encodeURIComponent(window.location.pathname);
                      }}
                      className="cursor-pointer rounded-xl bg-[#1F1816] px-5 py-2.5 text-xs font-medium text-[#F9F6F2] shadow-sm transition hover:bg-[#322724]"
                    >
                      Login to Upload Photo
                    </button>
                  ) : (
                    <UploadButton<OurFileRouter, any>
                      endpoint="customerPhotoUploader"
                      appearance={{
                        button:
                          "bg-[#1F1816] text-[#F9F6F2] font-medium text-xs px-5 py-2.5 rounded-xl hover:bg-[#322724] transition shadow-sm cursor-pointer ut-readying:bg-gray-400",
                        container:
                          "flex w-full flex-col items-center justify-center gap-2",
                        allowedContent:
                          "mt-1 text-center text-[11px] text-[#6E625C]",
                      }}
                      onClientUploadComplete={(res: any) => {
                        if (res && res[0]) {
                          const url = res[0].ufsUrl || res[0].url;

                          if (url) {
                            setCustomizationData((prev) => ({
                              ...prev,
                              photo_upload: url,
                              customPhotoUrl: url,
                            }));
                          }
                        }
                      }}
                      onUploadError={(error: Error) => {
                        alert(`Upload failed: ${error.message}`);
                      }}
                    />
                  )}

                  <span className="mt-2 text-center text-[10px] leading-relaxed text-[#6E625C] sm:text-[11px]">
                    Supports PNG, JPG up to 4MB (Progress bar included)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp for CR */}
          {isCR && (
            <div className="space-y-2 border-t border-[#EFE8E2] pt-4">
              <label className="block text-sm font-medium text-[#1F1816]">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>

              <p className="mb-2 text-xs leading-relaxed text-[#6E625C]">
                Required for custom consultation before order processing.
              </p>

              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => {
                  setWhatsappNumber(e.target.value);

                  if (validationErrors.length > 0) {
                    setValidationErrors([]);
                  }
                }}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-[#EFE8E2] bg-white px-4 py-3 text-sm text-[#1F1816] focus:outline-none focus:ring-2 focus:ring-[#C89A84]"
              />
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4">
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

          {/* Purchase */}
          <div className="space-y-4 pt-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="flex h-12 w-fit shrink-0 items-center rounded-xl border border-[#EFE8E2] bg-white px-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.max(1, quantity - 1))
                  }
                  className="flex h-10 w-10 items-center justify-center font-bold text-[#6E625C] hover:text-[#1F1816]"
                >
                  -
                </button>

                <span className="w-8 text-center text-sm font-semibold text-[#1F1816]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center font-bold text-[#6E625C] hover:text-[#1F1816]"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F1816] px-4 py-3 text-sm font-medium whitespace-nowrap text-[#F9F6F2] shadow-sm transition hover:bg-[#322724] active:scale-[0.99] sm:flex-1"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                Add to Cart — ₹
                {(Number(product.basePrice) * quantity).toFixed(2)}
              </button>

              {isCR && (
                <a
                  href={`https://wa.me/917978658304?text=${encodeURIComponent(
                    `Hi JK Graphix, I am interested in designing a custom ${product.name}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-white px-4 py-3 text-sm font-medium text-[#25D366] transition hover:bg-[#25D366]/10 active:scale-[0.99] sm:flex-1"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  Chat on WhatsApp
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-[#EFE8E2] pt-4 text-xs text-[#6E625C] sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-amber-600" />
                Ships in 2–3 workshop days
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                Quality guarantee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 sm:mt-14 lg:mt-16">
          <h2 className="mb-4 font-serif text-xl font-semibold text-[#1F1816] sm:mb-6 sm:text-2xl">
            Related Products
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <a
                key={item.id}
                href={`/shop/${item.slug}`}
                className="overflow-hidden rounded-xl border border-[#EFE8E2] bg-white transition hover:shadow-lg sm:rounded-2xl"
              >
                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=60"
                  }
                  alt={item.name}
                  className="h-36 w-full object-cover sm:h-52"
                />

                <div className="p-3 sm:p-4">
                  <h3 className="line-clamp-2 text-sm font-medium text-[#1F1816] sm:text-base">
                    {item.name}
                  </h3>

                  <p className="mt-1.5 text-base font-semibold text-[#1F1816] sm:mt-2 sm:text-lg">
                    ₹{Number(item.basePrice).toFixed(2)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}