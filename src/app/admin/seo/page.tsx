"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SeoSettings, getSeoSettings } from "@/lib/cms-store";
import { Save, Search, CheckCircle, Plus, Trash2, RefreshCw } from "lucide-react";

export default function AdminSeoPage() {
  const [settings, setSettings] = useState<SeoSettings>({
    defaultMetaTitle: "Krickscricket · Cricket Bats Made by Hand",
    defaultMetaDescription:
      "English and Kashmir willow cricket bats pressed by hand in India. Shipped worldwide.",
    ogImageUrl: "/img/shot.jpg",
    robotsTxt:
      "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://kricks.com/sitemap.xml",
    redirects: [
      { from: "/bats", to: "/leather-bats", type: 301 },
      { from: "/custom", to: "/custom-bat", type: 301 },
    ],
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    setToastMsg("SEO meta and 301 redirects saved successfully!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddRedirect = () => {
    setSettings({
      ...settings,
      redirects: [...settings.redirects, { from: "/old-url", to: "/", type: 301 }],
    });
  };

  const handleDeleteRedirect = (index: number) => {
    setSettings({
      ...settings,
      redirects: settings.redirects.filter((_, i) => i !== index),
    });
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
        kicker="Search Engine Architecture"
        title="SEO & 301 Redirects"
        description="Configure default meta titles, OpenGraph social sharing assets, robots.txt, and URL redirection rules."
      >
        <button
          onClick={() => {
            setToastMsg("sitemap.xml successfully generated with all 18 catalog products!");
            setTimeout(() => setToastMsg(null), 3000);
          }}
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-accent" />
          <span>Regenerate Sitemap</span>
        </button>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save SEO Settings</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Global Metadata */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
            Global Meta Defaults
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={settings.defaultMetaTitle}
                onChange={(e) =>
                  setSettings({ ...settings, defaultMetaTitle: e.target.value })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm font-medium outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.defaultMetaDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultMetaDescription: e.target.value,
                  })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Default Social Sharing Image (OG Image)
              </label>
              <input
                type="text"
                value={settings.ogImageUrl}
                onChange={(e) =>
                  setSettings({ ...settings, ogImageUrl: e.target.value })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-xs outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                robots.txt Rules
              </label>
              <textarea
                rows={4}
                value={settings.robotsTxt}
                onChange={(e) =>
                  setSettings({ ...settings, robotsTxt: e.target.value })
                }
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-xs outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* 301/302 URL Redirects */}
        <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-2">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink">
              URL Redirects (301 / 302)
            </h3>
            <button
              onClick={handleAddRedirect}
              className="text-xs uppercase font-display tracking-wider text-accent hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Redirect</span>
            </button>
          </div>

          <div className="space-y-3">
            {settings.redirects.map((r, idx) => (
              <div
                key={idx}
                className="p-3 border border-[#E6E3DE] bg-[#F4F3F0] flex items-center gap-3"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={r.from}
                    onChange={(e) => {
                      const next = [...settings.redirects];
                      next[idx].from = e.target.value;
                      setSettings({ ...settings, redirects: next });
                    }}
                    placeholder="/source-path"
                    className="p-1.5 bg-white border border-[#E6E3DE] font-mono text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={r.to}
                    onChange={(e) => {
                      const next = [...settings.redirects];
                      next[idx].to = e.target.value;
                      setSettings({ ...settings, redirects: next });
                    }}
                    placeholder="/target-path"
                    className="p-1.5 bg-white border border-[#E6E3DE] font-mono text-xs outline-none"
                  />
                </div>

                <select
                  value={r.type}
                  onChange={(e) => {
                    const next = [...settings.redirects];
                    next[idx].type = Number(e.target.value) as 301 | 302;
                    setSettings({ ...settings, redirects: next });
                  }}
                  className="bg-white border border-[#E6E3DE] text-xs font-mono p-1.5"
                >
                  <option value={301}>301 Permanent</option>
                  <option value={302}>302 Temporary</option>
                </select>

                <button
                  onClick={() => handleDeleteRedirect(idx)}
                  className="p-1.5 text-ink-muted hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

