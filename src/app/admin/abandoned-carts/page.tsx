"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AbandonedCart, getAbandonedCarts } from "@/lib/cms-store";
import { formatMoney } from "@/lib/tokens";
import { Send, CheckCircle, Clock } from "lucide-react";

export default function AdminAbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([
    {
      id: "cart-ab-1",
      customerEmail: "karan.mehta@outlook.com",
      customerName: "Karan Mehta",
      items: [{ name: "Custom Grade 1 Bat (Engraved)", price: 2899900, qty: 1 }],
      totalValue: 2899900,
      currency: "INR",
      abandonedAt: "2 hours ago",
      recoverySent: false,
    },
    {
      id: "cart-ab-2",
      customerEmail: "sam.curran@gmail.com",
      customerName: "Sam Curran",
      items: [
        { name: "Pro Edition English Willow", price: 2499900, qty: 1 },
        { name: "Workshop Bat Mallet", price: 129900, qty: 1 },
      ],
      totalValue: 2629800,
      currency: "INR",
      abandonedAt: "Yesterday",
      recoverySent: true,
    },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSendRecovery = (id: string, email: string) => {
    setCarts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, recoverySent: true } : c))
    );
    setToastMsg(`Recovery email with 10% coupon dispatched to ${email}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const columns: Column<AbandonedCart>[] = [
    {
      key: "customer",
      header: "Shopper",
      render: (row) => (
        <div>
          <span className="font-medium text-ink block text-base">
            {row.customerName}
          </span>
          <span className="text-xs text-ink-muted font-mono">{row.customerEmail}</span>
        </div>
      ),
    },
    {
      key: "items",
      header: "Cart Contents",
      render: (row) => (
        <div>
          <span className="text-xs font-display uppercase tracking-widest text-ink block">
            {row.items.length} Item(s)
          </span>
          <span className="text-xs text-ink-muted">
            {row.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}
          </span>
        </div>
      ),
    },
    {
      key: "total",
      header: "Potential Value",
      render: (row) => (
        <span className="font-display text-lg tracking-wider text-ink">
          {formatMoney(row.totalValue, row.currency)}
        </span>
      ),
    },
    {
      key: "time",
      header: "Abandoned",
      render: (row) => (
        <span className="text-xs text-ink-muted flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {row.abandonedAt}
        </span>
      ),
    },
    {
      key: "status",
      header: "Recovery State",
      render: (row) => (
        <span
          className={`inline-block px-2.5 py-1 text-xs font-display tracking-widest uppercase border ${
            row.recoverySent
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-orange-50 text-accent border-accent/30"
          }`}
        >
          {row.recoverySent ? "Email Sent" : "Uncontacted"}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      render: (row) => (
        <button
          onClick={() => handleSendRecovery(row.id, row.customerEmail)}
          disabled={row.recoverySent}
          className={`inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-wider px-3 py-1.5 border transition-colors ${
            row.recoverySent
              ? "opacity-50 cursor-not-allowed border-[#E6E3DE] text-ink-muted"
              : "border-accent text-accent hover:bg-accent hover:text-white"
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{row.recoverySent ? "Sent" : "Send Recovery"}</span>
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
        kicker="Revenue Recovery"
        title="Abandoned Carts"
        description="Monitor unfinished checkout carts and send automated brand recovery discount emails."
      />

      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={carts}
          keyExtractor={(c) => c.id}
          emptyMessage="No abandoned carts currently recorded."
        />
      </div>
    </div>
  );
}

