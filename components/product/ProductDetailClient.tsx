"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { UploadButton } from "@uploadthing/react";
import CustomizationEngine, { CustomField } from "@/components/CustomizationEngine";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { ShoppingBag, Sparkles, Truck, ShieldCheck, CheckCircle2, Trash2, MessageCircle } from "lucide-react";
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
  const [customizationData, setCustomizationData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);


  const [whatsappNumber, setWhatsappNumber] = useState("");
  const isCR = product.productType === "DESIGN_CONSULTATION";

  const validateCustomFields = () => {
    const errors: string[] = [];

    product.customFields?.forEach((field: any) => {
      if (
        field.isRequired &&
        !customizationData[field.id]
      ) {
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
          price: Number(item.price ?? item.basePrice ?? item.product?.basePrice ?? 0),
          quantity: Number(item.quantity ?? 1),
          image: item.image || item.imageUrl || item.product?.imageUrl || "",
          customizations: item.customizations || {},
        }));

        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId: id, quantity: newQty }),
      });
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const handleAddToCart = async () => {
    if (!validateCustomFields()) {
      return;
    }

    try {
      const finalCustomizations = {
        ...customizationData,
        customPhotoUrl: customizationData.photo_upload || customizationData.customPhotoUrl || "",
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
        // Pending cart item ko localStorage mein save kar lo login ke baad add karne ke liye
        localStorage.setItem("pending_cart_item", JSON.stringify({
          productId: product.id,
          quantity,
          customizations: finalCustomizations,
        }));

        window.location.href = "/login?callbackUrl=" + encodeURIComponent(window.location.pathname);
        return;
      }

      if (!res.ok) {
        alert("Failed to add item to cart.");
        return;
      }

      if (isCR && whatsappNumber.trim()) {
        localStorage.setItem("checkout_whatsapp", whatsappNumber.trim());
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
      await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F9F6F2] border border-[#EFE8E2]">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-[#1F1816] flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Handcrafted
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
                  selectedImage === img ? "border-[#C89A84] scale-95" : "border-transparent opacity-70 hover:opacity-100"
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
            <p className="text-xs font-semibold tracking-wider text-[#C89A84] uppercase">
              {isCR ? "Consultation Required" : "Personalized Collection"}
            </p>
            <h1 className="text-3xl font-serif text-[#1F1816] font-semibold mt-1">{product.name}</h1>
            <p className="text-sm text-[#6E625C] mt-2">{product.description}</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-serif font-bold text-[#1F1816]">₹{Number(product.basePrice).toFixed(2)}</span>
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

          {/* Professional Uploadthing Integration Box */}
          <div className="space-y-2 pt-2 border-t border-[#EFE8E2]">
            <label className="block text-sm font-medium text-[#1F1816]">
              Upload High-Resolution Photo (Cloud)
            </label>
            <div className="border-2 border-dashed border-[#EFE8E2] rounded-2xl p-5 bg-[#F9F6F2] flex flex-col items-center justify-center transition hover:border-[#C89A84]">
              {customizationData.photo_upload ? (
                <div className="w-full flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#EFE8E2]">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={customizationData.photo_upload}
                      alt="Uploaded customer photo"
                      className="w-14 h-14 object-cover rounded-lg border border-[#EFE8E2] flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Photo Attached Successfully
                      </p>
                      <p className="text-[10px] text-[#6E625C] truncate mt-0.5 max-w-[180px]">
                        {customizationData.photo_upload}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomizationData((prev) => ({ ...prev, photo_upload: undefined, customPhotoUrl: undefined }))}
                    className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center">
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
    className="bg-[#1F1816] text-[#F9F6F2] font-medium text-xs px-6 py-2.5 rounded-xl hover:bg-[#322724] transition shadow-sm cursor-pointer"
  >
    Login to Upload Photo
  </button>
) : (
  <UploadButton<OurFileRouter, any>
    endpoint="customerPhotoUploader"
    appearance={{
      button:
        "bg-[#1F1816] text-[#F9F6F2] font-medium text-xs px-6 py-2.5 rounded-xl hover:bg-[#322724] transition shadow-sm cursor-pointer ut-readying:bg-gray-400",
      container: "flex flex-col items-center justify-center gap-2 w-full",
      allowedContent: "text-xs text-[#6E625C] mt-1",
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
                  <span className="text-[11px] text-[#6E625C] mt-2">Supports PNG, JPG up to 4MB (Progress bar included)</span>
                </div>
              )}
            </div>
          </div>

          {isCR && (
            <div className="space-y-2 pt-4 border-t border-[#EFE8E2]">
              <label className="block text-sm font-medium text-[#1F1816]">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#6E625C] mb-2">Required for custom consultation before order processing.</p>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => {
                  setWhatsappNumber(e.target.value);
                  if (validationErrors.length > 0) setValidationErrors([]);
                }}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-[#EFE8E2] bg-white focus:outline-none focus:ring-2 focus:ring-[#C89A84] text-sm text-[#1F1816]"
              />
            </div>
          )}

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

          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
              <div className="flex items-center border border-[#EFE8E2] rounded-xl bg-white px-3 py-2 shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 font-bold text-[#6E625C] hover:text-[#1F1816]">-</button>
                <span className="px-4 text-sm font-semibold text-[#1F1816]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-2 font-bold text-[#6E625C] hover:text-[#1F1816]">+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 w-full sm:w-auto bg-[#1F1816] hover:bg-[#322724] text-[#F9F6F2] py-3.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart — ₹{(Number(product.basePrice) * quantity).toFixed(2)}
              </button>

              {isCR && (
                <a
                  href={`https://wa.me/917978658304?text=${encodeURIComponent(`Hi JK Graphix, I am interested in designing a custom ${product.name}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 w-full sm:w-auto bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition active:scale-[0.99] whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#EFE8E2] text-xs text-[#6E625C]">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-amber-600" /> Ships in 2–3 workshop days</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Quality guarantee</div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-serif font-semibold text-[#1F1816]">
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <a
                key={item.id}
                href={`/shop/${item.slug}`}
                className="overflow-hidden rounded-2xl border border-[#EFE8E2] bg-white transition hover:shadow-lg"
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
                  <h3 className="line-clamp-2 font-medium text-[#1F1816]">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-lg font-semibold text-[#1F1816]">
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
