"use client";

import React, { useState, useRef } from "react";
import { PRODUCTS, CatalogProduct } from "@/lib/catalog";
import { Tile } from "@/components/ui/Tile";
import { useStore } from "@/context/StoreContext";

const ORDERED_IDS = [
  "pro-edition",
  "street",
  "gloves",
  "players",
  "tape-ball",
  "club",
  "kitbag",
  "helmet",
  "leather-balls",
  "full-cane",
  "pads",
];

export const BestsellersRail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const railRef = useRef<HTMLDivElement>(null);
  const { currency, addToCart } = useStore();

  const tabs = [
    { key: "all", label: "All" },
    { key: "leather", label: "Leather bats" },
    { key: "tennis", label: "Tennis bats" },
    { key: "acc", label: "Accessories" },
  ];

  const filteredProducts = ORDERED_IDS.map((id) =>
    PRODUCTS.find((p) => p.id === id)
  ).filter(
    (p): p is CatalogProduct => !!p && (activeTab === "all" || p.cat === activeTab)
  );

  const handleScroll = (dir: number) => {
    if (railRef.current) {
      const step = railRef.current.clientWidth * 0.75;
      railRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
    }
  };

  const handleQuickAdd = (p: CatalogProduct) => {
    addToCart({
      id: p.id,
      name: p.name,
      opts: p.subTitle,
      price: p.price,
      qty: 1,
      drawingType: p.drawingType || undefined,
      color1: p.color1 || undefined,
      color2: p.color2 || undefined,
    });
  };

  return (
    <section className="sec frame" aria-labelledby="bestT">
      <div className="head">
        <div style={{ display: "grid", gap: "18px" }}>
          <h2 id="bestT" className="rv in">
            Bestsellers
          </h2>
          <div className="tabs" role="group" aria-label="Show category">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className="opt"
                aria-pressed={activeTab === tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (railRef.current) railRef.current.scrollTo({ left: 0 });
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rail-ctrl">
          <button type="button" aria-label="Scroll left" onClick={() => handleScroll(-1)}>
            ←
          </button>
          <button type="button" aria-label="Scroll right" onClick={() => handleScroll(1)}>
            →
          </button>
        </div>
      </div>

      <div className="rail" ref={railRef} id="rail">
        {filteredProducts.map((p) => (
          <Tile
            key={p.id}
            product={p}
            currency={currency}
            onQuickAdd={() => handleQuickAdd(p)}
          />
        ))}
      </div>
    </section>
  );
};

