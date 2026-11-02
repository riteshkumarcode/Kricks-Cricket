"use client";

import React, { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HeroSlideData } from "@/components/storefront/HeroSlider";
import {
  Save,
  Sliders,
  Eye,
  CheckCircle,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Monitor,
  Smartphone,
} from "lucide-react";

export default function AdminHomeBuilderPage() {
  const [slides, setSlides] = useState<
    (HeroSlideData & { id: string; active?: boolean })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlideIdx, setSelectedSlideIdx] = useState(0);

  const [announcementText, setAnnouncementText] = useState(
    "Pre-season workshop dispatch: Free knocking-in on all Grade 1 bats this week."
  );
  const [announcementHighlight, setAnnouncementHighlight] =
    useState("Free knocking-in");
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  const [clubHeading, setClubHeading] = useState(
    "KIT OUT YOUR SQUAD WITH CUSTOM WORKSHOP BATS"
  );
  const [clubSubtext, setClubSubtext] = useState(
    "Tiered wholesale discounts starting from 10 bats with bespoke crest laser-engraving."
  );

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/hero-slides")
      .then((res) => res.json())
      .then((data) => {
        if (data.slides && Array.isArray(data.slides)) {
          setSlides(data.slides);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSlideChange = (field: string, val: any) => {
    setSlides((prev) => {
      const copy = [...prev];
      if (field === "hl1") {
        copy[selectedSlideIdx].hl[0] = val;
      } else if (field === "hl2") {
        copy[selectedSlideIdx].hl[1] = val;
      } else {
        (copy[selectedSlideIdx] as any)[field] = val;
      }
      return copy;
    });
  };

  const handlePublish = async () => {
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slides),
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg("Home page blocks published to storefront!");
        setTimeout(() => setToastMsg(null), 3000);
      }
    } catch {
      alert("Error publishing changes");
    }
  };

  const activeSlide = slides[selectedSlideIdx] || slides[0];

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMsg}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="Storefront CMS"
        title="Home Page Builder"
        description="Reorder blocks, edit framed hero slides, announcement bar, and promotional banners with live preview."
      >
        <button
          onClick={handlePublish}
          className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Publish to Storefront</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Blocks & Hero Slides Manager (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Announcement Bar Block */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-2">
              <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                Announcement Bar
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-xs font-display uppercase tracking-wider text-ink">
                  Active
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Announcement Text
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Highlighted Words (Underlined)
                </label>
                <input
                  type="text"
                  value={announcementHighlight}
                  onChange={(e) => setAnnouncementHighlight(e.target.value)}
                  className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Hero Slides Editor */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-2">
              <div>
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  Hero Framed Slides
                </h3>
                <p className="text-xs text-ink-muted">
                  4 framed full-bleed slider sequences with Ken Burns motion
                </p>
              </div>
            </div>

            {/* Slides Tabs */}
            <div className="flex flex-wrap gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={() => setSelectedSlideIdx(idx)}
                  className={`px-4 py-2 font-display text-sm uppercase tracking-wider border transition-colors ${
                    selectedSlideIdx === idx
                      ? "bg-black text-white border-black"
                      : "bg-[#F4F3F0] text-ink border-[#E6E3DE] hover:border-black"
                  }`}
                >
                  Slide 0{idx + 1}: {s.label}
                </button>
              ))}
            </div>

            {activeSlide && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                      Kicker Label
                    </label>
                    <input
                      type="text"
                      value={activeSlide.kick}
                      onChange={(e) => handleSlideChange("kick", e.target.value)}
                      className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                      Tab / Counter Label
                    </label>
                    <input
                      type="text"
                      value={activeSlide.label}
                      onChange={(e) => handleSlideChange("label", e.target.value)}
                      className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                      Headline Line 1
                    </label>
                    <input
                      type="text"
                      value={activeSlide.hl[0]}
                      onChange={(e) => handleSlideChange("hl1", e.target.value)}
                      className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-display text-xl uppercase tracking-wider outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                      Headline Line 2
                    </label>
                    <input
                      type="text"
                      value={activeSlide.hl[1]}
                      onChange={(e) => handleSlideChange("hl2", e.target.value)}
                      className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-display text-xl uppercase tracking-wider outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Subtext
                  </label>
                  <textarea
                    rows={2}
                    value={activeSlide.sub}
                    onChange={(e) => handleSlideChange("sub", e.target.value)}
                    className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                      CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={activeSlide.cta}
                      onChange={(e) => handleSlideChange("cta", e.target.value)}
                      className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                      CTA Target URL
                    </label>
                    <input
                      type="text"
                      value={activeSlide.href}
                      onChange={(e) => handleSlideChange("href", e.target.value)}
                      className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-xs outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                    Hero Photo Asset URL
                  </label>
                  <input
                    type="text"
                    value={activeSlide.img}
                    onChange={(e) => handleSlideChange("img", e.target.value)}
                    className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-xs outline-none focus:border-black"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Club CTA Block */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
              Club & Wholesale CTA Block
            </h3>
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Headline
              </label>
              <input
                type="text"
                value={clubHeading}
                onChange={(e) => setClubHeading(e.target.value)}
                className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] font-display text-xl uppercase tracking-wider outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Subtext
              </label>
              <textarea
                rows={2}
                value={clubSubtext}
                onChange={(e) => setClubSubtext(e.target.value)}
                className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Device Simulation Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E6E3DE] p-4 flex items-center justify-between">
            <span className="font-display text-lg uppercase tracking-wider text-ink">
              Live Preview
            </span>
            <div className="flex items-center gap-1 bg-[#F4F3F0] p-1 border border-[#E6E3DE]">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 ${
                  previewDevice === "desktop"
                    ? "bg-black text-white"
                    : "text-ink-muted hover:text-ink"
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 ${
                  previewDevice === "mobile"
                    ? "bg-black text-white"
                    : "text-ink-muted hover:text-ink"
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Device Mockup */}
          <div
            className={`mx-auto bg-black border-4 border-black shadow-2xl transition-all duration-300 overflow-hidden relative ${
              previewDevice === "mobile"
                ? "w-[320px] h-[580px] rounded-2xl"
                : "w-full aspect-[4/3] rounded-sm"
            }`}
          >
            {/* Slide Visual inside mockup */}
            {activeSlide && (
              <div
                className="w-full h-full bg-cover bg-center flex flex-col justify-end p-6 text-white relative"
                style={{
                  backgroundImage: `url(${activeSlide.img})`,
                }}
              >
                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] uppercase font-display tracking-widest text-accent bg-black/40 px-2 py-0.5 inline-block">
                    {activeSlide.kick}
                  </span>
                  <h4 className="font-display text-2xl md:text-3xl leading-tight uppercase">
                    {activeSlide.hl[0]}
                    <br />
                    {activeSlide.hl[1]}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-2">
                    {activeSlide.sub}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block bg-white text-black font-display text-xs uppercase px-3 py-1.5 tracking-wider">
                      {activeSlide.cta} →
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

