"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PricingTier, getPricingTiers } from "@/lib/cms-store";
import { Save, Plus, Trash2, CheckCircle, Percent } from "lucide-react";

export default function AdminBulkPricingPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([
    { minQty: 10, maxQty: 24, discountPercent: 15, label: "10–24 Bats (15% OFF)" },
    { minQty: 25, maxQty: 49, discountPercent: 20, label: "25–49 Bats (20% OFF)" },
    { minQty: 50, maxQty: 99, discountPercent: 25, label: "50–99 Bats (25% OFF)" },
    { minQty: 100, maxQty: 999, discountPercent: 30, label: "100+ Bats (30% OFF)" },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleUpdate = (idx: number, field: keyof PricingTier, val: any) => {
    setTiers((prev) => {
      const copy = [...prev];
      (copy[idx] as any)[field] = val;
      return copy;
    });
  };

  const handleAddTier = () => {
    const last = tiers[tiers.length - 1];
    setTiers([
      ...tiers,
      {
        minQty: last ? last.maxQty + 1 : 10,
        maxQty: last ? last.maxQty + 50 : 50,
        discountPercent: last ? last.discountPercent + 5 : 15,
        label: "Custom Volume Tier",
      },
    ]);
  };

  const handleDelete = (idx: number) => {
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    setToastMsg("Bulk discount tiers updated for storefront estimator!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMsg}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="Volume Discounts"
        title="Bulk Pricing Tiers"
        description="Configure tiered volume discount rules powering the /bulk-enquiry calculator and academy quotes."
      >
        <button
          onClick={handleAddTier}
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Add Tier</span>
        </button>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Tiers</span>
        </button>
      </AdminPageHeader>

      <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
        <div className="space-y-3">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className="p-4 border border-[#E6E3DE] bg-[#F4F3F0] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-display tracking-widest text-ink-muted mb-1">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    value={tier.minQty}
                    onChange={(e) =>
                      handleUpdate(idx, "minQty", Number(e.target.value))
                    }
                    className="w-full p-2 bg-white border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-display tracking-widest text-ink-muted mb-1">
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    value={tier.maxQty}
                    onChange={(e) =>
                      handleUpdate(idx, "maxQty", Number(e.target.value))
                    }
                    className="w-full p-2 bg-white border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-display tracking-widest text-ink-muted mb-1">
                    Discount Percentage (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tier.discountPercent}
                      onChange={(e) =>
                        handleUpdate(idx, "discountPercent", Number(e.target.value))
                      }
                      className="w-full p-2 bg-white border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black pr-8"
                    />
                    <Percent className="w-4 h-4 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-display text-xl uppercase tracking-wider text-accent min-w-[120px]">
                  {tier.discountPercent}% OFF
                </span>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-2 text-ink-muted hover:text-red-600 transition-colors"
                  title="Remove Tier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

