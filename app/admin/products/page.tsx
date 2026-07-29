"use client";

import React from "react";
import { Plus, Package, Edit, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  // Dummy products array for UI structure
  const products = [
    { id: "1", name: "Handcrafted Custom Memory Box", sku: "MEM-BOX-01", price: 48.00, stock: 15, status: "Active" },
    { id: "2", name: "Engraved Wooden Keepsake", sku: "KEEP-WOOD-02", price: 35.00, stock: 0, status: "Out of Stock" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-espresso">Product Catalog</h1>
          <p className="text-sm text-taupe mt-1">Manage your store's items, pricing, and inventory.</p>
        </div>
        <button className="flex items-center gap-2 bg-espresso text-cream px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-espresso-hover transition shadow-sm">
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      <div className="bg-white border border-taupe-border rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-dark/50 border-b border-taupe-border text-xs uppercase tracking-wider text-taupe font-semibold">
                <th className="p-4">Product Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe-border/50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-cream-dark/20 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-cream-dark rounded-lg flex items-center justify-center border border-taupe-border">
                      <Package className="w-5 h-5 text-taupe" />
                    </div>
                    <span className="font-medium text-espresso">{product.name}</span>
                  </td>
                  <td className="p-4 text-sm text-taupe">{product.sku}</td>
                  <td className="p-4 text-sm font-serif font-bold text-espresso">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-2 text-taupe hover:text-espresso transition"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 text-taupe hover:text-rose transition"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}