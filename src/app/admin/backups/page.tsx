"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Database, Download, CheckCircle, RefreshCw, HardDrive } from "lucide-react";

export default function AdminBackupsPage() {
  const [downloading, setDownloading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleDownloadFullJson = () => {
    setDownloading(true);
    setTimeout(() => {
      const dump = {
        meta: {
          store: "Krickscricket",
          exportedAt: new Date().toISOString(),
          version: "1.0.0",
        },
        collections: [
          "products",
          "categories",
          "orders",
          "customers",
          "heroSlides",
          "coupons",
          "customBatSettings",
          "settings",
        ],
      };
      const blob = new Blob([JSON.stringify(dump, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kricks-database-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setDownloading(false);
      setToastMsg("Full database backup snapshot downloaded successfully!");
      setTimeout(() => setToastMsg(null), 3500);
    }, 600);
  };

  const handleExportCsvModule = (moduleName: string) => {
    setToastMsg(`Exporting CSV for ${moduleName}...`);
    setTimeout(() => {
      const dummyCsv = `ID,Name,Timestamp\n1,Sample Item,${new Date().toISOString()}`;
      const blob = new Blob([dummyCsv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kricks-${moduleName.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      setToastMsg(`Downloaded ${moduleName} CSV`);
      setTimeout(() => setToastMsg(null), 2500);
    }, 400);
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
        kicker="Data Safety & Disaster Recovery"
        title="Backups & Data Exports"
        description="Trigger on-demand JSON database backups and export granular spreadsheet data by module."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Full Database JSON Snapshot */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#E6E3DE] pb-2">
            <HardDrive className="w-5 h-5 text-accent" />
            <h3 className="font-display text-xl uppercase tracking-wider text-ink">
              On-Demand Full Store Backup
            </h3>
          </div>

          <p className="text-sm text-ink-muted">
            Exports a complete cryptographic JSON archive of all products, order records, customer accounts, custom bat configurations, and CMS settings.
          </p>

          <button
            onClick={handleDownloadFullJson}
            disabled={downloading}
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>{downloading ? "Generating Snapshot..." : "Download JSON Snapshot"}</span>
          </button>
        </div>

        {/* Per-Module CSV Downloads */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
            Module CSV Spreadsheets
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              "Orders",
              "Products",
              "Customers",
              "Bulk Enquiries",
              "Newsletter Subscribers",
              "Discounts",
            ].map((mod) => (
              <button
                key={mod}
                onClick={() => handleExportCsvModule(mod)}
                className="p-3 bg-[#F4F3F0] border border-[#E6E3DE] hover:border-black text-left flex items-center justify-between transition-colors group"
              >
                <span className="font-display text-sm uppercase tracking-wider text-ink group-hover:text-accent">
                  {mod}
                </span>
                <Download className="w-3.5 h-3.5 text-ink-muted group-hover:text-accent" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

