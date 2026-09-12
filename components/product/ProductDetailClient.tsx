"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { UploadButton } from "@uploadthing/react";
import CustomizationEngine from "@/components/CustomizationEngine";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import {
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  MessageCircle,
  ImagePlus,
  X,
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

  const fallbackProductImage =
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=60";

  /*
   * Product gallery images are separate from customer-uploaded
   * customization photos.
   *
   * imageUrl = primary product image
   * galleryUrls = additional product gallery images
   */
  const productImages = useMemo(
    () =>
      Array.from(
        new Set(
          [
            product.imageUrl,
            ...(Array.isArray(product.galleryUrls)
              ? product.galleryUrls
              : []),
          ].filter(
            (url): url is string =>
              typeof url === "string" && url.trim().length > 0
          )
        )
      ),
    [product.imageUrl, product.galleryUrls]
  );

  const displayProductImages =
    productImages.length > 0 ? productImages : [fallbackProductImage];

  const [selectedImage, setSelectedImage] = useState(
    displayProductImages[0]
  );

  useEffect(() => {
    if (displayProductImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setSelectedImage((currentImage) => {
        const currentIndex =
          displayProductImages.indexOf(currentImage);

        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + 1) % displayProductImages.length;

        return displayProductImages[nextIndex];
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, [displayProductImages]);

  useEffect(() => {
    if (!displayProductImages.includes(selectedImage)) {
      setSelectedImage(displayProductImages[0]);
    }
  }, [displayProductImages, selectedImage]);

  const [customizationData, setCustomizationData] = useState<
    Record<string, any>
  >({});

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [whatsappNumber, setWhatsappNumber] = useState("");

  const isCR = product.productType === "DESIGN_CONSULTATION";

  /*
   * ---------------------------------------------------------
   * PRODUCT PHOTO CONFIG
   * ---------------------------------------------------------
   */

  const rawPhotoMin = Number(product.photoMinCount ?? 0);
  const rawPhotoMax = Number(
    product.photoMaxCount ?? product.maxPhotoUploads ?? 1
  );

  const photoMinCount = Math.max(
    0,
    Number.isFinite(rawPhotoMin) ? Math.floor(rawPhotoMin) : 0
  );

  const photoMaxCount = Math.max(
    photoMinCount,
    Number.isFinite(rawPhotoMax) ? Math.floor(rawPhotoMax) : 1
  );

  const requiresPhoto =
    Boolean(product.requiresPhoto) || photoMinCount > 0;

  const allowMultiplePhotos =
    Boolean(product.allowMultiplePhotos) || photoMaxCount > 1;

  const getPhotoUrls = (data: Record<string, any>): string[] => {
    if (Array.isArray(data.photos)) {
      return data.photos.filter(
        (url: unknown): url is string =>
          typeof url === "string" && url.trim().length > 0
      );
    }

    const legacyPhoto =
      data.customPhotoUrl || data.photo_upload;

    if (
      typeof legacyPhoto === "string" &&
      legacyPhoto.trim().length > 0
    ) {
      return [legacyPhoto];
    }

    return [];
  };

  const photoUrls = getPhotoUrls(customizationData);

  /*
   * ---------------------------------------------------------
   * STANDARD PRODUCT CUSTOMIZATION VALIDATION
   * ---------------------------------------------------------
   */

  const validateCustomFields = () => {
    const errors: string[] = [];

    /*
     * Advanced custom fields created through CustomFieldsEditor
     */
    product.customFields?.forEach((field: any) => {
      const value = customizationData[field.id];

      if (
        field.isRequired &&
        (value === undefined ||
          value === null ||
          String(value).trim() === "")
      ) {
        errors.push(field.label);
      }
    });

    /*
     * Product-level photo requirement
     */
    if (requiresPhoto && photoUrls.length < photoMinCount) {
      errors.push(
        photoMinCount === 1
          ? "Photo upload is required"
          : `${photoMinCount} photos are required`
      );
    }

    if (photoUrls.length > photoMaxCount) {
      errors.push(
        photoMaxCount === 1
          ? "Only 1 photo can be uploaded"
          : `Maximum ${photoMaxCount} photos can be uploaded`
      );
    }

    if (!allowMultiplePhotos && photoUrls.length > 1) {
      errors.push("Only 1 photo can be uploaded for this product");
    }

    /*
     * Standard custom name
     */
    if (
      product.requiresCustomName &&
      !String(customizationData.customName || "").trim()
    ) {
      errors.push("Custom Name");
    }

    /*
     * Standard custom message
     */
    if (
      product.requiresCustomMessage &&
      !String(customizationData.customMessage || "").trim()
    ) {
      errors.push("Custom Message");
    }

    /*
     * Standard additional notes
     */
    if (
      product.requiresAdditionalNotes &&
      !String(customizationData.additionalNotes || "").trim()
    ) {
      errors.push("Additional Notes");
    }

    /*
     * Standard delivery date
     */
    if (
      product.requiresDeliveryDate &&
      !String(customizationData.deliveryDate || "").trim()
    ) {
      errors.push("Delivery Date");
    }

    /*
     * Consultation WhatsApp
     */
    if (isCR && !whatsappNumber.trim()) {
      errors.push("WhatsApp Number (Required for Consultation)");
    }

    setValidationErrors(errors);

    return errors.length === 0;
  };

  /*
   * ---------------------------------------------------------
   * CART
   * ---------------------------------------------------------
   */

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");

      if (res.ok) {
        const data = await res.json();
        const rawItems = Array.isArray(data)
          ? data
          : data.items || [];

        const formattedItems = rawItems.map((item: any) => ({
          id: item.id,
          productId: item.productId || item.product?.id,
          name:
            item.name ||
            item.product?.name ||
            "Custom Item",
          price: Number(
            item.price ??
              item.basePrice ??
              item.product?.basePrice ??
              0
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

  const handleUpdateQuantity = async (
    id: string,
    newQty: number
  ) => {
    if (newQty < 1) return;

    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: newQty }
          : item
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
      await fetchCart();
    }
  };

  const handleAddToCart = async () => {
    if (!validateCustomFields()) {
      return;
    }

    try {
      /*
       * Preserve the old photo aliases for backward compatibility.
       * New multi-photo data lives in `photos`.
       */
      const finalCustomizations = {
        ...customizationData,
        photos: photoUrls,
        customPhotoUrl: photoUrls[0] || "",
        photo_upload: photoUrls[0] || "",
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

      /*
       * Agar user logged-in nahi hai
       */
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
        let errorMessage = "Failed to add item to cart.";

        try {
          const errorData = await res.json();

          if (
            Array.isArray(errorData.validationErrors) &&
            errorData.validationErrors.length > 0
          ) {
            errorMessage =
              errorData.validationErrors.join("\n");
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Keep fallback message
        }

        alert(errorMessage);
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
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );

    try {
      await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  /*
   * ---------------------------------------------------------
   * STANDARD CUSTOMIZATION HANDLER
   * ---------------------------------------------------------
   */

  const updateCustomization = (
    key: string,
    value: any
  ) => {
    setCustomizationData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  /*
   * ---------------------------------------------------------
   * PHOTO UPLOAD
   * ---------------------------------------------------------
   */

  const handlePhotoUploadComplete = (res: any[]) => {
    if (!res || res.length === 0) {
      return;
    }

    const uploadedUrls = res
      .map((file: any) => file?.ufsUrl || file?.url)
      .filter(
        (url: unknown): url is string =>
          typeof url === "string" &&
          url.trim().length > 0
      );

    if (uploadedUrls.length === 0) {
      return;
    }

    setCustomizationData((prev) => {
      const existingPhotos = getPhotoUrls(prev);

      const mergedPhotos = Array.from(
        new Set([...existingPhotos, ...uploadedUrls])
      ).slice(0, photoMaxCount);

      return {
        ...prev,
        photos: mergedPhotos,

        /*
         * Backward-compatible aliases
         */
        photo_upload: mergedPhotos[0] || "",
        customPhotoUrl: mergedPhotos[0] || "",
      };
    });

    setValidationErrors([]);
  };

  const removePhoto = (urlToRemove: string) => {
    setCustomizationData((prev) => {
      const remainingPhotos = getPhotoUrls(prev).filter(
        (url) => url !== urlToRemove
      );

      return {
        ...prev,
        photos: remainingPhotos,
        photo_upload: remainingPhotos[0] || "",
        customPhotoUrl: remainingPhotos[0] || "",
      };
    });

    setValidationErrors([]);
  };

  /*
   * ---------------------------------------------------------
   * PHOTO LABEL
   * ---------------------------------------------------------
   */

  const getPhotoLabel = () => {
    if (photoMinCount === photoMaxCount) {
      if (photoMinCount === 0) {
        return "Upload High-Resolution Photo (Optional)";
      }

      if (photoMinCount === 1) {
        return "Upload High-Resolution Photo";
      }

      return `Upload ${photoMinCount} Photos`;
    }

    if (photoMinCount === 0) {
      return `Upload Photos (Up to ${photoMaxCount})`;
    }

    return `Upload ${photoMinCount}–${photoMaxCount} Photos`;
  };

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <>
      <style jsx>{`
        .product-gallery-progress {
          width: 0%;
          animation: productGalleryProgress 3s linear forwards;
        }

        @keyframes productGalleryProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>

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

          {displayProductImages.length > 1 && (
            <div
              className="flex w-full gap-1.5 px-1"
              role="tablist"
              aria-label="Product image slideshow"
            >
              {displayProductImages.map((img, idx) => {
                const selectedIndex = displayProductImages.indexOf(
                  selectedImage
                );
                const isActive = selectedImage === img;
                const isCompleted =
                  selectedIndex !== -1 && idx < selectedIndex;

                return (
                  <button
                    key={`progress-${img}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    aria-label={`View product image ${idx + 1}`}
                    className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#E9E0DA]"
                    role="tab"
                    aria-selected={isActive}
                  >
                    {isCompleted && (
                      <span className="absolute inset-0 rounded-full bg-[#C89A84]" />
                    )}

                    {isActive && (
                      <span
                        key={`progress-fill-${img}-${idx}`}
                        className="product-gallery-progress absolute inset-y-0 left-0 rounded-full bg-[#C89A84]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-4">
            {displayProductImages.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setSelectedImage(img)}
                aria-label={`View product image ${idx + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-20 ${
                  selectedImage === img
                    ? "scale-95 border-[#C89A84]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} image ${idx + 1}`}
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

          {/* Existing advanced custom fields */}
          {product.customFields?.length > 0 && (
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
          )}

          {/* -------------------------------------------------
              STANDARD PRODUCT CUSTOMIZATIONS
              ------------------------------------------------- */}

          {(product.requiresCustomName ||
            product.requiresCustomMessage ||
            product.requiresAdditionalNotes ||
            product.requiresDeliveryDate) && (
            <div className="space-y-5 rounded-2xl border border-[#EFE8E2] bg-[#F9F6F2] p-4 sm:p-5">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#1F1816]">
                  Personalize Your Order
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-[#6E625C]">
                  Please enter the details exactly as you want
                  them printed.
                </p>
              </div>

              {/* Custom Name */}
              {product.requiresCustomName && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1F1816]">
                    Custom Name{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="text"
                    maxLength={100}
                    value={customizationData.customName || ""}
                    onChange={(e) =>
                      updateCustomization(
                        "customName",
                        e.target.value
                      )
                    }
                    placeholder="Enter the name to be printed"
                    className="w-full rounded-xl border border-[#EFE8E2] bg-white px-4 py-3 text-sm text-[#1F1816] placeholder:text-[#A99D96] transition focus:outline-none focus:ring-2 focus:ring-[#C89A84]/50"
                  />
                </div>
              )}

              {/* Custom Message */}
              {product.requiresCustomMessage && (
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-sm font-medium text-[#1F1816]">
                    <span>
                      Custom Message{" "}
                      <span className="text-rose-500">*</span>
                    </span>

                    <span className="text-xs font-normal text-[#6E625C]">
                      {(customizationData.customMessage || "")
                        .length}
                      /500
                    </span>
                  </label>

                  <textarea
                    rows={4}
                    maxLength={500}
                    value={
                      customizationData.customMessage || ""
                    }
                    onChange={(e) =>
                      updateCustomization(
                        "customMessage",
                        e.target.value
                      )
                    }
                    placeholder="Write the message you want to be printed"
                    className="w-full resize-none rounded-xl border border-[#EFE8E2] bg-white px-4 py-3 text-sm text-[#1F1816] placeholder:text-[#A99D96] transition focus:outline-none focus:ring-2 focus:ring-[#C89A84]/50"
                  />
                </div>
              )}

              {/* Additional Notes */}
              {product.requiresAdditionalNotes && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1F1816]">
                    Additional Notes{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <textarea
                    rows={4}
                    maxLength={1000}
                    value={
                      customizationData.additionalNotes || ""
                    }
                    onChange={(e) =>
                      updateCustomization(
                        "additionalNotes",
                        e.target.value
                      )
                    }
                    placeholder="Any special instructions for your order..."
                    className="w-full resize-none rounded-xl border border-[#EFE8E2] bg-white px-4 py-3 text-sm text-[#1F1816] placeholder:text-[#A99D96] transition focus:outline-none focus:ring-2 focus:ring-[#C89A84]/50"
                  />
                </div>
              )}

              {/* Delivery Date */}
              {product.requiresDeliveryDate && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1F1816]">
                    Preferred Delivery Date{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="date"
                    value={
                      customizationData.deliveryDate || ""
                    }
                    onChange={(e) =>
                      updateCustomization(
                        "deliveryDate",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-[#EFE8E2] bg-white px-4 py-3 text-sm text-[#1F1816] transition focus:outline-none focus:ring-2 focus:ring-[#C89A84]/50"
                  />
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------
              MULTI PHOTO UPLOAD
              ------------------------------------------------- */}

          {(requiresPhoto || photoMaxCount > 0) && (
            <div className="space-y-2 border-t border-[#EFE8E2] pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1F1816]">
                    {getPhotoLabel()}
                    {requiresPhoto && (
                      <span className="ml-1 text-rose-500">
                        *
                      </span>
                    )}
                  </label>

                  <p className="mt-1 text-xs leading-relaxed text-[#6E625C]">
                    {photoMinCount === photoMaxCount &&
                    photoMinCount > 1
                      ? `Please upload exactly ${photoMinCount} photos.`
                      : photoMaxCount > 1
                        ? `Select multiple photos together. ${photoMinCount > 0 ? `At least ${photoMinCount} required. ` : ""}Maximum ${photoMaxCount}.`
                        : requiresPhoto
                          ? "Please upload your photo before adding the product to cart."
                          : "You may upload a photo if needed."}
                  </p>
                </div>

                {photoMaxCount > 0 && (
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6E625C]">
                    {photoUrls.length}/{photoMaxCount}
                  </span>
                )}
              </div>

              <div className="rounded-2xl border-2 border-dashed border-[#EFE8E2] bg-[#F9F6F2] p-4 transition hover:border-[#C89A84] sm:p-5">
                {/* Uploaded photos */}
                {photoUrls.length > 0 && (
                  <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {photoUrls.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="group relative overflow-hidden rounded-xl border border-[#EFE8E2] bg-white"
                      >
                        <img
                          src={url}
                          alt={`Uploaded customer photo ${index + 1}`}
                          className="aspect-square w-full object-cover"
                        />

                        <div className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-1 text-[10px] font-semibold text-white">
                          {index + 1}
                        </div>

                        <button
                          type="button"
                          onClick={() => removePhoto(url)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#6E625C] shadow-sm transition hover:bg-rose-50 hover:text-red-600"
                          title="Remove photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                {photoUrls.length < photoMaxCount && (
                  <>
                    {sessionStatus === "loading" ? (
                      <div className="flex flex-col items-center justify-center py-3">
                        <p className="text-xs text-[#6E625C]">
                          Checking login status...
                        </p>
                      </div>
                    ) : !session ? (
                      <div className="flex flex-col items-center justify-center py-3">
                        <ImagePlus className="mb-2 h-7 w-7 text-[#C89A84]" />

                        <p className="mb-3 text-center text-xs font-medium text-[#1F1816]">
                          Login required to upload photos
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            window.location.href =
                              "/login?callbackUrl=" +
                              encodeURIComponent(
                                window.location.pathname
                              );
                          }}
                          className="cursor-pointer rounded-xl bg-[#1F1816] px-5 py-2.5 text-xs font-medium text-[#F9F6F2] shadow-sm transition hover:bg-[#322724]"
                        >
                          Login to Upload
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <UploadButton<
                          OurFileRouter,
                          "customerPhotoUploader"
                        >
                          endpoint="customerPhotoUploader"
                          appearance={{
                            button:
                              "bg-[#1F1816] text-[#F9F6F2] font-medium text-xs px-5 py-2.5 rounded-xl hover:bg-[#322724] transition shadow-sm cursor-pointer ut-readying:bg-gray-400",
                            container:
                              "flex w-full flex-col items-center justify-center gap-2",
                            allowedContent:
                              "mt-1 text-center text-[11px] text-[#6E625C]",
                          }}
                          onBeforeUploadBegin={(files) => {
                            const remaining =
                              photoMaxCount -
                              photoUrls.length;

                            if (remaining <= 0) {
                              return [];
                            }

                            if (files.length > remaining) {
                              alert(
                                `This product allows a maximum of ${photoMaxCount} photos. Only ${remaining} more photo${remaining === 1 ? "" : "s"} can be uploaded.`
                              );

                              return files.slice(
                                0,
                                remaining
                              );
                            }

                            return files;
                          }}
                          onClientUploadComplete={(res: any[]) => {
                            handlePhotoUploadComplete(res);
                          }}
                          onUploadError={(error: Error) => {
                            alert(
                              `Upload failed: ${error.message}`
                            );
                          }}
                        />

                        <p className="mt-2 text-center text-[10px] leading-relaxed text-[#6E625C] sm:text-[11px]">
                          Select multiple photos together •
                          PNG/JPG up to 8MB each
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Max reached */}
                {photoUrls.length >= photoMaxCount &&
                  photoMaxCount > 0 && (
                    <div className="flex items-center justify-center gap-2 border-t border-[#EFE8E2] pt-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                      <span className="text-xs font-medium text-emerald-700">
                        {photoMaxCount === 1
                          ? "Photo attached successfully"
                          : `All ${photoMaxCount} photos uploaded successfully`}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* WhatsApp for CR */}
          {isCR && (
            <div className="space-y-2 border-t border-[#EFE8E2] pt-4">
              <label className="block text-sm font-medium text-[#1F1816]">
                WhatsApp Number{" "}
                <span className="text-red-500">*</span>
              </label>

              <p className="mb-2 text-xs leading-relaxed text-[#6E625C]">
                Required for custom consultation before order
                processing.
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
                    setQuantity(
                      Math.max(1, quantity - 1)
                    )
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
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
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
                {(Number(product.basePrice) * quantity).toFixed(
                  2
                )}
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
    </>
  );
}