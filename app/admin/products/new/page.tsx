// ==========================================
// Add New Product Page with File Upload
// Location: app/admin/products/new/page.tsx
// ==========================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [sku, setSku] = useState(`SKU-${Date.now()}`);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("PUBLISHED");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          basePrice: Number(basePrice) || 0,
          sku,
          imageUrl,
          status,
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const errData = await res.json();
        alert("Failed to save product: " + (errData.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error saving product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-xl bg-white border border-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Add New Product</h1>
            <p className="text-sm text-[#6E625C]">Create a new item in your catalog with pricing and status.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Product Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Memory Box" className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Price (₹)</label>
            <input type="number" required value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="0" className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" />
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
            <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Product Image (Choose File)</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm text-[#6E625C] hover:bg-[#EFE8E2] cursor-pointer transition">
                <Upload className="w-4 h-4" />
                <span>Choose Image File</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            {imageUrl && (
              <div className="mt-2 flex items-center gap-3">
                <img src={imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-[#EFE8E2]" />
                <span className="text-xs text-emerald-700 font-medium">Image attached</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" />
          </div>
        </div>

        <div className="pt-4 border-t border-[#EFE8E2] flex justify-end gap-3">
          <Link href="/admin/products" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C]">Cancel</Link>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[#1F1816] text-[#F9F6F2] hover:bg-[#322724] transition shadow-sm">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}