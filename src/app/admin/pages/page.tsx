"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CmsPage, getCmsPages } from "@/lib/cms-store";
import { Plus, Edit3, Trash2, CheckCircle, Save, ExternalLink } from "lucide-react";

export default function AdminPagesManager() {
  const [pages, setPages] = useState<CmsPage[]>([
    {
      id: "page-about",
      slug: "about",
      title: "About Krickscricket",
      subtitle: "Heritage batmaking from J&K and Essex clefts.",
      content:
        "Founded by cricketers for cricketers, Krickscricket crafts bespoke cricket blades using traditional English and Kashmir willow.",
      status: "published",
      updatedAt: "2026-11-01",
    },
    {
      id: "page-shipping",
      slug: "shipping-returns",
      title: "Shipping & Returns",
      subtitle: "Insured domestic and international courier delivery.",
      content:
        "We deliver across India via Blue Dart and Delhivery, and worldwide via DHL Express. All orders are packed in rigid protective bat sleeves.",
      status: "published",
      updatedAt: "2026-11-01",
    },
    {
      id: "page-privacy",
      slug: "privacy",
      title: "Privacy Policy",
      subtitle: "How we protect and manage your personal data.",
      content:
        "We treat your data with the utmost security. We never sell your personal information or share payment credentials.",
      status: "published",
      updatedAt: "2026-11-01",
    },
    {
      id: "page-terms",
      slug: "terms",
      title: "Terms of Service",
      subtitle: "Workshop rules, warranties and store conditions.",
      content:
        "All bats carry a 12-month workshop warranty against manufacturer defects in the handle and splice.",
      status: "published",
      updatedAt: "2026-11-01",
    },
  ]);

  const [activePageId, setActivePageId] = useState<string>("page-about");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedPage = pages.find((p) => p.id === activePageId) || pages[0];

  const handleUpdate = (field: keyof CmsPage, val: any) => {
    setPages((prev) =>
      prev.map((p) => (p.id === activePageId ? { ...p, [field]: val } : p))
    );
  };

  const handleSave = () => {
    setToastMsg(`Page "${selectedPage.title}" saved successfully!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateNew = () => {
    const newPage: CmsPage = {
      id: `page-${Date.now()}`,
      slug: `custom-page-${pages.length + 1}`,
      title: "New Policy / Story Page",
      subtitle: "Brief description of this page",
      content: "Enter page body text here...",
      status: "draft",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setPages([...pages, newPage]);
    setActivePageId(newPage.id);
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
        kicker="Content Management"
        title="Pages (CMS)"
        description="Publish and manage brand story, workshop policies, and customer service pages."
      >
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>New Page</span>
        </button>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Page</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pages List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E6E3DE] p-4 space-y-2">
          <span className="text-xs font-display uppercase tracking-widest text-ink-muted block pb-2 border-b border-[#E6E3DE]">
            All Pages ({pages.length})
          </span>

          <div className="space-y-1">
            {pages.map((p) => (
              <div
                key={p.id}
                onClick={() => setActivePageId(p.id)}
                className={`p-3 border transition-colors cursor-pointer flex items-center justify-between ${
                  p.id === activePageId
                    ? "border-black bg-[#F4F3F0]"
                    : "border-transparent hover:bg-[#F4F3F0]"
                }`}
              >
                <div>
                  <h4 className="font-display text-base uppercase tracking-wider text-ink leading-tight">
                    {p.title}
                  </h4>
                  <span className="text-xs text-ink-muted font-mono">
                    /pages/{p.slug}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-display uppercase tracking-widest px-1.5 py-0.5 ${
                    p.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Page Editor (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E6E3DE] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-2">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink">
              Edit: {selectedPage.title}
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedPage.status}
                onChange={(e) => handleUpdate("status", e.target.value)}
                className="bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-display uppercase tracking-wider px-2 py-1"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={selectedPage.title}
                onChange={(e) => handleUpdate("title", e.target.value)}
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={selectedPage.slug}
                onChange={(e) => handleUpdate("slug", e.target.value)}
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-xs outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={selectedPage.subtitle || ""}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
              className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
              Body Content (Markdown / Text)
            </label>
            <textarea
              rows={8}
              value={selectedPage.content}
              onChange={(e) => handleUpdate("content", e.target.value)}
              className="w-full p-3 bg-[#F4F3F0] border border-[#E6E3DE] text-sm font-normal outline-none focus:border-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

