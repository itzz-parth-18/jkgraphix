"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddCategoryPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    displayOrder: 0,
    isVisible: true,
    showOnHomepage: false,
    isFeatured: false,
  });

  const handleNameChange = (val: string) => {
    setFormData({
      ...formData,
      name: val,
      slug: val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        alert("Failed to save category");
      }
    } catch (error) {
      alert("An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6 md:p-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-6">
        <div className="space-y-1">
          <Link href="/admin/categories" className="text-xs font-semibold text-[#6E625C] hover:text-[#1F1816] flex items-center gap-1.5 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Categories
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Add New Category</h1>
          <p className="text-sm text-[#6E625C]">Organize collection details, display order, and homepage features.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">Category Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Memory Boxes"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Short Description</label>
            <textarea
              rows={3}
              placeholder="Brief summary of this collection..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Category Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1F1816] border-b border-[#EFE8E2] pb-3">Visibility & Homepage</h2>

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Visibility Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={() => setFormData({ ...formData, isVisible: true })}
                  className="text-[#C89A84]"
                />
                <span className="text-sm font-medium text-[#2C2320]">Visible</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="isVisible"
                  checked={!formData.isVisible}
                  onChange={() => setFormData({ ...formData, isVisible: false })}
                  className="text-[#C89A84]"
                />
                <span className="text-sm font-medium text-[#2C2320]">Hidden</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded text-[#C89A84] focus:ring-[#C89A84]"
              />
              <span className="text-sm font-medium text-[#2C2320]">Featured Category</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/categories"
            className="px-6 py-2.5 rounded-xl border border-[#EFE8E2] text-sm font-medium text-[#6E625C] hover:bg-white transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#1F1816] text-[#F9F6F2] px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-[#322724] transition shadow-sm disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}