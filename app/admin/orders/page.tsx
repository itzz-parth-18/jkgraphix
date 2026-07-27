"use client";

import React, { useState } from "react";
import { Download, Package, Clock, Search } from "lucide-react";

// Mock Orders Data
const initialOrders = [
  {
    id: "ORD-8921",
    customerName: "Ananya Sharma",
    customerEmail: "ananya@example.com",
    productName: "Handcrafted Custom Memory Box",
    basePrice: 48.0,
    quantity: 1,
    status: "PENDING",
    createdAt: "2026-07-28 10:15 AM",
    customizations: {
      engraving_names: "Ananya & Rohan",
      anniversary_date: "2022-11-14",
      card_message: "Happy 4th Anniversary my love! Here's to forever.",
      photo_upload: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop",
    },
  },
  {
    id: "ORD-8920",
    customerName: "Vikram Mehta",
    customerEmail: "vikram.m@example.com",
    productName: "Handcrafted Custom Memory Box",
    basePrice: 48.0,
    quantity: 2,
    status: "IN_PRODUCTION",
    createdAt: "2026-07-27 04:30 PM",
    customizations: {
      engraving_names: "Vikram & Sneha",
      anniversary_date: "2025-02-14",
      card_message: "Together is our favorite place to be.",
      photo_upload: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    },
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream p-6 lg:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-taupe-border/60 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose">
            Workshop Management
          </span>
          <h1 className="text-3xl font-serif text-espresso font-semibold mt-1">
            Customization Orders
          </h1>
          <p className="text-xs text-taupe mt-1">
            Review customer text specs, download uploaded media, and manage production workflow.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="bg-white border border-taupe-border rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <Clock className="w-5 h-5 text-rose" />
            <div>
              <p className="text-[10px] uppercase font-bold text-taupe">Pending</p>
              <p className="text-sm font-semibold text-espresso">
                {orders.filter((o) => o.status === "PENDING").length} Orders
              </p>
            </div>
          </div>
          <div className="bg-white border border-taupe-border rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <Package className="w-5 h-5 text-sage" />
            <div>
              <p className="text-[10px] uppercase font-bold text-taupe">In Workshop</p>
              <p className="text-sm font-semibold text-espresso">
                {orders.filter((o) => o.status === "IN_PRODUCTION").length} Orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-taupe absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-taupe-border rounded-xl text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-rose/40"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-taupe-border rounded-2xl p-6 shadow-sm space-y-6"
          >
            {/* Header / Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe-border/40 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-serif font-semibold text-base text-espresso">
                    {order.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      order.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : order.status === "IN_PRODUCTION"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-taupe mt-1">
                  Customer: <strong className="text-espresso">{order.customerName}</strong> ({order.customerEmail}) • {order.createdAt}
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-taupe font-medium">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="bg-cream-dark border border-taupe-border text-xs text-espresso rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PRODUCTION">IN PRODUCTION</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>

            {/* Customization Details Block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-cream-dark/40 rounded-xl p-4 border border-taupe-border/40">
              
              {/* Text Engravings & Specs */}
              <div className="lg:col-span-8 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-espresso flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-rose" /> Production Specs
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-taupe-border/40">
                    <span className="text-taupe block text-[10px] font-bold uppercase">Names to Engrave</span>
                    <span className="font-semibold text-espresso">{order.customizations.engraving_names}</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-taupe-border/40">
                    <span className="text-taupe block text-[10px] font-bold uppercase">Anniversary / Date</span>
                    <span className="font-semibold text-espresso">{order.customizations.anniversary_date}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-taupe-border/40 text-xs">
                  <span className="text-taupe block text-[10px] font-bold uppercase">Card Note Message</span>
                  <p className="text-espresso italic mt-0.5">"{order.customizations.card_message}"</p>
                </div>
              </div>

              {/* Uploaded Customer Media */}
              <div className="lg:col-span-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-espresso flex items-center gap-1.5">
                  Uploaded Customer Photo
                </h4>
                <div className="relative group rounded-xl overflow-hidden border border-taupe-border aspect-video bg-white">
                  <img
                    src={order.customizations.photo_upload}
                    alt="Customer Upload"
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={order.customizations.photo_upload}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-espresso/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-cream text-xs font-medium gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download High-Res
                  </a>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}