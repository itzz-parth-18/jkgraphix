"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, GripVertical } from "lucide-react";
import Link from "next/link";
import CustomFieldsEditor from "@/components/admin/products/CustomFieldsEditor";
import ImageUploader from "@/components/ImageUploader";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [sku, setSku] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [status, setStatus] = useState("PUBLISHED");
  const [productType, setProductType] = useState("QUICK_CUSTOMIZE");

  // Product customization options
  const [requiresPhoto, setRequiresPhoto] = useState(false);
  const [allowMultiplePhotos, setAllowMultiplePhotos] = useState(false);
  const [photoMinCount, setPhotoMinCount] = useState(0);
  const [photoMaxCount, setPhotoMaxCount] = useState(1);

  const [requiresCustomName, setRequiresCustomName] = useState(false);
  const [requiresCustomMessage, setRequiresCustomMessage] =
    useState(false);
  const [requiresAdditionalNotes, setRequiresAdditionalNotes] =
    useState(false);
  const [requiresDeliveryDate, setRequiresDeliveryDate] =
    useState(false);

  // Visibility
  const [isFeatured, setIsFeatured] = useState(false);
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [isSeasonal, setIsSeasonal] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");

      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch("/api/admin/products");

      if (res.ok) {
        const products = await res.json();
        const product = products.find(
          (p: any) => p.id === id
        );

        if (product) {
          setName(product.name || "");
          setCategoryId(product.categoryId || "");
          setDescription(product.description || "");
          setBasePrice(
            product.basePrice
              ? product.basePrice.toString()
              : ""
          );
          setSku(product.sku || "");
          setImageUrl(product.imageUrl || "");
          setGalleryUrls(
            Array.isArray(product.galleryUrls)
              ? product.galleryUrls.filter(
                  (url: unknown): url is string =>
                    typeof url === "string" && url.trim().length > 0
                )
              : []
          );
          setStatus(product.status || "PUBLISHED");
          setProductType(
            product.productType || "QUICK_CUSTOMIZE"
          );

          // Visibility
          setIsFeatured(Boolean(product.isFeatured));
          setShowOnHomepage(
            Boolean(product.showOnHomepage)
          );
          setIsSeasonal(Boolean(product.isSeasonal));

          // Product customization options
          const productRequiresPhoto =
            Boolean(product.requiresPhoto);

          const productAllowMultiplePhotos =
            Boolean(product.allowMultiplePhotos);

          let minCount = Number(
            product.photoMinCount ?? 0
          );

          let maxCount = Number(
            product.photoMaxCount ??
              product.maxPhotoUploads ??
              1
          );

          if (productRequiresPhoto) {
            minCount = Math.max(1, minCount);
          } else {
            minCount = Math.max(0, minCount);
          }

          if (productAllowMultiplePhotos) {
            maxCount = Math.max(2, maxCount);
          } else {
            maxCount = 1;
          }

          if (minCount > maxCount) {
            minCount = maxCount;
          }

          setRequiresPhoto(productRequiresPhoto);
          setAllowMultiplePhotos(
            productAllowMultiplePhotos
          );
          setPhotoMinCount(minCount);
          setPhotoMaxCount(maxCount);

          setRequiresCustomName(
            Boolean(product.requiresCustomName)
          );
          setRequiresCustomMessage(
            Boolean(product.requiresCustomMessage)
          );
          setRequiresAdditionalNotes(
            Boolean(product.requiresAdditionalNotes)
          );
          setRequiresDeliveryDate(
            Boolean(product.requiresDeliveryDate)
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequiresPhotoChange = (
    checked: boolean
  ) => {
    setRequiresPhoto(checked);

    if (!checked) {
      setPhotoMinCount(0);
      return;
    }

    setPhotoMinCount((current) =>
      Math.max(1, current)
    );
  };

  const handleAllowMultiplePhotosChange = (
    checked: boolean
  ) => {
    setAllowMultiplePhotos(checked);

    if (!checked) {
      setPhotoMaxCount(1);
      setPhotoMinCount(
        requiresPhoto ? 1 : 0
      );
      return;
    }

    setPhotoMaxCount((current) =>
      Math.max(2, current)
    );

    if (requiresPhoto) {
      setPhotoMinCount((current) =>
        Math.max(1, current)
      );
    }
  };

  const handlePhotoMinCountChange = (
    value: number
  ) => {
    const safeValue = Math.max(
      0,
      Math.floor(value)
    );

    const normalizedValue = requiresPhoto
      ? Math.max(1, safeValue)
      : safeValue;

    setPhotoMinCount(
      Math.min(normalizedValue, photoMaxCount)
    );
  };

  const handlePhotoMaxCountChange = (
    value: number
  ) => {
    if (!allowMultiplePhotos) {
      setPhotoMaxCount(1);
      return;
    }

    const safeValue = Math.max(
      2,
      Math.floor(value)
    );

    setPhotoMaxCount(
      Math.max(
        safeValue,
        requiresPhoto
          ? Math.max(1, photoMinCount)
          : photoMinCount
      )
    );
  };

  const handleGalleryUpload = (url: string) => {
    setGalleryUrls((prev) => [...prev, url]);
  };

  const handleGalleryMultipleUpload = (urls: string[]) => {
    setGalleryUrls((prev) => [...prev, ...urls]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryUrls((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const moveGalleryImage = (
    fromIndex: number,
    toIndex: number
  ) => {
    if (fromIndex === toIndex) return;

    setGalleryUrls((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);

      if (!moved) return prev;

      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleGalleryDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleGalleryDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();

    const sourceIndex = Number(
      e.dataTransfer.getData("text/plain")
    );

    if (
      !Number.isInteger(sourceIndex) ||
      sourceIndex < 0 ||
      sourceIndex >= galleryUrls.length
    ) {
      return;
    }

    moveGalleryImage(sourceIndex, targetIndex);
  };

  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!categoryId) {
      alert("Please select a category.");
      return;
    }

    // Normalize photo configuration.
    let finalPhotoMinCount = requiresPhoto
      ? Math.max(1, photoMinCount)
      : 0;

    let finalPhotoMaxCount = allowMultiplePhotos
      ? Math.max(2, photoMaxCount)
      : 1;

    if (finalPhotoMinCount > finalPhotoMaxCount) {
      finalPhotoMaxCount = finalPhotoMinCount;
    }

    setSaving(true);

    try {
      const res = await fetch(
        `/api/admin/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            categoryId,
            description,
            basePrice: Number(basePrice) || 0,
            sku,
            imageUrl,
            galleryUrls,
            status,
            productType,

            // Visibility
            isFeatured,
            showOnHomepage,
            isSeasonal,

            // Product customization
            requiresPhoto,
            allowMultiplePhotos,
            photoMinCount: finalPhotoMinCount,
            photoMaxCount: finalPhotoMaxCount,
            requiresCustomName,
            requiresCustomMessage,
            requiresAdditionalNotes,
            requiresDeliveryDate,
          }),
        }
      );

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const errData = await res.json();

        alert(
          "Failed to update product: " +
            (errData.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#6E625C] bg-[#F9F6F2] min-h-screen">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 md:p-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white border border-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1F1816]">
              Edit Product
            </h1>

            <p className="text-sm text-[#6E625C]">
              Update catalog item information, pricing, and status.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="space-y-6"
      >
        {/* BASIC INFORMATION */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">
                Product Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">
                Category
              </label>

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              >
                <option value="">
                  Select a Category
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">
                Price (â‚¹)
              </label>

              <input
                type="number"
                required
                min="0"
                value={basePrice}
                onChange={(e) =>
                  setBasePrice(e.target.value)
                }
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">
                SKU
              </label>

              <input
                type="text"
                required
                value={sku}
                onChange={(e) =>
                  setSku(e.target.value)
                }
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              >
                <option value="PUBLISHED">
                  Published
                </option>
                <option value="DRAFT">
                  Draft
                </option>
                <option value="OUT_OF_STOCK">
                  Out of Stock
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">
                Product Type
              </label>

              <select
                value={productType}
                onChange={(e) =>
                  setProductType(e.target.value)
                }
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              >
                <option value="QUICK_CUSTOMIZE">
                  Quick Customize
                </option>
                <option value="DESIGN_CONSULTATION">
                  Design Consultation
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">
                Product Image
              </label>

              <div className="space-y-3">
                <ImageUploader
                  onUploadComplete={(url) =>
                    setImageUrl(url)
                  }
                />

                {imageUrl && (
                  <div className="flex items-center gap-3 p-3 bg-white border border-[#EFE8E2] rounded-xl">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-[#EFE8E2]"
                    />

                    <div className="flex-1 truncate">
                      <p className="text-xs font-medium text-emerald-700">
                        Image uploaded successfully
                      </p>

                      <p className="text-xs text-[#6E625C] truncate">
                        {imageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">
                Gallery Images
              </label>

              <div className="space-y-3">
                <ImageUploader
                  endpoint="customerPhotoUploader"
                  onUploadComplete={handleGalleryUpload}
                  onMultipleUploadComplete={handleGalleryMultipleUpload}
                />

                <p className="text-[11px] text-[#6E625C]">
                  Select multiple images at once. Drag the thumbnails to change
                  their order.
                </p>

                {galleryUrls.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-3">
                      {galleryUrls.map((url, idx) => (
                        <div
                          key={`${url}-${idx}`}
                          draggable
                          onDragStart={(e) =>
                            handleGalleryDragStart(e, idx)
                          }
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                          }}
                          onDrop={(e) =>
                            handleGalleryDrop(e, idx)
                          }
                          className="relative group w-20 h-20 rounded-xl border border-[#EFE8E2] bg-white overflow-visible cursor-grab active:cursor-grabbing shadow-sm"
                          title="Drag to reorder"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover rounded-xl"
                          />

                          <div className="absolute left-1 top-1 bg-black/60 text-white rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
                            {idx + 1}
                          </div>

                          <div className="absolute bottom-1 left-1 bg-white/90 text-[#6E625C] rounded-md p-1 shadow">
                            <GripVertical className="w-3 h-3" />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeGalleryImage(idx)
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 z-10"
                            aria-label={`Remove gallery image ${idx + 1}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">
                Description
              </label>

              <textarea
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>
          </div>
        </div>

        {/* CUSTOMIZATION OPTIONS */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">
              Customization Options
            </h2>

            <p className="text-xs text-[#6E625C] mt-3">
              Configure what information the customer must provide before
              adding this product to the cart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PHOTO */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresPhoto}
                onChange={(e) =>
                  handleRequiresPhotoChange(
                    e.target.checked
                  )
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Requires Photo Upload
              </span>
            </label>

            {/* MULTIPLE PHOTOS */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={allowMultiplePhotos}
                onChange={(e) =>
                  handleAllowMultiplePhotosChange(
                    e.target.checked
                  )
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Allow Multiple Photos
              </span>
            </label>

            {/* PHOTO COUNT CONFIG */}
            {(requiresPhoto ||
              allowMultiplePhotos) && (
              <div className="md:col-span-2 p-4 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[#1F1816]">
                    Photo Count
                  </p>

                  <p className="text-xs text-[#6E625C] mt-1">
                    Set how many photos the customer must or may upload.
                    Selecting multiple photos will still use one file picker
                    on the customer side.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
                      Minimum Photos
                    </label>

                    <input
                      type="number"
                      min={requiresPhoto ? 1 : 0}
                      max={photoMaxCount}
                      value={photoMinCount}
                      onChange={(e) =>
                        handlePhotoMinCountChange(
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
                      Maximum Photos
                    </label>

                    <input
                      type="number"
                      min={
                        allowMultiplePhotos ? 2 : 1
                      }
                      value={photoMaxCount}
                      onChange={(e) =>
                        handlePhotoMaxCountChange(
                          Number(e.target.value)
                        )
                      }
                      disabled={!allowMultiplePhotos}
                      className="w-full px-4 py-2.5 bg-white border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-[#6E625C]">
                  Example: for exactly 8 photos, set Minimum = 8 and
                  Maximum = 8.
                </div>
              </div>
            )}

            {/* NAME */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresCustomName}
                onChange={(e) =>
                  setRequiresCustomName(
                    e.target.checked
                  )
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Requires Custom Name
              </span>
            </label>

            {/* MESSAGE */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresCustomMessage}
                onChange={(e) =>
                  setRequiresCustomMessage(
                    e.target.checked
                  )
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Requires Custom Message
              </span>
            </label>

            {/* NOTES */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresAdditionalNotes}
                onChange={(e) =>
                  setRequiresAdditionalNotes(
                    e.target.checked
                  )
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Requires Additional Notes
              </span>
            </label>

            {/* DELIVERY DATE */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresDeliveryDate}
                onChange={(e) =>
                  setRequiresDeliveryDate(
                    e.target.checked
                  )
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Requires Delivery Date
              </span>
            </label>
          </div>
        </div>

        {/* VISIBILITY */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">
            Visibility & Homepage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) =>
                  setIsFeatured(e.target.checked)
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Featured Product
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={showOnHomepage}
                onChange={(e) =>
                  setShowOnHomepage(e.target.checked)
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Show on Homepage
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={isSeasonal}
                onChange={(e) =>
                  setIsSeasonal(e.target.checked)
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Seasonal Collection
              </span>
            </label>
          </div>
        </div>

        {/* ADVANCED CUSTOM FIELDS */}
        <CustomFieldsEditor productId={id} />

        {/* ACTIONS */}
        <div className="pt-4 flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#F9F6F2] border border-[#EFE8E2] hover:bg-white text-[#6E625C]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[#1F1816] text-[#F9F6F2] hover:bg-[#322724] transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />

            {saving
              ? "Saving..."
              : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}