"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function NewPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setCategory(data[0].name);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, imageUrl, published }),
      });

      if (!res.ok) throw new Error("Failed to create");

      router.push("/admin/portfolio");
      router.refresh();
    } catch (err) {
      alert("Error creating portfolio item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex items-center gap-4">
        <Link href="/admin/portfolio" className="p-2 rounded-xl bg-white border border-[#EFE8E2] hover:bg-[#C89A84] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Add Portfolio Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1F1816]">Project Title*</label>
          <input 
            type="text" 
            required 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Luxury Foil Wedding Invitation" 
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
            placeholder="Short details about the project..." 
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
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Portfolio Item"}
        </button>
      </form>
    </div>
  );
}