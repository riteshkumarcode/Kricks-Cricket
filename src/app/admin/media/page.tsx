"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaAsset, getMediaAssets } from "@/lib/cms-store";
import {
  Upload,
  Search,
  CheckCircle,
  Copy,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminMediaLibraryPage() {
  const [media, setMedia] = useState<MediaAsset[]>([
    {
      id: "media-1",
      filename: "shot.jpg",
      url: "/img/shot.jpg",
      sizeKb: 342,
      altText: "Cricketer executing cover drive with Kricks Pro Edition bat",
      focalPoint: "50% 40%",
      uploadedAt: "2026-10-01",
    },
    {
      id: "media-2",
      filename: "whites.jpg",
      url: "/img/whites.jpg",
      sizeKb: 288,
      altText: "Custom bat resting on workshop workbench",
      focalPoint: "50% 30%",
      uploadedAt: "2026-10-01",
    },
    {
      id: "media-3",
      filename: "redsky.jpg",
      url: "/img/redsky.jpg",
      sizeKb: 310,
      altText: "Tennis cricket night tournament under floodlights",
      focalPoint: "50% 50%",
      uploadedAt: "2026-10-01",
    },
    {
      id: "media-4",
      filename: "ground.jpg",
      url: "/img/ground.jpg",
      sizeKb: 405,
      altText: "Cricket ground pitch and pavilion",
      focalPoint: "50% 60%",
      uploadedAt: "2026-10-01",
    },
    {
      id: "media-5",
      filename: "leather-hero.jpg",
      url: "/img/leather-hero.jpg",
      sizeKb: 325,
      altText: "Row of English willow bats in seasoning kiln",
      focalPoint: "50% 50%",
      uploadedAt: "2026-10-01",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setToastMsg("Asset URL copied to clipboard!");
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleUpdateAlt = (id: string, alt: string) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === id ? { ...m, altText: alt } : m))
    );
    if (selectedAsset && selectedAsset.id === id) {
      setSelectedAsset({ ...selectedAsset, altText: alt });
    }
  };

  const filtered = media.filter(
    (m) =>
      m.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.altText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMsg}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="Digital Assets"
        title="Media Library"
        description="Browse workshop photographs, manage focal points and SEO alt text, or copy direct image URLs."
      >
        <button
          onClick={() => {
            alert(
              "Local disk / Cloudinary upload simulator: Image dropzone active."
            );
          }}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </AdminPageHeader>

      <div className="bg-white border border-[#E6E3DE] p-4 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search media files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F4F3F0] border border-transparent focus:border-black text-sm outline-none transition-colors"
          />
        </div>
      </div>

      {/* Grid of Media Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedAsset(item)}
            className="bg-white border border-[#E6E3DE] hover:border-black transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div
              className="w-full aspect-square bg-cover bg-center border-b border-[#E6E3DE] relative overflow-hidden"
              style={{ backgroundImage: `url(${item.url})` }}
            >
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl(item.url);
                  }}
                  className="p-2 bg-white text-ink hover:text-accent rounded-full"
                  title="Copy URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3">
              <span className="font-mono text-xs font-medium text-ink block truncate">
                {item.filename}
              </span>
              <span className="text-[10px] text-ink-muted block mt-0.5">
                {item.sizeKb} KB
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Media Detail Drawer */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-black max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-3">
              <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                Asset: {selectedAsset.filename}
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="font-display text-xl text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div
              className="w-full h-48 bg-cover bg-center border border-[#E6E3DE]"
              style={{ backgroundImage: `url(${selectedAsset.url})` }}
            />

            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  SEO Alt Text
                </label>
                <textarea
                  rows={2}
                  value={selectedAsset.altText}
                  onChange={(e) =>
                    handleUpdateAlt(selectedAsset.id, e.target.value)
                  }
                  className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-xs outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Public Direct URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="flex-1 p-2 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-xs"
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedAsset.url)}
                    className="px-3 py-2 bg-black text-white font-display text-xs uppercase tracking-wider"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E6E3DE]">
              <button
                onClick={() => setSelectedAsset(null)}
                className="bg-accent text-white px-5 py-2 font-display text-base uppercase tracking-wider hover:bg-[#A9420F]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

