"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CatalogProduct } from "@/lib/catalog";
import { generateBatSvg } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ArrowLeft, Save, Eye, CheckCircle } from "lucide-react";

interface ProductFormProps {
  initialProduct?: CatalogProduct;
  isNew?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  isNew = false,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<CatalogProduct>>(
    initialProduct || {
      id: `bat-${Date.now()}`,
      slug: "",
      name: "",
      subTitle: "Grade 1 English willow",
      cat: "leather",
      price: 2499900,
      compareAtPrice: 2799900,
      was: 2799900,
      badge: "Bestseller",
      grade: 1,
      grains: "10–12",
      grainsCount: 11,
      weight: "2lb 8oz – 2lb 11oz",
      edge: "40 mm",
      profile: "Mid-low middle, full spine",
      blurb: "Pressed by hand from selected willow clefts.",
      bladeColor: "#E8CE95",
      gripColor: "#C3262C",
      stickerColor: "#0A0A0A",
      stickerInkColor: "#F0E3C3",
      gradeLabel: "ENGLISH WILLOW",
      drawingType: "bat",
    }
  );

  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isBat = formData.drawingType === "bat" || !formData.drawingType;

  const handleChange = (
    field: keyof CatalogProduct,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name" && isNew && !prev.slug
        ? { slug: String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-") }
        : {}),
    }));
  };

  const handlePriceChange = (rupees: number) => {
    handleChange("price", Math.round(rupees * 100));
  };

  const handleWasChange = (rupees: number) => {
    handleChange("was", rupees > 0 ? Math.round(rupees * 100) : null);
    handleChange("compareAtPrice", rupees > 0 ? Math.round(rupees * 100) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isNew ? "create" : "update",
          id: formData.id,
          product: formData,
          updates: formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg("Product saved successfully!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1000);
      } else {
        alert(data.error || "Save failed");
      }
    } catch (err: any) {
      alert("Error saving product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const previewSvg = isBat
    ? generateBatSvg({
        blade: formData.bladeColor || undefined,
        grip: formData.gripColor || undefined,
        sticker: formData.stickerColor || undefined,
        stickerInk: formData.stickerInkColor || undefined,
        label: formData.gradeLabel || undefined,
        view: "face",
      })
    : generateItemSvg(
        (formData.drawingType as any) || "balls",
        formData.color1 || undefined,
        formData.color2 || undefined
      );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMsg}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="Catalog Management"
        title={isNew ? "Create New Product" : `Edit: ${formData.name}`}
        description="Configure cleft specifications, retail pricing, and drawing styling."
      >
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Product"}</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Fields (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
              General Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                  placeholder="e.g. Pro Edition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                  placeholder="e.g. pro-edition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Category *
                </label>
                <select
                  value={formData.cat || "leather"}
                  onChange={(e) => handleChange("cat", e.target.value)}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm uppercase"
                >
                  <option value="leather">Leather Bats</option>
                  <option value="tennis">Tennis Bats</option>
                  <option value="acc">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subTitle || ""}
                  onChange={(e) => handleChange("subTitle", e.target.value)}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                  placeholder="e.g. Grade 1 English willow"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Description / Blurb
              </label>
              <textarea
                rows={3}
                value={formData.blurb || ""}
                onChange={(e) => handleChange("blurb", e.target.value)}
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-normal text-sm"
                placeholder="Product description..."
              />
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
              Pricing & Merchandising
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={Math.round((formData.price || 0) / 100)}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Was / Compare-at Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.was ? Math.round(formData.was / 100) : ""}
                  onChange={(e) => handleWasChange(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Badge
                </label>
                <input
                  type="text"
                  value={formData.badge || ""}
                  onChange={(e) => handleChange("badge", e.target.value)}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                  placeholder="e.g. Bestseller, New"
                />
              </div>
            </div>
          </div>

          {/* Workshop Bat Specifications */}
          {isBat && (
            <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
              <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
                Bat Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Willow Grade (1–4)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={formData.grade || 1}
                    onChange={(e) => handleChange("grade", Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Grains
                  </label>
                  <input
                    type="text"
                    value={formData.grains || ""}
                    onChange={(e) => handleChange("grains", e.target.value)}
                    className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                    placeholder="e.g. 10–12"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Weight Range
                  </label>
                  <input
                    type="text"
                    value={formData.weight || ""}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                    placeholder="e.g. 2lb 8oz – 2lb 11oz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Edge Thickness
                  </label>
                  <input
                    type="text"
                    value={formData.edge || ""}
                    onChange={(e) => handleChange("edge", e.target.value)}
                    className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                    placeholder="e.g. 40 mm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Profile Description
                  </label>
                  <input
                    type="text"
                    value={formData.profile || ""}
                    onChange={(e) => handleChange("profile", e.target.value)}
                    className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] focus:border-black outline-none font-medium text-sm"
                    placeholder="e.g. Mid-low middle, full spine"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Drawing Tokens & Live SVG Preview */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-2">
              <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                Drawing Preview
              </h3>
              <Eye className="w-4 h-4 text-accent" />
            </div>

            {/* SVG Render box */}
            <div className="w-full aspect-square bg-[#F4F3F0] border border-[#E6E3DE] p-4 flex items-center justify-center">
              <div
                className="w-48 h-48 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
            </div>

            {isBat && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Blade Tint (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.bladeColor || "#E8CE95"}
                      onChange={(e) => handleChange("bladeColor", e.target.value)}
                      className="w-8 h-8 p-0 border border-[#E6E3DE] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.bladeColor || "#E8CE95"}
                      onChange={(e) => handleChange("bladeColor", e.target.value)}
                      className="flex-1 p-1.5 bg-[#F4F3F0] text-xs font-mono border border-[#E6E3DE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Grip Color (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.gripColor || "#C3262C"}
                      onChange={(e) => handleChange("gripColor", e.target.value)}
                      className="w-8 h-8 p-0 border border-[#E6E3DE] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.gripColor || "#C3262C"}
                      onChange={(e) => handleChange("gripColor", e.target.value)}
                      className="flex-1 p-1.5 bg-[#F4F3F0] text-xs font-mono border border-[#E6E3DE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Sticker Color (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.stickerColor || "#0A0A0A"}
                      onChange={(e) => handleChange("stickerColor", e.target.value)}
                      className="w-8 h-8 p-0 border border-[#E6E3DE] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.stickerColor || "#0A0A0A"}
                      onChange={(e) => handleChange("stickerColor", e.target.value)}
                      className="flex-1 p-1.5 bg-[#F4F3F0] text-xs font-mono border border-[#E6E3DE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Grade Label Text
                  </label>
                  <input
                    type="text"
                    value={formData.gradeLabel || ""}
                    onChange={(e) => handleChange("gradeLabel", e.target.value)}
                    className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-display uppercase tracking-widest"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
