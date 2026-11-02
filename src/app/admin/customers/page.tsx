"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CustomerRecord, getCustomers } from "@/lib/cms-store";
import { formatMoney } from "@/lib/tokens";
import { Search, Download, Ban, CheckCircle, Mail, Phone } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([
    {
      id: "cust-1",
      name: "Rohan Sharma",
      email: "rohan@cricket.in",
      phone: "+91 98765 43210",
      city: "Mumbai",
      ordersCount: 3,
      totalSpent: 6299700,
      status: "active",
      joinedDate: "2025-08-12",
      notes: "Plays club league cricket in MCA tournaments.",
    },
    {
      id: "cust-2",
      name: "Ananya Iyer",
      email: "ananya.iyer@gmail.com",
      phone: "+91 98222 11345",
      city: "Bengaluru",
      ordersCount: 2,
      totalSpent: 3399800,
      status: "active",
      joinedDate: "2025-09-04",
    },
    {
      id: "cust-3",
      name: "Vikram Malhotra",
      email: "vikram@delhicricket.org",
      phone: "+91 99100 88776",
      city: "New Delhi",
      ordersCount: 5,
      totalSpent: 12499500,
      status: "active",
      joinedDate: "2025-05-18",
      notes: "Academy coach at St. Stephens ground.",
    },
    {
      id: "cust-4",
      name: "Liam Thompson",
      email: "liam.t@surreycricket.co.uk",
      phone: "+44 7700 900123",
      city: "London",
      ordersCount: 1,
      totalSpent: 2899900,
      status: "active",
      joinedDate: "2025-10-21",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "blocked" : "active" }
          : c
      )
    );
    setToastMsg("Customer status toggled.");
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleExportCsv = () => {
    const headers = "Name,Email,Phone,City,Orders,Total Spent,Status\n";
    const rows = customers
      .map(
        (c) =>
          `"${c.name}","${c.email}","${c.phone}","${c.city}",${c.ordersCount},${c.totalSpent},"${c.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kricks-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<CustomerRecord>[] = [
    {
      key: "name",
      header: "Customer",
      render: (row) => (
        <div>
          <span className="font-medium text-ink block text-base">{row.name}</span>
          <span className="text-xs text-ink-muted">Member since {row.joinedDate}</span>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <span className="text-ink flex items-center gap-1 font-mono">
            <Mail className="w-3 h-3 text-ink-muted" />
            {row.email}
          </span>
          <span className="text-ink-muted flex items-center gap-1 font-mono">
            <Phone className="w-3 h-3 text-ink-muted" />
            {row.phone}
          </span>
        </div>
      ),
    },
    {
      key: "location",
      header: "City",
      render: (row) => <span className="text-sm text-ink">{row.city}</span>,
    },
    {
      key: "orders",
      header: "Orders",
      render: (row) => (
        <span className="font-display text-lg tracking-wider text-ink">
          {row.ordersCount}
        </span>
      ),
    },
    {
      key: "totalSpent",
      header: "Lifetime Spend",
      render: (row) => (
        <span className="font-display text-lg tracking-wider text-accent">
          {formatMoney(row.totalSpent, "INR")}
        </span>
      ),
    },
    {
      key: "status",
      header: "State",
      render: (row) => (
        <span
          className={`inline-block px-2.5 py-1 text-xs font-display tracking-widest uppercase border ${
            row.status === "active"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <button
          onClick={() => toggleStatus(row.id)}
          className={`text-xs font-display uppercase tracking-wider px-3 py-1 border transition-colors ${
            row.status === "active"
              ? "border-[#E6E3DE] text-red-600 hover:border-red-600"
              : "border-green-600 text-green-600 hover:bg-green-50"
          }`}
        >
          {row.status === "active" ? "Block" : "Unblock"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMsg}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="CRM & Relationships"
        title="Customers"
        description="View customer profiles, order history, lifetime value, and account access."
      >
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <Download className="w-4 h-4 text-ink-muted" />
          <span>Export CSV</span>
        </button>
      </AdminPageHeader>

      <div className="bg-white border border-[#E6E3DE] p-4 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search customers by name, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F4F3F0] border border-transparent focus:border-black text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(c) => c.id}
          emptyMessage="No customer records match your search."
        />
      </div>
    </div>
  );
}

