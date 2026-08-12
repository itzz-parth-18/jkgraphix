"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Image as ImageIcon, X } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]); // NAYA STATE CATEGORIES KE LIYE

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "", // 'category' string ki jagah 'categoryId' use karenge
    price: 0,
    shortDescription: "",
    fullDescription: "",
    thumbnailUrl: "",
    galleryUrls: [] as string[],
    productType: "QUICK_CUSTOMIZE",
    requiresPhoto: false,
    allowMultiplePhotos: false,
    requiresCustomName: false,
    requiresCustomMessage: false,
    requiresAdditionalNotes: false,
    requiresDeliveryDate: false,
    status: "PUBLISHED",
    isFeatured: false,
    showOnHomepage: false,
    isSeasonal: false,
  });

  // NAYA FUNCTION: Database se categories fetch karne ke liye
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          // Agar categories available hain, toh pehli category ko default set kar do
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
          }
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, thumbnailUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            galleryUrls: [...prev.galleryUrls, reader.result as string],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const errData = await res.json();
        alert("Failed to save product: " + (errData.error || "Unknown error"));
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
          <Link href="/admin/products" className="text-xs font-semibold text-[#6E625C] hover:text-[#1F1816] flex items-center gap-1.5 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Add New Product</h1>
          <p className="text-sm text-[#6E625C]">Configure product details, custom fields, and visibility.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Product Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Heirloom Walnut Memory Box"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              >
                <option value="">Select a Category</option>
                {/* NAYA LOOP: Asli categories dikhane ke liye */}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              placeholder="2999"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full md:w-1/2 px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Short Description</label>
            <input
              type="text"
              placeholder="Brief summary for product cards..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Full Description</label>
            <textarea
              rows={4}
              placeholder="Detailed explanation of craftsmanship, materials, and features..."
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">Product Images</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Thumbnail Image (Choose File)</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm text-[#6E625C] hover:bg-[#EFE8E2] cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>Choose Thumbnail</span>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                </label>
              </div>
              {formData.thumbnailUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={formData.thumbnailUrl} alt="Thumbnail Preview" className="w-12 h-12 object-cover rounded-lg border border-[#EFE8E2]" />
                  <span className="text-xs text-emerald-700 font-medium">Thumbnail attached</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Gallery Images (Choose Files)</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm text-[#6E625C] hover:bg-[#EFE8E2] cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>Choose Gallery Images</span>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
                </label>
              </div>
              {formData.galleryUrls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.galleryUrls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt={`Gallery ${idx}`} className="w-12 h-12 object-cover rounded-lg border border-[#EFE8E2]" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">Product Type</h2>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 cursor-pointer hover:border-[#C89A84] transition">
              <input
                type="radio"
                name="productType"
                checked={formData.productType === "QUICK_CUSTOMIZE"}
                onChange={() => setFormData({ ...formData, productType: "QUICK_CUSTOMIZE" })}
                className="mt-1 text-[#C89A84] focus:ring-[#C89A84]"
              />
              <div>
                <p className="font-semibold text-[#1F1816]">Quick Customize</p>
                <p className="text-xs text-[#6E625C]">Customer customizes and orders directly on the website.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 cursor-pointer hover:border-[#C89A84] transition">
              <input
                type="radio"
                name="productType"
                checked={formData.productType === "DESIGN_CONSULTATION"}
                onChange={() => setFormData({ ...formData, productType: "DESIGN_CONSULTATION" })}
                className="mt-1 text-[#C89A84] focus:ring-[#C89A84]"
              />
              <div>
                <p className="font-semibold text-[#1F1816]">Design Consultation</p>
                <p className="text-xs text-[#6E625C]">Customer submits a design request and our team contacts them personally.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">Customization Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresPhoto}
                onChange={(e) => setFormData({ ...formData, requiresPhoto: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Requires Photo Upload</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowMultiplePhotos}
                onChange={(e) => setFormData({ ...formData, allowMultiplePhotos: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Allow Multiple Photos</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresCustomName}
                onChange={(e) => setFormData({ ...formData, requiresCustomName: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Requires Custom Name</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresCustomMessage}
                onChange={(e) => setFormData({ ...formData, requiresCustomMessage: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Requires Custom Message</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresAdditionalNotes}
                onChange={(e) => setFormData({ ...formData, requiresAdditionalNotes: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Requires Additional Notes</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresDeliveryDate}
                onChange={(e) => setFormData({ ...formData, requiresDeliveryDate: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Requires Delivery Date</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">Visibility & Homepage</h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Featured Product</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showOnHomepage}
                onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Show on Homepage</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isSeasonal}
                onChange={(e) => setFormData({ ...formData, isSeasonal: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Seasonal Collection</span>
            </label>
          </div>
        </div>

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