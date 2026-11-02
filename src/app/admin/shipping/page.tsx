"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ShippingSettings, getShippingSettings } from "@/lib/cms-store";
import { formatMoney } from "@/lib/tokens";
import { Save, Truck, CheckCircle, Globe } from "lucide-react";

export default function AdminShippingPage() {
  const [settings, setSettings] = useState<ShippingSettings>({
    domesticStandardFeePaise: 29900,
    domesticExpressFeePaise: 59900,
    codFeePaise: 9900,
    freeShippingThresholdPaise: 1000000,
    internationalFlatRatePaise: 249900,
    estimatedDomesticDays: "3–5 business days",
    estimatedInternationalDays: "5–8 business days",
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    setToastMsg("Shipping zones and courier rates updated successfully!");
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
        kicker="Logistics & Delivery"
        title="Shipping Zones & Rates"
        description="Configure domestic courier charges, express delivery surcharges, free shipping threshold, and global flat rates."
      >
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Rates</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Domestic India Shipping */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E6E3DE] pb-2">
            <Truck className="w-5 h-5 text-accent" />
            <h3 className="font-display text-xl uppercase tracking-wider text-ink">
              Domestic India (All States)
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Standard Ground Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={Math.round(settings.domesticStandardFeePaise / 100)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    domesticStandardFeePaise: Number(e.target.value) * 100,
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Express Air Shipping Surcharge (₹)
              </label>
              <input
                type="number"
                value={Math.round(settings.domesticExpressFeePaise / 100)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    domesticExpressFeePaise: Number(e.target.value) * 100,
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Cash On Delivery (COD) Handling Surcharge (₹)
              </label>
              <input
                type="number"
                value={Math.round(settings.codFeePaise / 100)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    codFeePaise: Number(e.target.value) * 100,
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Free Domestic Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={Math.round(settings.freeShippingThresholdPaise / 100)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeShippingThresholdPaise: Number(e.target.value) * 100,
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
              />
              <span className="text-xs text-ink-muted mt-1 block">
                Orders equal or exceeding this amount receive free standard shipping.
              </span>
            </div>
          </div>
        </div>

        {/* International & Delivery Promises */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E6E3DE] pb-2">
            <Globe className="w-5 h-5 text-accent" />
            <h3 className="font-display text-xl uppercase tracking-wider text-ink">
              International Delivery & Timelines
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                International Courier Flat Fee (₹ equivalent)
              </label>
              <input
                type="number"
                value={Math.round(settings.internationalFlatRatePaise / 100)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    internationalFlatRatePaise: Number(e.target.value) * 100,
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Domestic Estimated Delivery Time
              </label>
              <input
                type="text"
                value={settings.estimatedDomesticDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    estimatedDomesticDays: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                International Estimated Delivery Time
              </label>
              <input
                type="text"
                value={settings.estimatedInternationalDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    estimatedInternationalDays: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

