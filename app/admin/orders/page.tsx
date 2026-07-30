// ==========================================
// 1. Orders Management Page with Dual Tabs
// Location: app/admin/orders/page.tsx
// ==========================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Filter, Eye, Edit3, Trash2, CheckCircle2, 
  Clock, Package, MessageSquare, ArrowRight, User, Phone, Mail, Calendar, Sparkles, FileText
} from "lucide-react";

export type OrderStatus = 
  | "PENDING" | "ACCEPTED" | "DESIGNING" | "IN_PRODUCTION" 
  | "READY_TO_DISPATCH" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";

export type ConsultationStatus = 
  | "NEW_REQUEST" | "CONTACTED" | "IN_DISCUSSION" 
  | "QUOTATION_SENT" | "CONFIRMED" | "CONVERTED" | "CLOSED" | "CANCELLED";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  productName: string;
  category: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  date: string;
  customization: {
    photos: string[];
    customName?: string;
    customMessage?: string;
    notes?: string;
    deliveryDate?: string;
  };
  internalNotes: string[];
}

export interface Consultation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  productName: string;
  category: string;
  description: string;
  referenceImages: string[];
  budget?: string;
  preferredDeliveryDate?: string;
  additionalNotes?: string;
  discussionStatus: ConsultationStatus;
  date: string;
  internalNotes: string[];
}

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "consultations">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Selected item modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setConsultations(data.consultations || []);
      }
    } catch (error) {
      console.error("Failed to load orders data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, orderStatus: newStatus } : o));
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleUpdatePaymentStatus = async (id: string, newPaymentStatus: PaymentStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, paymentStatus: newPaymentStatus } : o));
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
        }
      }
    } catch (error) {
      alert("Failed to update payment status");
    }
  };

  const handleUpdateConsultationStatus = async (id: string, newStatus: ConsultationStatus) => {
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussionStatus: newStatus }),
      });
      if (res.ok) {
        setConsultations(consultations.map(c => c.id === id ? { ...c, discussionStatus: newStatus } : c));
        if (selectedConsultation && selectedConsultation.id === id) {
          setSelectedConsultation({ ...selectedConsultation, discussionStatus: newStatus });
        }
      }
    } catch (error) {
      alert("Failed to update consultation status");
    }
  };

  const handleConvertToOrder = async (consultation: Consultation) => {
    if (!confirm(`Convert consultation ${consultation.id} into a Quick Customize Order?`)) return;
    try {
      const res = await fetch(`/api/admin/consultations/${consultation.id}/convert`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Successfully converted consultation to order!");
        fetchData();
        setSelectedConsultation(null);
      }
    } catch (error) {
      alert("Failed to convert consultation");
    }
  };

  const handleAddInternalNote = async (id: string, type: "order" | "consultation") => {
    if (!newNote.trim()) return;
    try {
      const endpoint = type === "order" ? `/api/admin/orders/${id}/notes` : `/api/admin/consultations/${id}/notes`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote }),
      });
      if (res.ok) {
        if (type === "order" && selectedOrder) {
          const updatedNotes = [...selectedOrder.internalNotes, newNote];
          setSelectedOrder({ ...selectedOrder, internalNotes: updatedNotes });
          setOrders(orders.map(o => o.id === id ? { ...o, internalNotes: updatedNotes } : o));
        } else if (type === "consultation" && selectedConsultation) {
          const updatedNotes = [...selectedConsultation.internalNotes, newNote];
          setSelectedConsultation({ ...selectedConsultation, internalNotes: updatedNotes });
          setConsultations(consultations.map(c => c.id === id ? { ...c, internalNotes: updatedNotes } : c));
        }
        setNewNote("");
      }
    } catch (error) {
      alert("Failed to add note");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== id));
        setSelectedOrder(null);
      }
    } catch (error) {
      alert("Failed to delete order");
    }
  };

  // Filter logic for Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || o.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Filter logic for Consultations
  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = 
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.discussionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 p-6 md:p-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Orders & Consultations</h1>
          <p className="text-sm text-[#6E625C]">Manage direct customer orders and bespoke design requests.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EFE8E2] gap-8">
        <button
          onClick={() => { setActiveTab("orders"); setStatusFilter("ALL"); }}
          className={`pb-3 font-medium text-sm transition relative ${
            activeTab === "orders" ? "text-[#1F1816] font-semibold border-b-2 border-[#1F1816]" : "text-[#6E625C] hover:text-[#1F1816]"
          }`}
        >
          Quick Customize Orders ({orders.length})
        </button>
        <button
          onClick={() => { setActiveTab("consultations"); setStatusFilter("ALL"); }}
          className={`pb-3 font-medium text-sm transition relative ${
            activeTab === "consultations" ? "text-[#1F1816] font-semibold border-b-2 border-[#1F1816]" : "text-[#6E625C] hover:text-[#1F1816]"
          }`}
        >
          Design Consultation Requests ({consultations.length})
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFE8E2] shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A72]" />
          <input
            type="text"
            placeholder="Search by customer name, phone, order ID..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F9F6F2] border border-[#EFE8E2] px-3 py-2 rounded-xl text-xs font-medium text-[#2C2320] focus:outline-none focus:border-[#C89A84]"
          >
            <option value="ALL">All Statuses</option>
            {activeTab === "orders" ? (
              <>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="DESIGNING">Designing</option>
                <option value="IN_PRODUCTION">In Production</option>
                <option value="READY_TO_DISPATCH">Ready to Dispatch</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </>
            ) : (
              <>
                <option value="NEW_REQUEST">New Request</option>
                <option value="CONTACTED">Contacted</option>
                <option value="IN_DISCUSSION">In Discussion</option>
                <option value="QUOTATION_SENT">Quotation Sent</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CONVERTED">Converted</option>
                <option value="CLOSED">Closed</option>
              </>
            )}
          </select>

          {activeTab === "orders" && (
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-[#F9F6F2] border border-[#EFE8E2] px-3 py-2 rounded-xl text-xs font-medium text-[#2C2320] focus:outline-none focus:border-[#C89A84]"
            >
              <option value="ALL">All Payments</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          )}
        </div>
      </div>

      {/* Tables based on Active Tab */}
      {activeTab === "orders" ? (
        <div className="bg-white rounded-2xl border border-[#EFE8E2] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F6F2]/60 border-b border-[#EFE8E2] text-xs font-semibold text-[#6E625C] uppercase tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8E2] text-sm">
                {loading ? (
                  <tr><td colSpan={8} className="py-12 text-center text-[#6E625C]">Loading orders...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-[#6E625C]">No quick customize orders found.</td></tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F9F6F2]/40 transition">
                      <td className="py-4 px-6 font-semibold text-[#1F1816]">{order.id}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-[#1F1816]">{order.customerName}</p>
                        <p className="text-xs text-[#6E625C]">{order.phone}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-[#2C2320]">{order.productName}</p>
                        <p className="text-xs text-[#6E625C]">{order.category}</p>
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#1F1816]">₹{order.amount.toLocaleString("en-IN")}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                          order.paymentStatus === "PAID" ? "bg-emerald-50 text-emerald-800" :
                          order.paymentStatus === "PENDING" ? "bg-amber-50 text-amber-800" : "bg-gray-100 text-gray-700"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-[#F9F6F2] border border-[#EFE8E2] px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#2C2320] focus:outline-none focus:border-[#C89A84]"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="DESIGNING">Designing</option>
                          <option value="IN_PRODUCTION">In Production</option>
                          <option value="READY_TO_DISPATCH">Ready to Dispatch</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#6E625C]">{order.date}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                            title="Delete Order"
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
      ) : (
        <div className="bg-white rounded-2xl border border-[#EFE8E2] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F6F2]/60 border-b border-[#EFE8E2] text-xs font-semibold text-[#6E625C] uppercase tracking-wider">
                  <th className="py-4 px-6">Request ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Product / Category</th>
                  <th className="py-4 px-6">Discussion Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8E2] text-sm">
                {loading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-[#6E625C]">Loading consultations...</td></tr>
                ) : filteredConsultations.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-[#6E625C]">No design consultation requests found.</td></tr>
                ) : (
                  filteredConsultations.map((consult) => (
                    <tr key={consult.id} className="hover:bg-[#F9F6F2]/40 transition">
                      <td className="py-4 px-6 font-semibold text-[#1F1816]">{consult.id}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-[#1F1816]">{consult.customerName}</p>
                        <p className="text-xs text-[#6E625C]">{consult.phone}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-[#2C2320]">{consult.productName}</p>
                        <p className="text-xs text-[#6E625C]">{consult.category}</p>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={consult.discussionStatus}
                          onChange={(e) => handleUpdateConsultationStatus(consult.id, e.target.value as ConsultationStatus)}
                          className="bg-[#F9F6F2] border border-[#EFE8E2] px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#2C2320] focus:outline-none focus:border-[#C89A84]"
                        >
                          <option value="NEW_REQUEST">New Request</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="IN_DISCUSSION">In Discussion</option>
                          <option value="QUOTATION_SENT">Quotation Sent</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="CONVERTED">Converted</option>
                          <option value="CLOSED">Closed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#6E625C]">{consult.date}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedConsultation(consult)}
                            className="p-2 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C] hover:text-[#1F1816] transition"
                            title="View Request"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleConvertToOrder(consult)}
                            className="inline-flex items-center gap-1.5 bg-[#1F1816] text-[#F9F6F2] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#322724] transition"
                            title="Convert to Order"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Convert
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
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-xl border border-[#EFE8E2] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1F1816]">Order Details: {selectedOrder.id}</h3>
                <p className="text-xs text-[#6E625C]">Placed on {selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C]"
              >
                Close
              </button>
            </div>

            {/* Customer Information */}
            <div className="space-y-3 bg-[#F9F6F2]/50 p-4 rounded-xl border border-[#EFE8E2]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Customer Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-[#2C2320]"><User className="w-4 h-4 text-[#8C7A72]" /> {selectedOrder.customerName}</div>
                <div className="flex items-center gap-2 text-[#2C2320]"><Phone className="w-4 h-4 text-[#8C7A72]" /> {selectedOrder.phone}</div>
                <div className="flex items-center gap-2 text-[#2C2320]"><Mail className="w-4 h-4 text-[#8C7A72]" /> {selectedOrder.email}</div>
                <div className="flex items-center gap-2 text-[#2C2320] sm:col-span-2"><FileText className="w-4 h-4 text-[#8C7A72]" /> {selectedOrder.address}</div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-3 bg-[#F9F6F2]/50 p-4 rounded-xl border border-[#EFE8E2]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Product & Payment</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><span className="text-[#6E625C] text-xs">Product:</span> <p className="font-semibold text-[#1F1816]">{selectedOrder.productName}</p></div>
                <div><span className="text-[#6E625C] text-xs">Category:</span> <p className="font-semibold text-[#1F1816]">{selectedOrder.category}</p></div>
                <div><span className="text-[#6E625C] text-xs">Amount:</span> <p className="font-semibold text-[#1F1816]">₹{selectedOrder.amount.toLocaleString("en-IN")}</p></div>
                <div>
                  <span className="text-[#6E625C] text-xs">Payment Status:</span>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value as PaymentStatus)}
                    className="w-full mt-1 bg-white border border-[#EFE8E2] px-3 py-1.5 rounded-lg text-xs font-medium text-[#2C2320]"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customization Details */}
            <div className="space-y-3 bg-[#F9F6F2]/50 p-4 rounded-xl border border-[#EFE8E2]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Customization Details</h4>
              <div className="space-y-2 text-sm">
                {selectedOrder.customization.customName && <p><strong className="text-[#6E625C]">Custom Name:</strong> {selectedOrder.customization.customName}</p>}
                {selectedOrder.customization.customMessage && <p><strong className="text-[#6E625C]">Custom Message:</strong> {selectedOrder.customization.customMessage}</p>}
                {selectedOrder.customization.notes && <p><strong className="text-[#6E625C]">Additional Notes:</strong> {selectedOrder.customization.notes}</p>}
                {selectedOrder.customization.deliveryDate && <p><strong className="text-[#6E625C]">Requested Delivery Date:</strong> {selectedOrder.customization.deliveryDate}</p>}
                {selectedOrder.customization.photos?.length > 0 && (
                  <div>
                    <strong className="text-[#6E625C] text-xs block mb-2">Uploaded Photos:</strong>
                    <div className="flex gap-2 flex-wrap">
                      {selectedOrder.customization.photos.map((photo, i) => (
                        <a key={i} href={photo} target="_blank" rel="noreferrer" className="h-16 w-16 rounded-lg border border-[#EFE8E2] overflow-hidden block">
                          <img src={photo} alt="Upload" className="h-full w-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline & Status */}
            <div className="space-y-3 bg-[#F9F6F2]/50 p-4 rounded-xl border border-[#EFE8E2]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Timeline & Status Progression</h4>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                className="w-full bg-white border border-[#EFE8E2] px-3 py-2 rounded-xl text-sm font-semibold text-[#1F1816]"
              >
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="DESIGNING">Designing</option>
                <option value="IN_PRODUCTION">In Production</option>
                <option value="READY_TO_DISPATCH">Ready to Dispatch</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Internal Notes Section */}
            <div className="space-y-3 bg-[#FFF9F5] p-4 rounded-xl border border-[#F3E5DC]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C5A40]">Internal Admin Notes (Hidden from Customer)</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedOrder.internalNotes.length === 0 ? (
                  <p className="text-xs text-[#8C7A72]">No internal notes added yet.</p>
                ) : (
                  selectedOrder.internalNotes.map((note, i) => (
                    <div key={i} className="text-xs bg-white p-2.5 rounded-lg border border-[#F3E5DC] text-[#2C2320]">
                      {note}
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add internal note (e.g. Waiting for final photo)..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#F3E5DC] rounded-xl text-xs focus:outline-none focus:border-[#C89A84]"
                />
                <button
                  onClick={() => handleAddInternalNote(selectedOrder.id, "order")}
                  className="bg-[#1F1816] text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-[#322724]"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONSULTATION DETAILS MODAL */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-xl border border-[#EFE8E2] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1F1816]">Consultation Request: {selectedConsultation.id}</h3>
                <p className="text-xs text-[#6E625C]">Submitted on {selectedConsultation.date}</p>
              </div>
              <button
                onClick={() => setSelectedConsultation(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F9F6F2] hover:bg-[#EFE8E2] text-[#6E625C]"
              >
                Close
              </button>
            </div>

            {/* Customer Information */}
            <div className="space-y-3 bg-[#F9F6F2]/50 p-4 rounded-xl border border-[#EFE8E2]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Customer Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-[#2C2320]"><User className="w-4 h-4 text-[#8C7A72]" /> {selectedConsultation.customerName}</div>
                <div className="flex items-center gap-2 text-[#2C2320]"><Phone className="w-4 h-4 text-[#8C7A72]" /> {selectedConsultation.phone}</div>
                <div className="flex items-center gap-2 text-[#2C2320] sm:col-span-2"><Mail className="w-4 h-4 text-[#8C7A72]" /> {selectedConsultation.email}</div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-3 bg-[#F9F6F2]/50 p-4 rounded-xl border border-[#EFE8E2]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Project Details</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-[#6E625C] text-xs">Product Interest:</span> <p className="font-semibold text-[#1F1816]">{selectedConsultation.productName} ({selectedConsultation.category})</p></div>
                <div><span className="text-[#6E625C] text-xs">Description:</span> <p className="text-[#2C2320]">{selectedConsultation.description}</p></div>
                {selectedConsultation.budget && <div><span className="text-[#6E625C] text-xs">Budget:</span> <p className="font-semibold text-[#1F1816]">{selectedConsultation.budget}</p></div>}
                {selectedConsultation.preferredDeliveryDate && <div><span className="text-[#6E625C] text-xs">Preferred Date:</span> <p className="font-semibold text-[#1F1816]">{selectedConsultation.preferredDeliveryDate}</p></div>}
                {selectedConsultation.referenceImages?.length > 0 && (
                  <div>
                    <strong className="text-[#6E625C] text-xs block mb-2">Uploaded Reference Images:</strong>
                    <div className="flex gap-2 flex-wrap">
                      {selectedConsultation.referenceImages.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer" className="h-16 w-16 rounded-lg border border-[#EFE8E2] overflow-hidden block">
                          <img src={img} alt="Ref" className="h-full w-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Discussion Status */}
            <div className="space-y-3 bg-[#F9F6F2]/50 p-4 rounded-xl border border-[#EFE8E2]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E625C]">Discussion Status</h4>
              <select
                value={selectedConsultation.discussionStatus}
                onChange={(e) => handleUpdateConsultationStatus(selectedConsultation.id, e.target.value as ConsultationStatus)}
                className="w-full bg-white border border-[#EFE8E2] px-3 py-2 rounded-xl text-sm font-semibold text-[#1F1816]"
              >
                <option value="NEW_REQUEST">New Request</option>
                <option value="CONTACTED">Contacted</option>
                <option value="IN_DISCUSSION">In Discussion</option>
                <option value="QUOTATION_SENT">Quotation Sent</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CONVERTED">Converted</option>
                <option value="CLOSED">Closed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Internal Notes */}
            <div className="space-y-3 bg-[#FFF9F5] p-4 rounded-xl border border-[#F3E5DC]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C5A40]">Internal Admin Notes (Hidden from Customer)</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedConsultation.internalNotes.length === 0 ? (
                  <p className="text-xs text-[#8C7A72]">No internal notes added yet.</p>
                ) : (
                  selectedConsultation.internalNotes.map((note, i) => (
                    <div key={i} className="text-xs bg-white p-2.5 rounded-lg border border-[#F3E5DC] text-[#2C2320]">
                      {note}
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add internal note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#F3E5DC] rounded-xl text-xs focus:outline-none focus:border-[#C89A84]"
                />
                <button
                  onClick={() => handleAddInternalNote(selectedConsultation.id, "consultation")}
                  className="bg-[#1F1816] text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-[#322724]"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Convert Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleConvertToOrder(selectedConsultation)}
                className="inline-flex items-center gap-2 bg-[#1F1816] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#322724] transition shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> Convert to Quick Customize Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}