"use client";

import React, { useEffect, useState } from "react";
import { Package, Clock, CheckCircle2, Truck, ExternalLink, RefreshCw } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customizations: any;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: "PENDING" | "IN_PRODUCTION" | "SHIPPED";
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus as any } : ord))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-espresso">Workshop Admin Dashboard</h1>
          <p className="text-sm text-taupe mt-1">Manage incoming personalized orders and customer high-res photos.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-white border border-taupe-border px-4 py-2 rounded-xl text-sm font-medium text-espresso hover:bg-cream-dark transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-taupe">Loading live orders from database...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-taupe-border">
          <Package className="w-12 h-12 text-taupe mx-auto mb-3" />
          <h3 className="text-lg font-medium text-espresso">No orders found</h3>
          <p className="text-sm text-taupe mt-1">New customer checkouts will appear here instantly.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-taupe-border rounded-2xl p-6 shadow-soft space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-taupe-border/50 pb-4">
                <div>
                  <span className="text-xs font-mono text-taupe">Order ID: {order.id}</span>
                  <h3 className="text-lg font-serif font-semibold text-espresso">{order.customerName}</h3>
                  <p className="text-xs text-taupe">{order.customerEmail} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-taupe block">Total Amount</span>
                    <span className="text-lg font-serif font-bold text-espresso">${Number(order.totalAmount).toFixed(2)}</span>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-xs font-medium px-3 py-2 rounded-xl border border-taupe-border bg-cream text-espresso focus:outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PRODUCTION">In Production</option>
                    <option value="SHIPPED">Shipped</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-taupe">Customized Items & Photos</h4>
                {order.items.map((item) => {
                  const photoUrl = item.customizations?.photo_upload || item.customizations?.photo;
                  return (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 bg-cream-dark/40 p-4 rounded-xl border border-taupe-border/40">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-espresso">{item.name} (x{item.quantity})</p>
                        <div className="text-xs text-taupe space-y-0.5">
                          {Object.entries(item.customizations || {}).map(([key, val]: [string, any]) => (
                            key !== "photo_upload" && key !== "photo" && (
                              <p key={key}><span className="font-medium">{key}:</span> {String(val)}</p>
                            )
                          ))}
                        </div>
                      </div>

                      {photoUrl ? (
                        <div className="flex items-center gap-3">
                          <img src={photoUrl} alt="Customer Custom Upload" className="w-16 h-16 rounded-lg object-cover border border-taupe-border" />
                          <a
                            href={photoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-rose hover:underline bg-white px-3 py-2 rounded-lg border border-taupe-border"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> High-Res Download
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-taupe italic">No photo uploaded</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}