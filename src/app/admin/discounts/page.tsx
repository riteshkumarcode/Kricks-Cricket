"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CouponRecord, getCoupons } from "@/lib/cms-store";
import { formatMoney } from "@/lib/tokens";
import { Tag, Plus, CheckCircle, Trash2 } from "lucide-react";

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<CouponRecord[]>([
    {
      code: "WELCOME10",
      type: "percent",
      value: 10,
      minOrderPaise: 500000,
      description: "10% off for first time buyers",
      active: true,
      usageCount: 42,
    },
    {
      code: "CLUB15",
      type: "percent",
      value: 15,
      minOrderPaise: 1500000,
      description: "15% off orders above ₹15,000",
      active: true,
      usageCount: 19,
    },
    {
      code: "FREESHIP",
      type: "free_shipping",
      value: 0,
      minOrderPaise: 0,
      description: "Free standard shipping nationwide",
      active: true,
      usageCount: 65,
    },
    {
      code: "KRICKS500",
      type: "fixed",
      value: 50000,
      minOrderPaise: 1000000,
      description: "Flat ₹500 discount on bats",
      active: true,
      usageCount: 8,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percent" | "fixed" | "free_shipping">("percent");
  const [newValue, setNewValue] = useState(10);
  const [newMinSpend, setNewMinSpend] = useState(5000);
  const [newDesc, setNewDesc] = useState("");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    const created: CouponRecord = {
      code: newCode.toUpperCase().trim(),
      type: newType,
      value: newType === "fixed" ? newValue * 100 : newValue,
      minOrderPaise: newMinSpend * 100,
      description: newDesc || "Promotional coupon code",
      active: true,
      usageCount: 0,
    };

    setCoupons([created, ...coupons]);
    setShowCreateModal(false);
    setNewCode("");
    setToastMsg(`Coupon code ${created.code} generated!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const columns: Column<CouponRecord>[] = [
    {
      key: "code",
      header: "Coupon Code",
      render: (row) => (
        <div>
          <span className="font-mono text-base font-bold text-accent tracking-wider block">
            {row.code}
          </span>
          <span className="text-xs text-ink-muted">{row.description}</span>
        </div>
      ),
    },
    {
      key: "benefit",
      header: "Discount Benefit",
      render: (row) => (
        <span className="font-display text-lg tracking-wider text-ink">
          {row.type === "percent"
            ? `${row.value}% OFF`
            : row.type === "free_shipping"
            ? "FREE SHIPPING"
            : formatMoney(row.value, "INR") + " OFF"}
        </span>
      ),
    },
    {
      key: "threshold",
      header: "Min Spend",
      render: (row) => (
        <span className="text-xs text-ink-muted font-medium">
          {row.minOrderPaise === 0
            ? "No minimum"
            : formatMoney(row.minOrderPaise, "INR")}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Uses",
      render: (row) => (
        <span className="font-display text-base tracking-wider text-ink">
          {row.usageCount}
        </span>
      ),
    },
    {
      key: "state",
      header: "State",
      render: (row) => (
        <button
          onClick={() => toggleCoupon(row.code)}
          className={`px-2.5 py-0.5 text-xs font-display tracking-widest uppercase border ${
            row.active
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {row.active ? "Active" : "Disabled"}
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
        kicker="Promotions & Marketing"
        title="Discounts & Coupons"
        description="Create promotional codes, percent discounts, free shipping rules, and track redemption."
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </AdminPageHeader>

      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={coupons}
          keyExtractor={(c) => c.code}
          emptyMessage="No promotional coupons active."
        />
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCoupon}
            className="bg-white border border-black max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-3">
              <h3 className="font-display text-2xl uppercase tracking-wider text-ink">
                Create Promo Code
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="font-display text-xl text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="e.g. DIWALI20"
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-base font-bold outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Discount Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-display uppercase tracking-wider"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              {newType !== "free_shipping" && (
                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Value {newType === "percent" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Minimum Order Spend (₹)
              </label>
              <input
                type="number"
                value={newMinSpend}
                onChange={(e) => setNewMinSpend(Number(e.target.value))}
                className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Description / Purpose
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Club season launch offer"
                className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E6E3DE]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-[#E6E3DE] font-display text-sm uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-accent text-white px-5 py-2 font-display text-base uppercase tracking-wider hover:bg-[#A9420F]"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

