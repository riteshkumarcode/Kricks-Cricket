"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryData, getCategories } from "@/lib/cms-store";
import { Save, Plus, Edit2, Layers, CheckCircle } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([
    {
      id: "cat-leather",
      name: "Leather Bats",
      slug: "leather-bats",
      description: "English willow bats pressed for match balls and competitive cricket.",
      badge: "Match Grade",
      headerImage: "/img/leather-hero.jpg",
      buyingGuideTitle: "Choosing your English Willow",
      buyingGuideText: "Grade 1 willow features 8-12 tight straight grains, big edges (38-40mm) and optimal ping.",
      productCount: 6,
    },
    {
      id: "cat-tennis",
      name: "Tennis Bats",
      slug: "tennis-bats",
      description: "Lightweight Kashmir willow and composite blades engineered for taped & hard tennis balls.",
      badge: "Fast Swing",
      headerImage: "/img/tennis-hero.jpg",
      buyingGuideTitle: "Tennis & Box Cricket Selection",
      buyingGuideText: "Engineered scoop profiles give ultra-light pick-up under 1000g for rapid swing speeds.",
      productCount: 6,
    },
    {
      id: "cat-accessories",
      name: "Accessories & Care",
      slug: "accessories",
      description: "Bat care kits, raw linseed oil, octopus grips, padded covers, and mallets.",
      badge: "Workshop Goods",
      headerImage: "/img/care-hero.jpg",
      buyingGuideTitle: "Bat Longevity & Workshop Care",
      buyingGuideText: "Regular light linseed oiling and edge protection prolong the blade life and preserve stroke.",
      productCount: 6,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleUpdate = (id: string, field: keyof CategoryData, val: any) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const handleSave = () => {
    setToastMsg("Category settings updated successfully!");
    setEditingId(null);
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
        kicker="Catalog Architecture"
        title="Categories & Collections"
        description="Configure category banners, buying guides, and filter sets."
      >
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-[#E6E3DE] flex flex-col justify-between"
          >
            <div>
              {/* Image banner preview */}
              <div
                className="h-36 bg-cover bg-center border-b border-[#E6E3DE] relative"
                style={{ backgroundImage: `url(${cat.headerImage})` }}
              >
                <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-display uppercase tracking-widest px-2 py-0.5">
                  {cat.badge}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-ink text-xs font-display uppercase tracking-wider px-2 py-1">
                  {cat.productCount} Products
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleUpdate(cat.id, "name", e.target.value)}
                    className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] font-display text-xl uppercase tracking-wider focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={cat.slug}
                    onChange={(e) => handleUpdate(cat.id, "slug", e.target.value)}
                    className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-mono focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Intro Blurb
                  </label>
                  <textarea
                    rows={2}
                    value={cat.description}
                    onChange={(e) =>
                      handleUpdate(cat.id, "description", e.target.value)
                    }
                    className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-normal focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Buying Guide Title
                  </label>
                  <input
                    type="text"
                    value={cat.buyingGuideTitle}
                    onChange={(e) =>
                      handleUpdate(cat.id, "buyingGuideTitle", e.target.value)
                    }
                    className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-medium focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Buying Guide Text
                  </label>
                  <textarea
                    rows={3}
                    value={cat.buyingGuideText}
                    onChange={(e) =>
                      handleUpdate(cat.id, "buyingGuideText", e.target.value)
                    }
                    className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-normal focus:border-black outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F4F3F0] border-t border-[#E6E3DE] flex items-center justify-between">
              <span className="text-xs text-ink-muted">Active in Mega Menu</span>
              <button
                type="button"
                onClick={handleSave}
                className="text-xs uppercase font-display tracking-wider text-accent hover:underline"
              >
                Update Category
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

