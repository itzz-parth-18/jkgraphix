// ==========================================
// 2. Product Management Page
// Location: app/admin/products/page.tsx
// ==========================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Edit3, Trash2, Eye, Image as ImageIcon, CheckCircle2, Clock, AlertCircle, Star } from "lucide-react";
import { Category } from "../categories/page";

export type ProductType = "QUICK_CUSTOMIZE" | "DESIGN_CONSULTATION";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "OUT_OF_STOCK";

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
  categoryName?: string;
  price: number;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  productType: ProductType;
  status: ProductStatus;
  isFeatured: boolean;
  showOnHomepage: boolean;
  isSeasonal: boolean;
  customizationSettings: {
    requiresPhoto: boolean;
    allowMultiplePhotos: boolean;
    requiresCustomName: boolean;
    requiresCustomMessage: boolean;
    requiresAdditionalNotes: boolean;
    requiresDeliveryDate: boolean;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories")
      ]);
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(Array.isArray(data) ? data : []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : []);
      }
    } catch (error) {
      console.error("Failed to load catalog data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.categoryName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.categoryId === categoryFilter || p.categoryName === categoryFilter;
    const matchesType = typeFilter === "ALL" || p.productType === typeFilter;
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8 p-6 md:p-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Product Management</h1>
          <p className="text-sm text-[#6E625C]">Manage your complete catalog, dynamic categories, pricing, and customization settings.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-[#1F1816] text-[#F9F6F2] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#322724] transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#EFE8E2] shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A72]" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F9F6F2] border border-[#EFE8E2] rounded-xl text-sm focus:outline-none focus:border-[#C89A84]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#6E625C]">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F9F6F2] border border-[#EFE8E2] px-3 py-2 rounded-xl text-xs font-medium text-[#2C2320] focus:outline-none focus:border-[#C89A84]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#F9F6F2] border border-[#EFE8E2] px-3 py-2 rounded-xl text-xs font-medium text-[#2C2320] focus:outline-none focus:border-[#C89A84]"
          >
            <option value="ALL">All Types</option>
            <option value="QUICK_CUSTOMIZE">Quick Customize</option>
            <option value="DESIGN_CONSULTATION">Design Consultation</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F9F6F2] border border-[#EFE8E2] px-3 py-2 rounded-xl text-xs font-medium text-[#2C2320] focus:outline-none focus:border-[#C89A84]"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EFE8E2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F6F2]/60 border-b border-[#EFE8E2] text-xs font-semibold text-[#6E625C] uppercase tracking-wider">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Product Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8E2] text-sm">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-[#6E625C]">Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-[#6E625C]">No products found matching your search.</td></tr>
              ) : (
                filteredProducts.map((product) => {
                  const catObj = categories.find(c => c.id === product.categoryId);
                  const displayCategory = catObj?.name || product.categoryName || "General";
                  return (
                    <tr key={product.id} className="hover:bg-[#F9F6F2]/40 transition">
                      <td className="py-4 px-6">
                        <div className="h-12 w-12 rounded-xl bg-[#F9F6F2] border border-[#EFE8E2] overflow-hidden flex-shrink-0 relative">
                          {product.thumbnailUrl ? (
                            <img src={product.thumbnailUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[#8C7A72]"><ImageIcon className="w-5 h-5" /></div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-[#1F1816]">{product.name}</p>
                        <p className="text-xs text-[#6E625C] line-clamp-1">{product.shortDescription}</p>
                      </td>
                      <td className="py-4 px-6 font-medium text-[#2C2320]">{displayCategory}</td>
                      <td className="py-4 px-6 font-medium text-[#1F1816]">₹{(product.price || 0).toLocaleString("en-IN")}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                          product.productType === "QUICK_CUSTOMIZE" ? "bg-amber-50 text-amber-800" : "bg-purple-50 text-purple-800"
                        }`}>
                          {product.productType === "QUICK_CUSTOMIZE" ? "Quick Customize" : "Design Consultation"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          product.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-800" :
                          product.status === "DRAFT" ? "bg-gray-100 text-gray-700" : "bg-rose-50 text-rose-800"
                        }`}>
                          {product.status === "PUBLISHED" && <CheckCircle2 className="w-3 h-3" />}
                          {product.status === "DRAFT" && <Clock className="w-3 h-3" />}
                          {product.status === "OUT_OF_STOCK" && <AlertCircle className="w-3 h-3" />}
                          {(product.status || "DRAFT").replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {product.isFeatured ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C89A84] bg-[#C89A84]/10 px-2.5 py-1 rounded-lg">
                            <Star className="w-3 h-3 fill-[#C89A84]" /> Featured
                          </span>
                        ) : (
                          <span className="text-xs text-[#8C7A72]">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/shop/${product.id}`} target="_blank" className="p-2 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition" title="View"><Eye className="w-4 h-4" /></Link>
                          <Link href={`/admin/products/edit/${product.id}`} className="p-2 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition" title="Edit"><Edit3 className="w-4 h-4" /></Link>
                          <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}