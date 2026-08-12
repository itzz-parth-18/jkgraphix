"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, UploadCloud, Trash2 } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function EditPortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    // Fetch categories and portfolio item data
    Promise.all([
      fetch("/api/admin/categories").then((res) => res.json()),
      fetch("/api/admin/portfolio").then((res) => res.json()),
    ])
      .then(([catData, portfolioData]) => {
        if (Array.isArray(catData)) setCategories(catData);
        const item = portfolioData.find((i: any) => i.id === id);
        if (item) {
          setTitle(item.title);
          setDescription(item.description || "");
          setCategory(item.category);
          setImageUrl(item.imageUrl);
          setPublished(item.published);
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, imageUrl, published }),
      });

      if (!res.ok) throw new Error("Failed to update");

      router.push("/admin/portfolio");
      router.refresh();
    } catch (err) {
      alert("Error updating item");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/portfolio");
      router.refresh();
    } catch (err) {
      alert("Error deleting item");
    }
  }

  if (fetching) {
    return <div className="p-12 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/portfolio" className="p-2 rounded-xl bg-white border border-[#EFE8E2] hover:bg-[#C89A84] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Edit Portfolio Item</h1>
        </div>
        <button 
          type="button" 
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>

      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1F1816]">Project Title*</label>
          <input 
            type="text" 
            required 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full px-5 py-3.5 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 focus:outline-none focus:border-[#C89A84]" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1F1816]">Category*</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full px-5 py-3.5 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 focus:outline-none focus:border-[#C89A84]"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1F1816]">Description (Optional)</label>
          <textarea 
            rows={3} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full px-5 py-3.5 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 focus:outline-none focus:border-[#C89A84] resize-none"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1F1816]">Project Image*</label>
          {imageUrl ? (
            <div className="relative h-48 w-full rounded-xl overflow-hidden border border-[#EFE8E2] bg-[#F9F6F2]">
              <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setImageUrl("")} 
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#EFE8E2] p-8 rounded-2xl text-center space-y-4 bg-white shadow-sm">
  <UploadCloud className="w-10 h-10 text-[#C89A84] mx-auto" />
  <div className="space-y-1">
    <p className="text-sm font-bold text-[#1F1816]">Upload project banner or photo</p>
    <p className="text-xs text-[#6E625C]">Supports PNG, JPG up to 8MB</p>
  </div>
  <div className="flex justify-center pt-2">
    <div className="bg-[#1F1816] text-white rounded-xl px-4 py-2 inline-block">
      <UploadButton<OurFileRouter, "customerPhotoUploader">
        endpoint="customerPhotoUploader"
        onClientUploadComplete={(res: any) => {
          if (res && res[0]) {
            setImageUrl(res[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  </div>
</div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="published" 
            checked={published} 
            onChange={(e) => setPublished(e.target.checked)} 
            className="w-5 h-5 accent-[#1F1816]" 
          />
          <label htmlFor="published" className="text-sm font-medium text-[#1F1816]">Visible on public portfolio page</label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#1F1816] text-white font-medium py-4 rounded-xl hover:bg-[#C89A84] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Portfolio Item"}
        </button>
      </form>
    </div>
  );
}