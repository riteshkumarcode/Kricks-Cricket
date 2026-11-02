"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NewsletterSubscriber, getNewsletterSubscribers } from "@/lib/cms-store";
import { Download, Mail, CheckCircle } from "lucide-react";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([
    {
      email: "rohit.fans@gmail.com",
      subscribedAt: "2026-10-15",
      source: "Footer Form",
      status: "active",
    },
    {
      email: "virat.18@cricket.org",
      subscribedAt: "2026-10-20",
      source: "Footer Form",
      status: "active",
    },
    {
      email: "coach.anand@mumbai.in",
      subscribedAt: "2026-10-29",
      source: "Bulk Modal",
      status: "active",
    },
  ]);

  const [doubleOptIn, setDoubleOptIn] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleExportCsv = () => {
    const headers = "Email,Subscribed At,Source,Status\n";
    const rows = subscribers
      .map((s) => `"${s.email}","${s.subscribedAt}","${s.source}","${s.status}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kricks-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const columns: Column<NewsletterSubscriber>[] = [
    {
      key: "email",
      header: "Subscriber Email",
      render: (row) => (
        <span className="font-mono text-sm font-medium text-ink flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-accent" />
          {row.email}
        </span>
      ),
    },
    {
      key: "source",
      header: "Capture Source",
      render: (row) => (
        <span className="text-xs uppercase font-display tracking-widest text-ink-muted">
          {row.source}
        </span>
      ),
    },
    {
      key: "date",
      header: "Subscribed Date",
      render: (row) => <span className="text-xs text-ink-muted">{row.subscribedAt}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className="inline-block px-2 py-0.5 text-xs font-display tracking-widest uppercase bg-green-50 text-green-700 border border-green-200">
          {row.status}
        </span>
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
        kicker="Audience Growth"
        title="Newsletter Subscribers"
        description="Manage customer email opt-ins from the storefront footer and lead magnets."
      >
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <Download className="w-4 h-4 text-ink-muted" />
          <span>Export Audience CSV</span>
        </button>
      </AdminPageHeader>

      <div className="bg-white border border-[#E6E3DE] p-4 flex items-center justify-between">
        <div>
          <span className="font-display text-lg uppercase tracking-wider text-ink block">
            Double Opt-in Verification
          </span>
          <span className="text-xs text-ink-muted">
            Require new subscribers to confirm their email address via verification link.
          </span>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={doubleOptIn}
            onChange={(e) => {
              setDoubleOptIn(e.target.checked);
              setToastMsg(
                e.target.checked
                  ? "Double opt-in enabled"
                  : "Double opt-in disabled"
              );
              setTimeout(() => setToastMsg(null), 2000);
            }}
            className="w-4 h-4 accent-accent"
          />
          <span className="text-xs font-display uppercase tracking-widest text-ink">
            {doubleOptIn ? "Enabled" : "Disabled"}
          </span>
        </label>
      </div>

      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={subscribers}
          keyExtractor={(s) => s.email}
          emptyMessage="No newsletter subscribers recorded yet."
        />
      </div>
    </div>
  );
}

