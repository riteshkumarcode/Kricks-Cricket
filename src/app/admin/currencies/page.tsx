"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CurrencyRecord, getCurrencies } from "@/lib/cms-store";
import { Save, CheckCircle, Coins, RefreshCw } from "lucide-react";

export default function AdminCurrenciesPage() {
  const [currencies, setCurrencies] = useState<CurrencyRecord[]>([
    { code: "INR", symbol: "₹", name: "Indian Rupee", rateAgainstINR: 1, active: true },
    { code: "USD", symbol: "$", name: "US Dollar", rateAgainstINR: 0.012, active: true },
    { code: "GBP", symbol: "£", name: "British Pound", rateAgainstINR: 0.0095, active: true },
    { code: "AUD", symbol: "A$", name: "Australian Dollar", rateAgainstINR: 0.018, active: true },
    { code: "AED", symbol: "AED", name: "UAE Dirham", rateAgainstINR: 0.044, active: true },
    { code: "ZAR", symbol: "R", name: "South African Rand", rateAgainstINR: 0.22, active: true },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleRateChange = (code: string, newRate: number) => {
    setCurrencies((prev) =>
      prev.map((c) => (c.code === code ? { ...c, rateAgainstINR: newRate } : c))
    );
  };

  const toggleCurrency = (code: string) => {
    if (code === "INR") return; // default currency cannot be disabled
    setCurrencies((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  const handleSave = () => {
    setToastMsg("Exchange rates and active currencies updated!");
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
        kicker="Multi-Currency Engine"
        title="Currencies & Exchange Rates"
        description="Configure retail currencies, exchange rate multipliers relative to INR base, and display formatting."
      >
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Rates</span>
        </button>
      </AdminPageHeader>

      <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
        <div className="space-y-3">
          {currencies.map((curr) => (
            <div
              key={curr.code}
              className="p-4 border border-[#E6E3DE] bg-[#F4F3F0] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-white border border-[#E6E3DE] flex items-center justify-center font-display text-lg text-ink font-bold">
                  {curr.symbol}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-xl uppercase tracking-wider text-ink">
                      {curr.name} ({curr.code})
                    </h4>
                    {curr.code === "INR" && (
                      <span className="text-[10px] font-display uppercase tracking-widest bg-black text-white px-1.5 py-0.5">
                        Base Currency
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-ink-muted">
                    1 INR = {curr.rateAgainstINR} {curr.code}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-display uppercase tracking-widest text-ink-muted">
                    Multiplier:
                  </span>
                  <input
                    type="number"
                    step="0.0001"
                    disabled={curr.code === "INR"}
                    value={curr.rateAgainstINR}
                    onChange={(e) =>
                      handleRateChange(curr.code, parseFloat(e.target.value) || 0)
                    }
                    className="w-28 p-1.5 bg-white border border-[#E6E3DE] font-mono text-sm disabled:bg-gray-100 disabled:text-ink-muted"
                  />
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={curr.active}
                    disabled={curr.code === "INR"}
                    onChange={() => toggleCurrency(curr.code)}
                    className="accent-accent"
                  />
                  <span className="text-xs font-display uppercase tracking-widest text-ink">
                    Active
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

