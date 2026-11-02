"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCTS } from "@/lib/catalog";
import { DEFAULT_RATES } from "@/lib/tokens";
import { useStore } from "@/context/StoreContext";
import { MEGA_CATEGORIES } from "./MegaMenu";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  burgerCoords: { x: number; y: number };
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  burgerCoords,
}) => {
  const pathname = usePathname();
  const { currency, setCurrency, formatPrice } = useStore();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const navLinks = [
    { key: "home", href: "/", title: "Home" },
    { key: "custom", href: "/custom-bat", title: "Customised Bat" },
    { key: "leather", href: "/leather-bats", title: "Leather Bats", mega: "leather" },
    { key: "tennis", href: "/tennis-bats", title: "Tennis Bats", mega: "tennis" },
    { key: "acc", href: "/accessories", title: "Accessories", mega: "acc" },
    { key: "contact", href: "/contact", title: "Contact Us" },
    { key: "bulk", href: "/bulk-enquiry", title: "Bulk Enquiry" },
  ];

  const toggleSub = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <nav
      id="mnav"
      aria-label="Mobile Navigation"
      aria-hidden={!isOpen}
      style={
        {
          "--cx": `${burgerCoords.x}px`,
          "--cy": `${burgerCoords.y}px`,
        } as React.CSSProperties
      }
      className={`mnav ${isOpen ? "open" : ""}`}
    >
      <div className="mnav-in frame">
        <ul className="mlinks">
          {navLinks.map((item, i) => {
            const hasSub = !!item.mega;
            const isSubOpen = openSection === item.key;
            const subProducts = hasSub ? PRODUCTS.filter((p) => p.cat === item.mega) : [];
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li
                key={item.key}
                style={{ "--i": i } as React.CSSProperties}
                className={isSubOpen ? "open" : ""}
              >
                <div className="mrow">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="mi">0{i + 1}</span>
                    <span className="mt">{item.title}</span>
                  </Link>

                  {hasSub ? (
                    <button
                      type="button"
                      aria-expanded={isSubOpen}
                      aria-label={`Show ${item.title}`}
                      onClick={() => toggleSub(item.key)}
                      className="mx"
                    >
                      {isSubOpen ? "−" : "+"}
                    </button>
                  ) : (
                    <span className="ma">→</span>
                  )}
                </div>

                {hasSub && (
                  <ul className="msub">
                    {subProducts.map((p) => (
                      <li key={p.id}>
                        <Link href={`/product/${p.slug}`} onClick={onClose}>
                          <span>{p.name}</span>
                          <span className="price">{formatPrice(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* Promo Cards Snapshot */}
        <div className="mcards" style={{ "--i": 8 } as React.CSSProperties}>
          {Object.entries(MEGA_CATEGORIES).map(([k, m]) => (
            <Link key={k} href={m.href} onClick={onClose}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt="" loading="lazy" />
              <b>{m.title}</b>
            </Link>
          ))}
        </div>

        {/* Mobile Footer */}
        <div className="mfoot" style={{ "--i": 9 } as React.CSSProperties}>
          <label htmlFor="cur2">Prices in</label>
          <select
            className="cur"
            id="cur2"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {Object.keys(DEFAULT_RATES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span>Free engraving · Shipping worldwide</span>
        </div>
      </div>
    </nav>
  );
};

