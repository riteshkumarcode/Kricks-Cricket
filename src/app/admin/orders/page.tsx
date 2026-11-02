"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatMoney } from "@/lib/tokens";
import { OrderRecord } from "@/lib/orders";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Truck,
  Package,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = () => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleExportCsv = () => {
    const headers = "Order Number,Date,Customer,Email,Total,Status,Payment\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.createdAt}","${o.customerName}","${o.customerEmail}",${o.grandTotal},"${o.status}","${o.paymentStatus}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kricks-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns: Column<OrderRecord>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      render: (row) => (
        <div>
          <Link
            href={`/admin/orders/${row.id}`}
            className="font-display text-lg tracking-wider text-accent hover:underline block"
          >
            {row.orderNumber}
          </Link>
          <span className="text-xs text-ink-muted">
            {new Date(row.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (row) => (
        <div>
          <span className="font-medium text-ink block text-sm">
            {row.customerName}
          </span>
          <span className="text-xs text-ink-muted">{row.customerEmail}</span>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (row) => (
        <div>
          <span className="text-xs font-display uppercase tracking-widest text-ink block">
            {row.items.length} line item(s)
          </span>
          <span className="text-xs text-ink-muted line-clamp-1">
            {row.items.map((i) => i.name).join(", ")}
          </span>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (row) => (
        <div>
          <span className="font-display text-lg tracking-wider text-ink block">
            {formatMoney(row.grandTotal, row.currency)}
          </span>
          <span className="text-[10px] font-display uppercase tracking-widest text-ink-muted">
            {row.paymentGateway}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const isShipped =
          row.status === "SHIPPED" || row.status === "DISPATCHED";
        const isPaid =
          row.status === "PAID" || row.status === "CONFIRMED";
        return (
          <span
            className={`inline-block px-2.5 py-1 text-xs font-display tracking-widest uppercase border ${
              isShipped
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : isPaid
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-orange-50 text-accent border-accent/30"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "View",
      className: "text-right",
      render: (row) => (
        <Link
          href={`/admin/orders/${row.id}`}
          className="inline-flex items-center gap-1 text-xs font-display uppercase tracking-wider text-accent hover:underline"
        >
          <span>Inspect</span>
          <Eye className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Fulfillment & Operations"
        title="Orders"
        description="Monitor real-time customer orders, inspect custom bat specs, update fulfillment statuses, and manage courier tracking."
      >
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <Download className="w-4 h-4 text-ink-muted" />
          <span>Export Orders</span>
        </button>
      </AdminPageHeader>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E6E3DE] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F4F3F0] border border-transparent focus:border-black text-sm outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs uppercase font-display tracking-widest text-ink-muted">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-display uppercase tracking-wider px-3 py-2 outline-none focus:border-black"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid / Confirmed</option>
            <option value="IN_WORKSHOP">In Workshop</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(o) => o.id}
          isLoading={loading}
          emptyMessage="No orders found matching the filter."
        />
      </div>
    </div>
  );
}

