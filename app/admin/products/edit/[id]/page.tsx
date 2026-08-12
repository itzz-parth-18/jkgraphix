"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import CustomFieldsEditor from "@/components/admin/products/CustomFieldsEditor";
import ImageUploader from "@/components/ImageUploader";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
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
  const [status, setStatus] = useState("PUBLISHED");
  const [productType, setProductType] = useState("QUICK_CUSTOMIZE");

  // Checkboxes States
  const [requiresPhoto, setRequiresPhoto] = useState(false);
  const [allowMultiplePhotos, setAllowMultiplePhotos] = useState(false);
  const [requiresCustomName, setRequiresCustomName] = useState(false);
  const [requiresCustomMessage, setRequiresCustomMessage] = useState(false);
  const [requiresAdditionalNotes, setRequiresAdditionalNotes] = useState(false);
  const [requiresDeliveryDate, setRequiresDeliveryDate] = useState(false);

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
        const product = products.find((p: any) => p.id === id);
        if (product) {
          setName(product.name || "");
          setCategoryId(product.categoryId || "");
          setDescription(product.description || "");
          setBasePrice(product.basePrice ? product.basePrice.toString() : "");
          setSku(product.sku || "");
          setImageUrl(product.imageUrl || "");
          setStatus(product.status || "PUBLISHED");
          setProductType(product.productType || "QUICK_CUSTOMIZE");
          
          setIsFeatured(product.isFeatured || false);
          setShowOnHomepage(product.showOnHomepage || false);
          setIsSeasonal(product.isSeasonal || false);
          
          setRequiresPhoto(product.requiresPhoto || false);
          setAllowMultiplePhotos(product.allowMultiplePhotos || false);
          setRequiresCustomName(product.requiresCustomName || false);
          setRequiresCustomMessage(product.requiresCustomMessage || false);
          setRequiresAdditionalNotes(product.requiresAdditionalNotes || false);
          setRequiresDeliveryDate(product.requiresDeliveryDate || false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          categoryId,
          description,
          basePrice: Number(basePrice) || 0,
          sku,
          imageUrl,
          status,
          productType,
          isFeatured,
          showOnHomepage,
          isSeasonal,
          requiresPhoto,
          allowMultiplePhotos,
          requiresCustomName,
          requiresCustomMessage,
          requiresAdditionalNotes,
          requiresDeliveryDate
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const errData = await res.json();
        alert("Failed to update product: " + (errData.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error updating product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-[#6E625C] bg-[#F9F6F2] min-h-screen">Loading product details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 md:p-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-xl bg-white border border-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Edit Product</h1>
            <p className="text-sm text-[#6E625C]">Update catalog item information, pricing, and status.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Product Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Category</label>
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)} 
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

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Price (₹)</label>
              <input type="number" required value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">SKU</label>
              <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]">
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Product Type</label>
              <select 
                value={productType} 
                onChange={(e) => setProductType(e.target.value)} 
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              >
                <option value="QUICK_CUSTOMIZE">Quick Customize</option>
                <option value="DESIGN_CONSULTATION">Design Consultation</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Product Image</label>
              <div className="space-y-3">
                <ImageUploader 
                  onUploadComplete={(url) => setImageUrl(url)} 
                />
                {imageUrl && (
                  <div className="flex items-center gap-3 p-3 bg-white border border-[#EFE8E2] rounded-xl">
                    <img src={imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-[#EFE8E2]" />
                    <div className="flex-1 truncate">
                      <p className="text-xs font-medium text-emerald-700">Image uploaded successfully</p>
                      <p className="text-xs text-[#6E625C] truncate">{imageUrl}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Description</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">Customization Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input type="checkbox" checked={requiresPhoto} onChange={(e) => setRequiresPhoto(e.target.checked)} className="rounded text-[#C89A84] focus:ring-[#C89A84]" />
              <span className="text-sm font-medium text-[#2C2320]">Requires Photo Upload</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input type="checkbox" checked={allowMultiplePhotos} onChange={(e) => setAllowMultiplePhotos(e.target.checked)} className="rounded text-[#C89A84] focus:ring-[#C89A84]" />
              <span className="text-sm font-medium text-[#2C2320]">Allow Multiple Photos</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input type="checkbox" checked={requiresCustomName} onChange={(e) => setRequiresCustomName(e.target.checked)} className="rounded text-[#C89A84] focus:ring-[#C89A84]" />
              <span className="text-sm font-medium text-[#2C2320]">Requires Custom Name</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input type="checkbox" checked={requiresCustomMessage} onChange={(e) => setRequiresCustomMessage(e.target.checked)} className="rounded text-[#C89A84] focus:ring-[#C89A84]" />
              <span className="text-sm font-medium text-[#2C2320]">Requires Custom Message</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input type="checkbox" checked={requiresAdditionalNotes} onChange={(e) => setRequiresAdditionalNotes(e.target.checked)} className="rounded text-[#C89A84] focus:ring-[#C89A84]" />
              <span className="text-sm font-medium text-[#2C2320]">Requires Additional Notes</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer">
              <input type="checkbox" checked={requiresDeliveryDate} onChange={(e) => setRequiresDeliveryDate(e.target.checked)} className="rounded text-[#C89A84] focus:ring-[#C89A84]" />
              <span className="text-sm font-medium text-[#2C2320]">Requires Delivery Date</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">Visibility & Homepage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer transition">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded text-[#C89A84] focus:ring-[#C89A84]" />
              <span className="text-sm font-medium text-[#2C2320]">Featured Product</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer transition">
              <input type="checkbox" checked={showOnHomepage} onChange={(e) => setShowOnHomepage(e.target.checked)} className="rounded text-[#C89A84] focus:ring-[#C89A84]" />
              <span className="text-sm font-medium text-[#2C2320]">Show on Homepage</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8E2] hover:bg-[#F9F6F2]/50 cursor-pointer transition">
              <input type="checkbox" checked={isSeasonal} onChange={(e) => setIsSeasonal(e.target.checked)} className="rounded text-[#C89A84] focus:ring-[#C89A84]" />
              <span className="text-sm font-medium text-[#2C2320]">Seasonal Collection</span>
            </label>
          </div>
        </div>

        <CustomFieldsEditor productId={id} />
        
        <div className="pt-4 flex justify-end gap-3">
          <Link href="/admin/products" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#F9F6F2] border border-[#EFE8E2] hover:bg-white text-[#6E625C]">Cancel</Link>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[#1F1816] text-[#F9F6F2] hover:bg-[#322724] transition shadow-sm">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}