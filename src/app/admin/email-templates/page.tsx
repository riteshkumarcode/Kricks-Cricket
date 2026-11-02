"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmailTemplateRecord, getEmailTemplates } from "@/lib/cms-store";
import { Save, Mail, Send, CheckCircle, Eye } from "lucide-react";

export default function AdminEmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplateRecord[]>([
    {
      id: "order_confirmation",
      name: "Order Confirmation",
      subject: "Your Krickscricket Order {{orderNumber}} has been confirmed",
      previewHeader: "Order Confirmed & Sent to Workshop",
      bodyNote:
        "We have received your order and our master batmakers are now preparing your cleft.",
    },
    {
      id: "shipping_update",
      name: "Dispatch & Tracking",
      subject:
        "Your cricket bat has been dispatched! Track with {{carrier}}",
      previewHeader: "Dispatched via {{carrier}}",
      bodyNote:
        "Your blade has cleared our quality inspection and is on its way in protective packaging.",
    },
    {
      id: "abandoned_recovery",
      name: "Abandoned Cart Reminder",
      subject: "Your custom willow bat is waiting on the workbench",
      previewHeader: "Complete Your Custom Bat",
      bodyNote:
        "We noticed you left items in your cart. Claim 10% off with coupon WELCOME10.",
    },
    {
      id: "bulk_quote",
      name: "Bulk Club Quote",
      subject: "Official Quote from Krickscricket Workshop - {{clubName}}",
      previewHeader: "Special Club Pricing Estimate",
      bodyNote:
        "Thank you for inquiring with Krickscricket. Attached is your tiered quotation.",
    },
  ]);

  const [selectedId, setSelectedId] = useState("order_confirmation");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeTemplate =
    templates.find((t) => t.id === selectedId) || templates[0];

  const handleUpdate = (field: keyof EmailTemplateRecord, val: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === selectedId ? { ...t, [field]: val } : t))
    );
  };

  const handleSendTest = () => {
    setToastMsg(`Test preview email for "${activeTemplate.name}" dispatched!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    setToastMsg("Email template saved!");
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
        kicker="Transactional Comms"
        title="Email Templates"
        description="Edit subject lines, customer notices, and branded layout copy for automated transactional emails."
      >
        <button
          onClick={handleSendTest}
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <Send className="w-4 h-4 text-accent" />
          <span>Send Test Email</span>
        </button>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Template</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Templates list (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E6E3DE] p-4 space-y-2">
          <span className="text-xs font-display uppercase tracking-widest text-ink-muted block pb-2 border-b border-[#E6E3DE]">
            Email Sequences
          </span>

          <div className="space-y-1">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedId(tpl.id)}
                className={`p-3 border transition-colors cursor-pointer ${
                  tpl.id === selectedId
                    ? "border-black bg-[#F4F3F0]"
                    : "border-transparent hover:bg-[#F4F3F0]"
                }`}
              >
                <h4 className="font-display text-base uppercase tracking-wider text-ink">
                  {tpl.name}
                </h4>
                <span className="text-xs text-ink-muted truncate block">
                  {tpl.subject}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Template Editor (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E6E3DE] p-6 space-y-4">
          <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
            Edit: {activeTemplate.name}
          </h3>

          <div>
            <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
              Email Subject Line
            </label>
            <input
              type="text"
              value={activeTemplate.subject}
              onChange={(e) => handleUpdate("subject", e.target.value)}
              className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
              Header Banner Title
            </label>
            <input
              type="text"
              value={activeTemplate.previewHeader}
              onChange={(e) => handleUpdate("previewHeader", e.target.value)}
              className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
              Main Body Notice / Message Block
            </label>
            <textarea
              rows={4}
              value={activeTemplate.bodyNote}
              onChange={(e) => handleUpdate("bodyNote", e.target.value)}
              className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
            />
          </div>

          {/* Branded HTML Preview Mockup */}
          <div className="pt-4 border-t border-[#E6E3DE]">
            <span className="text-xs font-display uppercase tracking-widest text-ink-muted block mb-2">
              Customer Inbox Render Preview:
            </span>
            <div className="bg-[#111111] p-6 text-white max-w-md mx-auto space-y-4">
              <span className="font-display text-2xl uppercase tracking-widest text-white border-b border-white/20 pb-2 block">
                KRICKSCRICKET
              </span>
              <h4 className="font-display text-xl uppercase text-accent">
                {activeTemplate.previewHeader}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-body">
                {activeTemplate.bodyNote}
              </p>
              <div className="pt-2 border-t border-white/20 text-[10px] text-white/50 uppercase font-display tracking-widest">
                CRICKET BATS MADE BY HAND · NEW DELHI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

