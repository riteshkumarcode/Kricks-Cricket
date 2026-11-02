"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/catalog";
import { generateBatSvg } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import { useStore } from "@/context/StoreContext";

export interface MegaCategory {
  title: string;
  href: string;
  img: string;
  line: string;
}

export const MEGA_CATEGORIES: Record<string, MegaCategory> = {
  leather: {
    title: "Leather bats",
    href: "/leather-bats",
    img: "/img/ball.jpg",
    line: "English & Kashmir willow, pressed by hand.",
  },
  tennis: {
    title: "Tennis bats",
    href: "/tennis-bats",
    img: "/img/redsky.jpg",
    line: "Light bats for tape ball & box cricket.",
  },
  acc: {
    title: "Accessories",
    href: "/accessories",
    img: "/img/stumps.jpg",
    line: "Everything you carry to the crease.",
  },
};

export interface MegaMenuProps {
  activeKey: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  activeKey,
  onMouseEnter,
  onMouseLeave,
  onClose,
}) => {
  const { formatPrice } = useStore();

  return (
    <div
      id="mega"
      aria-hidden={!activeKey}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`mega ${activeKey ? "visible opacity-100" : ""}`}
    >
      <div className="frame">
        {Object.entries(MEGA_CATEGORIES).map(([k, m]) => {
          const isCategory = k === activeKey;
          const products = PRODUCTS.filter((p) => p.cat === k);
          const top3 = products.slice(0, 3);

          return (
            <div
              key={k}
              data-k={k}
              className={`mp ${isCategory ? "on" : ""}`}
            >
              {/* Left Column: Product List */}
              <div className="mp-list">
                <h3>{m.title}</h3>
                <ul>
                  {products.map((p) => (
                    <li key={p.id}>
                      <Link href={`/product/${p.slug}`} onClick={onClose}>
                        <span>{p.name}</span>
                        <span className="price">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link className="tlink" href={m.href} onClick={onClose}>
                  Shop all {m.title.toLowerCase()} →
                </Link>
              </div>

              {/* Middle Column: 3 Visual Product Tiles */}
              <div className="mp-tiles">
                {top3.map((p) => {
                  const isAcc = p.cat === "acc";
                  return (
                    <Link
                      key={p.id}
                      className="mp-t group"
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                    >
                      <span className={`pic ${isAcc ? "acc" : ""}`}>
                        {isAcc ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: generateItemSvg(
                                p.drawingType || "gloves",
                                p.color1 || "#F3EEE3",
                                p.color2 || "#C3262C"
                              ),
                            }}
                          />
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: generateBatSvg({
                                blade: p.bladeColor || "#E3C78E",
                                grip: p.gripColor || "#C3262C",
                                sticker: p.stickerColor || "#0A0A0A",
                                stickerInk: p.stickerInkColor || "#F0E3C3",
                                grains: p.grainsCount || 9,
                                label: `${p.name} cricket bat`,
                              }),
                            }}
                          />
                        )}
                      </span>
                      <b className="group-hover:text-accent transition-colors">
                        {p.name}
                      </b>
                      <span className="price">{formatPrice(p.price)}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Right Column: Large Promotional Card */}
              <Link className="mp-promo" href={m.href} onClick={onClose}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt="" loading="lazy" />
                <span>
                  <b>{m.title}</b>
                  <small>{m.line}</small>
                  <em>Explore →</em>
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

