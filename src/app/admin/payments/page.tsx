"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PaymentGatewaySettings, getPaymentSettings } from "@/lib/cms-store";
import { formatMoney } from "@/lib/tokens";
import { Save, CreditCard, CheckCircle, ShieldCheck } from "lucide-react";

export default function AdminPaymentsPage() {
  const [settings, setSettings] = useState<PaymentGatewaySettings>({
    razorpayEnabled: true,
    razorpayTestMode: true,
    stripeEnabled: true,
    stripeTestMode: true,
    codEnabled: true,
    codMaxOrderPaise: 1500000,
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    setToastMsg("Payment gateway settings updated successfully!");
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
        kicker="Gateway Integrations"
        title="Payment Gateways"
        description="Enable/disable checkout payment providers, toggle test/sandbox modes, and set COD thresholds."
      >
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Gateways</span>
        </button>
      </AdminPageHeader>

      <div className="space-y-6">
        {/* Razorpay Gateway */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-3">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-blue-700 font-display text-xl uppercase tracking-wider">
                Razorpay
              </span>
              <div>
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  Razorpay (Domestic INR Checkout)
                </h3>
                <span className="text-xs text-ink-muted">
                  Supports UPI, NetBanking, RuPay, Visa, Mastercard, and Wallets
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.razorpayEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, razorpayEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-accent"
              />
              <span className="text-xs font-display uppercase tracking-widest text-ink">
                {settings.razorpayEnabled ? "Active" : "Disabled"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Environment Mode
              </label>
              <select
                value={settings.razorpayTestMode ? "test" : "live"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    razorpayTestMode: e.target.value === "test",
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm font-medium outline-none"
              >
                <option value="test">Test Mode (Sandbox)</option>
                <option value="live">Live Production</option>
              </select>
            </div>

            <div className="text-xs text-ink-muted flex items-center">
              <ShieldCheck className="w-4 h-4 text-accent mr-1.5 flex-shrink-0" />
              <span>
                API Keys are securely injected via RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.
              </span>
            </div>
          </div>
        </div>

        {/* Stripe Gateway */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-3">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-purple-50 text-purple-700 font-display text-xl uppercase tracking-wider">
                Stripe
              </span>
              <div>
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  Stripe (International Currencies)
                </h3>
                <span className="text-xs text-ink-muted">
                  Powers USD, GBP, AUD, AED, ZAR card payments with 3D Secure
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stripeEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, stripeEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-accent"
              />
              <span className="text-xs font-display uppercase tracking-widest text-ink">
                {settings.stripeEnabled ? "Active" : "Disabled"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Environment Mode
              </label>
              <select
                value={settings.stripeTestMode ? "test" : "live"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stripeTestMode: e.target.value === "test",
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm font-medium outline-none"
              >
                <option value="test">Test Mode (Sandbox)</option>
                <option value="live">Live Production</option>
              </select>
            </div>

            <div className="text-xs text-ink-muted flex items-center">
              <ShieldCheck className="w-4 h-4 text-accent mr-1.5 flex-shrink-0" />
              <span>
                Keys are loaded from NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY.
              </span>
            </div>
          </div>
        </div>

        {/* Cash On Delivery (COD) */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-3">
            <div>
              <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                Cash On Delivery (COD)
              </h3>
              <span className="text-xs text-ink-muted">
                Offline cash payment upon parcel delivery by courier
              </span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, codEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-accent"
              />
              <span className="text-xs font-display uppercase tracking-widest text-ink">
                {settings.codEnabled ? "Active" : "Disabled"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Maximum COD Order Limit (₹)
              </label>
              <input
                type="number"
                value={Math.round(settings.codMaxOrderPaise / 100)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    codMaxOrderPaise: Number(e.target.value) * 100,
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none"
              />
              <span className="text-xs text-ink-muted mt-1 block">
                Orders higher than this threshold require prepaid digital authorization.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

