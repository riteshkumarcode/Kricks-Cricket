"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TaxSettings, getTaxSettings } from "@/lib/cms-store";
import { Save, Receipt, CheckCircle } from "lucide-react";

export default function AdminTaxesPage() {
  const [settings, setSettings] = useState<TaxSettings>({
    legalBusinessName: "KRICKS CRICKET GEAR PRIVATE LIMITED",
    gstin: "07AAACK1234F1Z5",
    stateCode: "07",
    stateName: "Delhi",
    hsnCode: "95069920",
    gstRatePercent: 12,
    pricesIncludeTax: true,
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    setToastMsg("GST & tax invoice settings saved successfully!");
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
        kicker="Compliance & Invoicing"
        title="Taxes & GST Configuration"
        description="Configure GSTIN credentials, HSN classification, intra-state CGST/SGST vs IGST rules, and invoice generation details."
      >
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save GST Settings</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business GST Profile */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E6E3DE] pb-2">
            <Receipt className="w-5 h-5 text-accent" />
            <h3 className="font-display text-xl uppercase tracking-wider text-ink">
              Registered Entity & GSTIN
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Legal Entity Name *
              </label>
              <input
                type="text"
                value={settings.legalBusinessName}
                onChange={(e) =>
                  setSettings({ ...settings, legalBusinessName: e.target.value })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  GSTIN *
                </label>
                <input
                  type="text"
                  value={settings.gstin}
                  onChange={(e) =>
                    setSettings({ ...settings, gstin: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-sm uppercase outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  HSN / SAC Code (Cricket Bats)
                </label>
                <input
                  type="text"
                  value={settings.hsnCode}
                  onChange={(e) =>
                    setSettings({ ...settings, hsnCode: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Registered State Name
                </label>
                <input
                  type="text"
                  value={settings.stateName}
                  onChange={(e) =>
                    setSettings({ ...settings, stateName: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  State Code
                </label>
                <input
                  type="text"
                  value={settings.stateCode}
                  onChange={(e) =>
                    setSettings({ ...settings, stateCode: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-sm outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* GST Rate & Split Rules */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
            Tax Rates & Pricing Inclusivity
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Standard GST Rate (%)
              </label>
              <input
                type="number"
                value={settings.gstRatePercent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    gstRatePercent: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
              />
            </div>

            <div className="bg-[#F4F3F0] p-4 border border-[#E6E3DE] space-y-2 text-xs">
              <span className="font-display uppercase tracking-widest text-ink block">
                Automatic Split Logic:
              </span>
              <p className="text-ink-muted">
                • Intra-State (Customer in {settings.stateName}):{" "}
                <b className="text-ink font-mono">{settings.gstRatePercent / 2}% CGST</b> +{" "}
                <b className="text-ink font-mono">{settings.gstRatePercent / 2}% SGST</b>.
              </p>
              <p className="text-ink-muted">
                • Inter-State (Outside {settings.stateName}):{" "}
                <b className="text-ink font-mono">{settings.gstRatePercent}% IGST</b>.
              </p>
              <p className="text-ink-muted">
                • Export / International orders: Zero-rated GST under LUT bond.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pricesIncludeTax}
                  onChange={(e) =>
                    setSettings({ ...settings, pricesIncludeTax: e.target.checked })
                  }
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-xs font-display uppercase tracking-wider text-ink">
                  Storefront prices are inclusive of all GST taxes
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

