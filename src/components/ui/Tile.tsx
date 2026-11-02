"use client";

import React from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { generateBatSvg, BatOptions } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import { formatMoney } from "@/lib/tokens";

export interface TileProduct {
  id: string;
  slug: string;
  name: string;
  subTitle: string;
  price: number; // In minor units (paise)
  compareAtPrice?: number | null;
  badge?: string | null;
  drawingType?: string | null;
  bladeColor?: string | null;
  gripColor?: string | null;
  stickerColor?: string | null;
  stickerInkColor?: string | null;
  grainsCount?: number | null;
  gradeLabel?: string | null;
  color1?: string | null;
  color2?: string | null;
}

export interface TileProps {
  product: TileProduct;
  currency?: string;
  onQuickAdd?: (product: TileProduct) => void;
  className?: string;
}

export const Tile: React.FC<TileProps> = ({
  product,
  currency = "INR",
  onQuickAdd,
  className,
}) => {
  const isAcc = product.drawingType && product.drawingType !== "bat";

  const getGraphicSvg = () => {
    if (isAcc) {
      return generateItemSvg(
        product.drawingType || "gloves",
        product.color1 || "#F3EEE3",
        product.color2 || "#C3262C"
      );
    }

    const batOptions: BatOptions = {
      label: `${product.name} cricket bat`,
      blade: product.bladeColor || "#E3C78E",
      grip: product.gripColor || "#C3262C",
      sticker: product.stickerColor || "#0A0A0A",
      stickerInk: product.stickerInkColor || "#F0E3C3",
      grains: product.grainsCount || 9,
      grade: product.gradeLabel || "ENGLISH WILLOW",
      view: "face",
    };
    return generateBatSvg(batOptions);
  };

  return (
    <article className={clsx("tile rv in", className)}>
      <div className={clsx("pic", isAcc && "acc")}>
        {product.badge && <span className="tag">{product.badge}</span>}
        <Link
          href={`/product/${product.slug}`}
          aria-label={product.name}
          style={{ display: "contents" }}
          dangerouslySetInnerHTML={{ __html: getGraphicSvg() }}
        />
        {onQuickAdd && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onQuickAdd(product);
            }}
            className="btn ink quick"
          >
            Quick add
          </button>
        )}
      </div>

      <Link href={`/product/${product.slug}`} style={{ textDecoration: "none" }}>
        <h3>{product.name}</h3>
      </Link>

      <div className="meta">
        <span className="soft">{product.subTitle}</span>
        <span className="price">
          <span>{formatMoney(product.price, currency)}</span>
          {product.compareAtPrice ? <s>{formatMoney(product.compareAtPrice, currency)}</s> : null}
        </span>
      </div>
    </article>
  );
};

