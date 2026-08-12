"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";

export type ProductType = "QUICK_CUSTOMIZE" | "DESIGN_CONSULTATION";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isVisible: boolean;
  showOnHomepage: boolean;
  isFeatured: boolean;
  type: ProductType; // NAYA FIELD
  productCount?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showOnHomepage, setShowOnHomepage] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [type, setType] = useState<ProductType>("QUICK_CUSTOMIZE"); // NAYA STATE

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setSlug(cat.slug);
      setDescription(cat.description || "");
      setImageUrl(cat.imageUrl || "");
      setDisplayOrder(cat.displayOrder || 0);
      setIsVisible(cat.isVisible);
      setShowOnHomepage(cat.showOnHomepage);
      setIsFeatured(cat.isFeatured);
      setType(cat.type || "QUICK_CUSTOMIZE");
    } else {
      setEditingCategory(null);
      setName("");
      setSlug("");
      setDescription("");
      setImageUrl("");
      setDisplayOrder(categories.length);
      setIsVisible(true);
      setShowOnHomepage(true);
      setIsFeatured(false);
      setType("QUICK_CUSTOMIZE");
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description,
      imageUrl,
      displayOrder: Number(displayOrder),
      isVisible,
      showOnHomepage,
      isFeatured,
      type, // NAYA FIELD BACKEND KO BHEJ RAHE HAIN
    };

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchCategories();
        setIsModalOpen(false);
      } else {
        alert("Failed to save category");
      }
    } catch (error) {
      alert("Error saving category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  const toggleVisibility = async (cat: Category) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cat, isVisible: !cat.isVisible }),
      });
      if (res.ok) {
        setCategories(categories.map((c) => (c.id === cat.id ? { ...c, isVisible: !c.isVisible } : c)));
      }
    } catch (error) {
      alert("Failed to update visibility");
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Category Management</h1>
          <p className="text-sm text-[#6E625C]">Manage catalog categories, display order, and homepage visibility.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 bg-[#1F1816] text-[#F9F6F2] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#322724] transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#EFE8E2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F6F2]/60 border-b border-[#EFE8E2] text-xs font-semibold text-[#6E625C] uppercase tracking-wider">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Visibility</th>
                <th className="py-4 px-6">Products</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8E2] text-sm">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-[#6E625C]">Loading categories...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-[#6E625C]">No categories found. Create your first category.</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#F9F6F2]/40 transition">
                    <td className="py-4 px-6">
                      <div className="h-12 w-12 rounded-xl bg-[#F9F6F2] border border-[#EFE8E2] overflow-hidden flex-shrink-0 relative">
                        {cat.imageUrl ? (
                          <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[#8C7A72]"><ImageIcon className="w-5 h-5" /></div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#1F1816]">{cat.name}</td>
                    
                    {/* NAYA COLUMN: Category Type Display */}
                    <td className="py-4 px-6">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                         cat.type === "QUICK_CUSTOMIZE" ? "bg-amber-50 text-amber-800" : "bg-purple-50 text-purple-800"
                       }`}>
                         {cat.type === "QUICK_CUSTOMIZE" ? "Quick Customize" : "Consultation"}
                       </span>
                    </td>

                    <td className="py-4 px-6">
                      <button onClick={() => toggleVisibility(cat)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${cat.isVisible ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                        {cat.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {cat.isVisible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-4 px-6 font-medium text-[#2C2320]">{cat.productCount || 0} Products</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(cat)} className="p-2 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl border border-[#EFE8E2] my-8">
            <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#1F1816]">{editingCategory ? "Edit Category" : "Add New Category"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C]">Close</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* NAYA DROPDOWN: Category Type */}
              <div>
                <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Category Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as ProductType)}
                  className="w-full px-3 py-2 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
                >
                  <option value="QUICK_CUSTOMIZE">Quick Customize (Direct Checkout)</option>
                  <option value="DESIGN_CONSULTATION">Design Consultation (WhatsApp/DM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Category Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" placeholder="e.g. Memory Boxes" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" placeholder="e.g. memory-boxes" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" placeholder="Brief category description..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Category Image URL</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6E625C] uppercase mb-1">Display Order</label>
                  <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="w-full px-3 py-2 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]" />
                </div>
                <div className="flex flex-col justify-end space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2C2320]">
                    <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} className="rounded text-[#1F1816] focus:ring-[#C89A84]" /> Visible on Store
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2C2320]">
                    <input type="checkbox" checked={showOnHomepage} onChange={(e) => setShowOnHomepage(e.target.checked)} className="rounded text-[#1F1816] focus:ring-[#C89A84]" /> Show on Homepage
                  </label>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C]">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium bg-[#1F1816] text-[#F9F6F2] hover:bg-[#322724]">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}