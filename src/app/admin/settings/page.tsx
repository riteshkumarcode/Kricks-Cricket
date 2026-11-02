"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StoreSettings, getStoreSettings } from "@/lib/cms-store";
import { Save, Settings, CheckCircle, MessageSquare } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "Krickscricket",
    tagline: "Cricket bats made by hand",
    contactEmail: "workshop@krickscricket.com",
    supportPhone: "+91 98765 43210",
    whatsappNumber: "919876543210",
    enableWhatsappButton: true,
    addressLine1: "Plot 42, Okhla Industrial Area Phase III",
    cityStatePin: "New Delhi, Delhi 110020, India",
    orderNumberPrefix: "KC-",
    businessHours: "Mon – Sat: 9:30 AM – 6:30 PM IST",
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    setToastMsg("Store identity and contact settings saved!");
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
        kicker="Brand & Identity"
        title="Store Settings"
        description="Configure workshop profile, customer support hotline, floating WhatsApp chat, and business address."
      >
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand Profile */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
            Store Identity
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) =>
                  setSettings({ ...settings, storeName: e.target.value })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Order Number Prefix
              </label>
              <input
                type="text"
                value={settings.orderNumberPrefix}
                onChange={(e) =>
                  setSettings({ ...settings, orderNumberPrefix: e.target.value })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-sm outline-none focus:border-black"
              />
              <span className="text-xs text-ink-muted mt-1 block">
                Prefix appended to order numbers (e.g. KC-10492).
              </span>
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
            Contact & WhatsApp Support
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm font-mono outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Support Phone
                </label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) =>
                    setSettings({ ...settings, supportPhone: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm font-mono outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                WhatsApp Hotline (International Format with Country Code)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                placeholder="e.g. 919876543210"
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm font-mono outline-none focus:border-black"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableWhatsappButton}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enableWhatsappButton: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-xs font-display uppercase tracking-wider text-ink">
                  Show floating WhatsApp chat button on storefront
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Physical Workshop Address
              </label>
              <input
                type="text"
                value={settings.addressLine1}
                onChange={(e) =>
                  setSettings({ ...settings, addressLine1: e.target.value })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black mb-2"
              />
              <input
                type="text"
                value={settings.cityStatePin}
                onChange={(e) =>
                  setSettings({ ...settings, cityStatePin: e.target.value })
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

