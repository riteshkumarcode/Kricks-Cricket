"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Save, Plus, Trash2, CheckCircle, ExternalLink } from "lucide-react";

export default function AdminNavigationPage() {
  const [headerLinks, setHeaderLinks] = useState([
    { label: "Leather Bats", href: "/leather-bats", hasMega: true },
    { label: "Tennis Bats", href: "/tennis-bats", hasMega: true },
    { label: "Customised Bat", href: "/custom-bat", hasMega: false },
    { label: "Accessories", href: "/accessories", hasMega: false },
    { label: "Club Orders", href: "/bulk-enquiry", hasMega: false },
  ]);

  const [footerCols, setFooterCols] = useState([
    {
      title: "Workshop",
      links: [
        { label: "Custom Bat Builder", href: "/custom-bat" },
        { label: "Knocking-In & Repairs", href: "/accessories" },
        { label: "Bat Size Finder", href: "/#finder" },
        { label: "Bulk & Club Enquiries", href: "/bulk-enquiry" },
      ],
    },
    {
      title: "Help & Policies",
      links: [
        { label: "Track My Order", href: "/account" },
        { label: "Shipping & Returns", href: "/pages/shipping-returns" },
        { label: "Privacy Policy", href: "/pages/privacy" },
        { label: "Terms of Service", href: "/pages/terms" },
      ],
    },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    setToastMsg("Navigation menus updated successfully!");
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
        kicker="Storefront Structure"
        title="Navigation & Mega Menu"
        description="Configure desktop rolling links, mega menu columns, mobile drawer, and footer directory."
      >
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Navigation</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Header Navigation Menu */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
            Main Header Nav Links
          </h3>

          <div className="space-y-3">
            {headerLinks.map((link, idx) => (
              <div
                key={idx}
                className="p-3 border border-[#E6E3DE] bg-[#F4F3F0] flex items-center justify-between gap-3"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const next = [...headerLinks];
                      next[idx].label = e.target.value;
                      setHeaderLinks(next);
                    }}
                    className="p-1.5 bg-white border border-[#E6E3DE] text-sm font-medium outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => {
                      const next = [...headerLinks];
                      next[idx].href = e.target.value;
                      setHeaderLinks(next);
                    }}
                    className="p-1.5 bg-white border border-[#E6E3DE] text-xs font-mono outline-none focus:border-black"
                  />
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={link.hasMega}
                    onChange={(e) => {
                      const next = [...headerLinks];
                      next[idx].hasMega = e.target.checked;
                      setHeaderLinks(next);
                    }}
                    className="accent-accent"
                  />
                  <span className="text-[11px] font-display uppercase tracking-widest text-ink-muted">
                    Mega Menu
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
            Footer Columns & Links
          </h3>

          <div className="space-y-6">
            {footerCols.map((col, cIdx) => (
              <div key={cIdx} className="space-y-2">
                <input
                  type="text"
                  value={col.title}
                  onChange={(e) => {
                    const next = [...footerCols];
                    next[cIdx].title = e.target.value;
                    setFooterCols(next);
                  }}
                  className="font-display text-lg uppercase tracking-wider text-ink p-1 bg-[#F4F3F0] border border-[#E6E3DE] w-full"
                />

                <div className="pl-3 border-l-2 border-accent space-y-1.5">
                  {col.links.map((item, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const next = [...footerCols];
                          next[cIdx].links[lIdx].label = e.target.value;
                          setFooterCols(next);
                        }}
                        className="flex-1 p-1 bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-medium"
                      />
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => {
                          const next = [...footerCols];
                          next[cIdx].links[lIdx].href = e.target.value;
                          setFooterCols(next);
                        }}
                        className="w-36 p-1 bg-[#F4F3F0] border border-[#E6E3DE] text-[10px] font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

