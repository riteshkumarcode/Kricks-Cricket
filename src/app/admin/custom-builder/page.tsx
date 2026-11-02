"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { generateBatSvg } from "@/lib/svg-bat";
import { formatMoney } from "@/lib/tokens";
import {
  Save,
  Wrench,
  Eye,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";

export default function AdminCustomBuilderPage() {
  const [willowGrades, setWillowGrades] = useState([
    {
      id: "g1-pro",
      name: "Grade 1 Pro English Willow",
      price: 2899900,
      bladeColor: "#E8CE95",
      grains: 11,
      label: "GRADE 1 PRO",
    },
    {
      id: "g1-player",
      name: "Grade 1 Players English Willow",
      price: 2199900,
      bladeColor: "#E3C78E",
      grains: 9,
      label: "PLAYERS",
    },
    {
      id: "g2-match",
      name: "Grade 2 Match English Willow",
      price: 1599900,
      bladeColor: "#DFBF82",
      grains: 7,
      label: "MATCH GRADE",
    },
    {
      id: "kashmir",
      name: "Selected Kashmir Willow",
      price: 899900,
      bladeColor: "#D6B270",
      grains: 6,
      label: "KASHMIR SELECT",
    },
  ]);

  const [selectedGradeIdx, setSelectedGradeIdx] = useState(0);

  const [gripColors, setGripColors] = useState([
    { name: "Signature Red", hex: "#C3262C" },
    { name: "Pure Black", hex: "#0A0A0A" },
    { name: "Clean White", hex: "#F4F3F0" },
    { name: "Burnt Orange", hex: "#C8501A" },
  ]);
  const [selectedGripIdx, setSelectedGripIdx] = useState(0);

  const [stickerColors, setStickerColors] = useState([
    { name: "Black & Cream", hex: "#0A0A0A", ink: "#F0E3C3" },
    { name: "Crimson & White", hex: "#C3262C", ink: "#FFFFFF" },
    { name: "Monochrome White", hex: "#FFFFFF", ink: "#111111" },
  ]);
  const [selectedStickerIdx, setSelectedStickerIdx] = useState(0);

  const [knockingInPrice, setKnockingInPrice] = useState(150000);
  const [maxNameLen, setMaxNameLen] = useState(14);
  const [maxNumLen, setMaxNumLen] = useState(2);
  const [leadTime, setLeadTime] = useState("7–10 working days");

  const [engravedName, setEngravedName] = useState("KRICKS");
  const [engravedNumber, setEngravedNumber] = useState("18");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeGrade = willowGrades[selectedGradeIdx] || willowGrades[0];
  const activeGrip = gripColors[selectedGripIdx] || gripColors[0];
  const activeSticker = stickerColors[selectedStickerIdx] || stickerColors[0];

  const previewSvg = generateBatSvg({
    blade: activeGrade.bladeColor,
    grip: activeGrip.hex,
    sticker: activeSticker.hex,
    stickerInk: activeSticker.ink,
    label: activeGrade.label,
    name: engravedName,
    num: engravedNumber,
    view: "face",
  });

  const handleSave = () => {
    setToastMsg("Custom bat builder settings saved!");
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
        kicker="Configurator Engine"
        title="Custom Bat Builder Settings"
        description="Set up willow cleft grades, grip/sticker palettes, knocking-in pricing, and engraving limits."
      >
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Builder Config</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Config tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Willow Grades Table */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
              Willow Grades & Blade Tints
            </h3>

            <div className="space-y-3">
              {willowGrades.map((g, idx) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGradeIdx(idx)}
                  className={`p-4 border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    selectedGradeIdx === idx
                      ? "border-black bg-[#F4F3F0]"
                      : "border-[#E6E3DE] hover:border-ink-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={g.bladeColor}
                      onChange={(e) => {
                        const next = [...willowGrades];
                        next[idx].bladeColor = e.target.value;
                        setWillowGrades(next);
                      }}
                      className="w-8 h-8 p-0 border border-[#E6E3DE] cursor-pointer"
                      title="Adjust blade tint"
                    />
                    <div>
                      <input
                        type="text"
                        value={g.name}
                        onChange={(e) => {
                          const next = [...willowGrades];
                          next[idx].name = e.target.value;
                          setWillowGrades(next);
                        }}
                        className="font-display text-lg uppercase tracking-wider text-ink bg-transparent border-b border-transparent focus:border-black outline-none"
                      />
                      <span className="text-xs text-ink-muted block">
                        Badge Label: {g.label} · {g.grains} grains
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-display uppercase tracking-widest text-ink-muted">
                      Price:
                    </span>
                    <input
                      type="number"
                      value={Math.round(g.price / 100)}
                      onChange={(e) => {
                        const next = [...willowGrades];
                        next[idx].price = Number(e.target.value) * 100;
                        setWillowGrades(next);
                      }}
                      className="w-28 p-1.5 bg-white border border-[#E6E3DE] font-medium text-sm text-right outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grip & Sticker Palettes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grip Colors */}
            <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
              <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
                Grip Colour Swatches
              </h3>

              <div className="space-y-2">
                {gripColors.map((grp, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedGripIdx(idx)}
                    className={`p-3 border flex items-center justify-between cursor-pointer ${
                      selectedGripIdx === idx
                        ? "border-black bg-[#F4F3F0]"
                        : "border-[#E6E3DE]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-black/20"
                        style={{ backgroundColor: grp.hex }}
                      />
                      <span className="text-sm font-medium text-ink">{grp.name}</span>
                    </div>
                    <span className="font-mono text-xs text-ink-muted">{grp.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticker Colors */}
            <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
              <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
                Sticker Decal Palettes
              </h3>

              <div className="space-y-2">
                {stickerColors.map((stk, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedStickerIdx(idx)}
                    className={`p-3 border flex items-center justify-between cursor-pointer ${
                      selectedStickerIdx === idx
                        ? "border-black bg-[#F4F3F0]"
                        : "border-[#E6E3DE]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 border border-black/20"
                        style={{ backgroundColor: stk.hex }}
                      />
                      <span className="text-sm font-medium text-ink">{stk.name}</span>
                    </div>
                    <span className="font-mono text-xs text-ink-muted">Ink: {stk.ink}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rules & Service Fees Card */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
              Workshop Rules & Add-ons
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Knocking-in Fee (₹)
                </label>
                <input
                  type="number"
                  value={Math.round(knockingInPrice / 100)}
                  onChange={(e) => setKnockingInPrice(Number(e.target.value) * 100)}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Max Engraving Letters
                </label>
                <input
                  type="number"
                  value={maxNameLen}
                  onChange={(e) => setMaxNameLen(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Workshop Lead Time
                </label>
                <input
                  type="text"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live SVG Bat Preview */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-[#E6E3DE] pb-2">
              <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                Live Blade Preview
              </h3>
              <Eye className="w-4 h-4 text-accent" />
            </div>

            <div className="w-full aspect-square bg-[#F4F3F0] border border-[#E6E3DE] p-4 flex items-center justify-center">
              <div
                className="w-56 h-56 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Test Name Engraving
                </label>
                <input
                  type="text"
                  maxLength={maxNameLen}
                  value={engravedName}
                  onChange={(e) => setEngravedName(e.target.value.toUpperCase())}
                  className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] font-display text-lg uppercase tracking-wider outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Test Number Engraving
                </label>
                <input
                  type="text"
                  maxLength={maxNumLen}
                  value={engravedNumber}
                  onChange={(e) => setEngravedNumber(e.target.value)}
                  className="w-full p-2 bg-[#F4F3F0] border border-[#E6E3DE] font-display text-lg uppercase tracking-wider outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E3DE] flex items-center justify-between">
              <span className="text-xs uppercase font-display tracking-wider text-ink-muted">
                Calculated Price:
              </span>
              <span className="font-display text-2xl text-accent">
                {formatMoney(activeGrade.price + knockingInPrice, "INR")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
