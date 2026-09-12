"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X, GripVertical } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

export default function AddProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: 0,
    shortDescription: "",
    fullDescription: "",
    thumbnailUrl: "",
    galleryUrls: [] as string[],
    productType: "QUICK_CUSTOMIZE",

    // Product customization options
    requiresPhoto: false,
    allowMultiplePhotos: false,
    photoMinCount: 0,
    photoMaxCount: 1,
    requiresCustomName: false,
    requiresCustomMessage: false,
    requiresAdditionalNotes: false,
    requiresDeliveryDate: false,

    // Product status / visibility
    status: "PUBLISHED",
    isFeatured: false,
    showOnHomepage: false,
    isSeasonal: false,
  });

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");

        if (res.ok) {
          const data = await res.json();
          setCategories(data);

          if (data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              categoryId: data[0].id,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleThumbnailUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnailUrl: url,
    }));
  };

  const handleGalleryUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      galleryUrls: [...prev.galleryUrls, url],
    }));
  };

  const handleGalleryMultipleUpload = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      galleryUrls: [...prev.galleryUrls, ...urls],
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((_, i) => i !== index),
    }));
  };

  const moveGalleryImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setFormData((prev) => {
      const next = [...prev.galleryUrls];
      const [moved] = next.splice(fromIndex, 1);

      if (!moved) return prev;

      next.splice(toIndex, 0, moved);

      return {
        ...prev,
        galleryUrls: next,
      };
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
      sourceIndex >= formData.galleryUrls.length
    ) {
      return;
    }

    moveGalleryImage(sourceIndex, targetIndex);
  };

  const handleRequiresPhotoChange = (checked: boolean) => {
    setFormData((prev) => {
      if (!checked) {
        return {
          ...prev,
          requiresPhoto: false,
          photoMinCount: 0,
        };
      }

      return {
        ...prev,
        requiresPhoto: true,
        photoMinCount: Math.max(1, prev.photoMinCount),
      };
    });
  };

  const handleAllowMultiplePhotosChange = (checked: boolean) => {
    setFormData((prev) => {
      if (!checked) {
        return {
          ...prev,
          allowMultiplePhotos: false,
          photoMaxCount: 1,
          photoMinCount: prev.requiresPhoto ? 1 : 0,
        };
      }

      return {
        ...prev,
        allowMultiplePhotos: true,
        photoMaxCount: Math.max(2, prev.photoMaxCount),
        photoMinCount: prev.requiresPhoto
          ? Math.max(1, prev.photoMinCount)
          : prev.photoMinCount,
      };
    });
  };

  const handlePhotoMinCountChange = (value: number) => {
    const safeValue = Math.max(0, Math.floor(value));

    setFormData((prev) => {
      const minCount = prev.requiresPhoto
        ? Math.max(1, safeValue)
        : safeValue;

      return {
        ...prev,
        photoMinCount: Math.min(minCount, prev.photoMaxCount),
      };
    });
  };

  const handlePhotoMaxCountChange = (value: number) => {
    const safeValue = Math.max(1, Math.floor(value));

    setFormData((prev) => {
      const maxCount = prev.allowMultiplePhotos
        ? safeValue
        : 1;

      return {
        ...prev,
        photoMaxCount: Math.max(
          maxCount,
          prev.requiresPhoto ? Math.max(1, prev.photoMinCount) : 0
        ),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.thumbnailUrl) {
      alert("Please upload a thumbnail image.");
      return;
    }

    if (!formData.categoryId) {
      alert("Please select a category.");
      return;
    }

    // Normalize photo configuration before submitting.
    let photoMinCount = formData.requiresPhoto
      ? Math.max(1, formData.photoMinCount)
      : 0;

    let photoMaxCount = formData.allowMultiplePhotos
      ? Math.max(1, formData.photoMaxCount)
      : 1;

    if (photoMinCount > photoMaxCount) {
      photoMaxCount = photoMinCount;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        photoMinCount,
        photoMaxCount,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const errData = await res.json();

        alert(
          "Failed to save product: " +
            (errData.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 md:p-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-6">
        <div className="space-y-1">
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-[#6E625C] hover:text-[#1F1816] flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Products
          </Link>

          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">
            Add New Product
          </h1>

          <p className="text-sm text-[#6E625C]">
            Configure product details, custom fields, and visibility.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BASIC INFORMATION */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
                Product Name
              </label>

              <input
                type="text"
                required
                placeholder="e.g. Heirloom Walnut Memory Box"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
                Category
              </label>

              <select
                value={formData.categoryId}
                onChange={(e) => {
                  const selectedCategory = categories.find(
                    (cat) => cat.id === e.target.value
                  );

                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                    productType:
                      selectedCategory?.type || "QUICK_CUSTOMIZE",
                  });
                }}
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              >
                <option value="">Select a Category</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
              Price (â‚¹)
            </label>

            <input
              type="number"
              required
              min="0"
              placeholder="2999"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number(e.target.value),
                })
              }
              className="w-full md:w-1/2 px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
              Short Description
            </label>

            <input
              type="text"
              placeholder="Brief summary for product cards..."
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shortDescription: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
              Full Description
            </label>

            <textarea
              rows={4}
              placeholder="Detailed explanation of craftsmanship, materials, and features..."
              value={formData.fullDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fullDescription: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
            />
          </div>
        </div>

        {/* PRODUCT IMAGES */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">
            Product Images
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* THUMBNAIL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
                Thumbnail Image
              </label>

              <ImageUploader
                endpoint="customerPhotoUploader"
                onUploadComplete={handleThumbnailUpload}
              />

              {formData.thumbnailUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-[#EFE8E2]"
                  />

                  <span className="text-xs text-emerald-700 font-medium">
                    Thumbnail attached
                  </span>
                </div>
              )}
            </div>

            {/* GALLERY */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
                Gallery Images
              </label>

              <ImageUploader
                endpoint="customerPhotoUploader"
                onUploadComplete={handleGalleryUpload}
                onMultipleUploadComplete={handleGalleryMultipleUpload}
              />

              <p className="text-[11px] text-[#6E625C]">
                Select multiple images at once. Drag the thumbnails to change
                their order.
              </p>

              {formData.galleryUrls.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-3">
                    {formData.galleryUrls.map((url, idx) => (
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
                          onClick={() => removeGalleryImage(idx)}
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
        </div>

        {/* PRODUCT TYPE */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">
            Product Type
          </h2>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 cursor-pointer hover:border-[#C89A84] transition">
              <input
                type="radio"
                name="productType"
                checked={
                  formData.productType === "QUICK_CUSTOMIZE"
                }
                onChange={() =>
                  setFormData({
                    ...formData,
                    productType: "QUICK_CUSTOMIZE",
                  })
                }
                className="mt-1 text-[#C89A84] focus:ring-[#C89A84]"
                disabled
              />

              <div>
                <p className="font-semibold text-[#1F1816]">
                  Quick Customize
                </p>

                <p className="text-xs text-[#6E625C]">
                  Customer customizes and orders directly on the website.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 cursor-pointer hover:border-[#C89A84] transition">
              <input
                type="radio"
                name="productType"
                checked={
                  formData.productType === "DESIGN_CONSULTATION"
                }
                onChange={() =>
                  setFormData({
                    ...formData,
                    productType: "DESIGN_CONSULTATION",
                  })
                }
                className="mt-1 text-[#C89A84] focus:ring-[#C89A84]"
                disabled
              />

              <div>
                <p className="font-semibold text-[#1F1816]">
                  Design Consultation
                </p>

                <p className="text-xs text-[#6E625C]">
                  Customer submits a design request and our team contacts
                  them personally.
                </p>
              </div>
            </label>
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
                checked={formData.requiresPhoto}
                onChange={(e) =>
                  handleRequiresPhotoChange(e.target.checked)
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
                checked={formData.allowMultiplePhotos}
                onChange={(e) =>
                  handleAllowMultiplePhotosChange(e.target.checked)
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Allow Multiple Photos
              </span>
            </label>

            {/* PHOTO COUNT CONFIG */}
            {(formData.requiresPhoto ||
              formData.allowMultiplePhotos) && (
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
                      min={formData.requiresPhoto ? 1 : 0}
                      max={formData.photoMaxCount}
                      value={formData.photoMinCount}
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
                      min={formData.allowMultiplePhotos ? 2 : 1}
                      value={formData.photoMaxCount}
                      onChange={(e) =>
                        handlePhotoMaxCountChange(
                          Number(e.target.value)
                        )
                      }
                      disabled={!formData.allowMultiplePhotos}
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
                checked={formData.requiresCustomName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiresCustomName: e.target.checked,
                  })
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
                checked={formData.requiresCustomMessage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiresCustomMessage: e.target.checked,
                  })
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
                checked={formData.requiresAdditionalNotes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiresAdditionalNotes: e.target.checked,
                  })
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
                checked={formData.requiresDeliveryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiresDeliveryDate: e.target.checked,
                  })
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

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
              className="w-full md:w-1/2 px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isFeatured: e.target.checked,
                  })
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Featured Product
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showOnHomepage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    showOnHomepage: e.target.checked,
                  })
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Show on Homepage
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E8] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isSeasonal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isSeasonal: e.target.checked,
                  })
                }
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />

              <span className="text-sm font-medium text-[#2C2320]">
                Seasonal Collection
              </span>
            </label>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 rounded-xl border border-[#EFE8E2] text-sm font-medium text-[#6E625C] hover:bg-white transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#1F1816] text-[#F9F6F2] px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-[#322724] transition shadow-sm disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}