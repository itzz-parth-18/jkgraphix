"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Search, ArrowUpDown, Edit3, Trash2, Eye, 
  Image as ImageIcon, CheckCircle2, EyeOff, Star, Layers 
} from "lucide-react";

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
  productCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "displayOrder" | "productCount">("displayOrder");
  const [loading, setLoading] = useState(true);

  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteAction, setDeleteAction] = useState<"reassign" | "delete_products">("reassign");
  const [reassignTargetId, setReassignTargetId] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      const res = await fetch(`/api/admin/categories/${deletingCategory.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: deleteAction, reassignTargetId }),
      });

      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== deletingCategory.id));
        setDeletingCategory(null);
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      alert("Error deleting category");
    }
  };

  const filteredCategories = categories
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "productCount") return b.productCount - a.productCount;
      return a.displayOrder - b.displayOrder;
    });

  return (
    <div className="space-y-8 p-6 md:p-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Category Management</h1>
          <p className="text-sm text-[#6E625C]">Organize your store collections, navigation, and homepage display.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 bg-[#1F1816] text-[#F9F6F2] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#322724] transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#EFE8E2] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A72]" />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <ArrowUpDown className="w-4 h-4 text-[#6E625C]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#F9F6F2] border border-[#EFE8E2] px-3 py-2 rounded-xl text-xs font-medium text-[#2C2320] focus:outline-none focus:border-[#C89A84]"
          >
            <option value="displayOrder">Display Order</option>
            <option value="name">Name (A-Z)</option>
            <option value="productCount">Number of Products</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EFE8E2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F6F2]/60 border-b border-[#EFE8E2] text-xs font-semibold text-[#6E625C] uppercase tracking-wider">
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Products</th>
                <th className="py-4 px-6">Display Order</th>
                <th className="py-4 px-6">Visibility</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8E2] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6E625C]">Loading categories...</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6E625C]">No categories found.</td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#F9F6F2]/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-[#F9F6F2] border border-[#EFE8E2] overflow-hidden flex-shrink-0 relative">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[#8C7A72]">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1F1816] flex items-center gap-2">
                            {cat.name}
                            {cat.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#C89A84] bg-[#C89A84]/10 px-2 py-0.5 rounded-md">
                                <Star className="w-2.5 h-2.5 fill-[#C89A84]" /> Featured
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-[#8C7A72]">/{cat.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#6E625C] max-w-xs truncate">{cat.description || "—"}</td>
                    <td className="py-4 px-6 font-medium text-[#2C2320]">
                      <span className="inline-flex items-center gap-1.5 bg-[#F9F6F2] px-2.5 py-1 rounded-lg border border-[#EFE8E2]">
                        <Layers className="w-3.5 h-3.5 text-[#C89A84]" /> {cat.productCount} items
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-[#1F1816]">{cat.displayOrder}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        cat.isVisible ? "bg-emerald-50 text-emerald-800" : "bg-gray-100 text-gray-700"
                      }`}>
                        {cat.isVisible ? <CheckCircle2 className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {cat.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/shop?category=${cat.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/categories/edit/${cat.id}`}
                          className="p-2 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deletingCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-xl border border-[#EFE8E2]">
            <h3 className="font-serif text-xl font-bold text-[#1F1816]">
              Delete Category: {deletingCategory.name}
            </h3>
            <p className="text-sm text-[#6E625C]">
              This category currently has <strong className="text-[#1F1816]">{deletingCategory.productCount} products</strong> associated with it. How would you like to handle them?
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  checked={deleteAction === "reassign"}
                  onChange={() => setDeleteAction("reassign")}
                  className="mt-1 text-[#C89A84]"
                />
                <div className="space-y-1 w-full">
                  <p className="font-semibold text-xs text-[#1F1816]">Move products to another category</p>
                  <select
                    value={reassignTargetId}
                    onChange={(e) => setReassignTargetId(e.target.value)}
                    disabled={deleteAction !== "reassign"}
                    className="w-full mt-1 bg-white border border-[#EFE8E2] px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-[#C89A84]"
                  >
                    <option value="">Select target category...</option>
                    {categories.filter(c => c.id !== deletingCategory.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#EFE8E2] bg-rose-50/50 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  checked={deleteAction === "delete_products"}
                  onChange={() => setDeleteAction("delete_products")}
                  className="mt-1 text-rose-600"
                />
                <div>
                  <p className="font-semibold text-xs text-rose-900">Delete all products in this category</p>
                  <p className="text-[11px] text-rose-700">Permanent action. Removes products completely.</p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl border border-[#EFE8E2] text-xs font-medium text-[#6E625C] hover:bg-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-medium hover:bg-rose-700 transition shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}