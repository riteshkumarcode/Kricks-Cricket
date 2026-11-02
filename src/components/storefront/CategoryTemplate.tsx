"use client";

import React, { useState } from "react";
import { CatalogProduct } from "@/lib/catalog";
import { Tile } from "@/components/ui/Tile";
import { useStore } from "@/context/StoreContext";

export interface FilterOption {
  key: string;
  label: string;
}

export interface GuideItem {
  term: string;
  desc: string;
}

export interface CategoryTemplateProps {
  title: string;
  description: string;
  heroImage: string;
  products: CatalogProduct[];
  filterOptions: FilterOption[];
  filterType: "grade" | "wood" | "group";
  guideTitle: string;
  guideItems: GuideItem[];
}

const ACCESSORY_GROUPS: Record<string, string> = {
  gloves: "protect",
  pads: "protect",
  helmet: "protect",
  kitbag: "bags",
  "leather-balls": "balls",
  "tennis-balls": "balls",
  grips: "care",
  "toe-guard": "care",
};

export const CategoryTemplate: React.FC<CategoryTemplateProps> = ({
  title,
  description,
  heroImage,
  products,
  filterOptions,
  filterType,
  guideTitle,
  guideItems,
}) => {
  const { currency, addToCart } = useStore();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("feat");

  // Filtering
  let filtered = products.filter((p) => {
    if (activeFilter === "all") return true;
    if (filterType === "grade") return String(p.grade) === activeFilter;
    if (filterType === "wood") {
      const woodType = p.subTitle.includes("Popular") ? "Popular" : "Kashmir";
      return woodType === activeFilter;
    }
    if (filterType === "group") return ACCESSORY_GROUPS[p.id] === activeFilter;
    return true;
  });

  // Sorting
  if (sortOrder === "low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

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
    <>
      <section className="frame">
        {/* Top Hero Banner */}
        <div className="top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="" />
          <h1>
            {title}
            <span>.</span>
          </h1>
          <div className="intro">
            <p>{description}</p>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="bar2">
          <div className="opts" role="group" aria-label="Filter">
            {filterOptions.map((f) => (
              <button
                key={f.key}
                type="button"
                className="opt"
                aria-pressed={activeFilter === f.key}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="sort">
            <span className="count">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </span>
            <label htmlFor="sort" className="sr">
              Sort
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="feat">Featured</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div
          className="tiles"
          id="grid"
          style={{
            gridTemplateColumns:
              filtered.length % 4 === 0 && filtered.length > 0
                ? "repeat(auto-fit, minmax(260px, 1fr))"
                : undefined,
          }}
        >
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <Tile
                key={p.id}
                product={p}
                currency={currency}
                onQuickAdd={() => handleQuickAdd(p)}
              />
            ))
          ) : (
            <p className="empty col-span-full py-16 text-xl text-center text-ink-muted">
              Nothing in this filter right now.
            </p>
          )}
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className="frame guide" aria-labelledby="gh">
        <h2 id="gh" className="rv in">
          {guideTitle}
        </h2>
        <dl>
          {guideItems.map((item) => (
            <div key={item.term} className="rv in">
              <dt>{item.term}</dt>
              <dd>{item.desc}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
};
