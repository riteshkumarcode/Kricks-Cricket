"use client";

import React from "react";
import Link from "next/link";
import { useStore, CartLineItem } from "@/context/StoreContext";
import { generateBatSvg } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import { getProductById } from "@/lib/catalog";

export default function CartPage() {
  const {
    cart,
    currency,
    formatPrice,
    updateQuantity,
    removeFromCart,
    cartCount,
  } = useStore();

  const subtotal = cart.reduce((n, l) => n + l.price * l.qty, 0);

  // Free shipping in India on orders over ₹10,000 (1000000 paise); otherwise ₹299 (29900 paise)
  const isFreeShipping = subtotal >= 1000000;
  const shippingFee = currency === "INR" ? (isFreeShipping ? 0 : 29900) : 0;
  const grandTotal = subtotal + shippingFee;

  const renderThumbnail = (line: CartLineItem) => {
    if (line.bat) {
      const batSvg = generateBatSvg({
        blade: line.bat.blade,
        grip: line.bat.grip,
        sticker: line.bat.sticker,
        grains: line.bat.grains,
        name: line.bat.name,
        num: line.bat.num,
        label: line.name,
      });
      return <div dangerouslySetInnerHTML={{ __html: batSvg }} />;
    }

    const p = getProductById(line.id);
    const isAcc = line.drawingType || p?.cat === "acc";

    if (isAcc) {
      const itemSvg = generateItemSvg(
        line.drawingType || p?.drawingType || "gloves",
        line.color1 || p?.color1 || "#F3EEE3",
        line.color2 || p?.color2 || "#C3262C"
      );
      return <div dangerouslySetInnerHTML={{ __html: itemSvg }} />;
    }

    const defaultBat = generateBatSvg({
      blade: p?.bladeColor || "#E8CE95",
      grip: p?.gripColor || "#C3262C",
      sticker: p?.stickerColor || "#0A0A0A",
      grains: p?.grainsCount || 11,
      label: line.name,
    });
    return <div dangerouslySetInnerHTML={{ __html: defaultBat }} />;
  };

  return (
    <section className="frame ct" id="checkout">
      <h1>Your cart</h1>

      {cart.length === 0 ? (
        <div className="empty" id="lines">
          <p>Your cart is empty. Start with a bat.</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link className="btn" href="/leather-bats">
              Leather bats <span className="ar">→</span>
            </Link>
            <Link className="btn ink" href="/tennis-bats">
              Tennis bats
            </Link>
            <Link className="btn ink" href="/custom-bat">
              Build a custom bat
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Cart Line Items */}
          <ul className="lines" id="lines">
            {cart.map((line, idx) => {
              const isAcc = line.drawingType || getProductById(line.id)?.cat === "acc";
              return (
                <li key={`${line.id}-${idx}`} className="line">
                  <div className={`th ${isAcc ? "acc" : ""}`}>
                    {renderThumbnail(line)}
                  </div>

                  <div>
                    <h2>{line.name}</h2>
                    {line.opts && <p className="o">{line.opts}</p>}
                  </div>

                  <div className="r">
                    <span className="price">
                      {formatPrice(line.price * line.qty)}
                    </span>
                    <div className="qty">
                      <button
                        type="button"
                        aria-label="One fewer"
                        onClick={() => updateQuantity(idx, -1)}
                      >
                        −
                      </button>
                      <output>{line.qty}</output>
                      <button
                        type="button"
                        aria-label="One more"
                        onClick={() => updateQuantity(idx, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="rm"
                      type="button"
                      onClick={() => removeFromCart(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Sticky Order Summary Sidebar */}
          <aside className="sum" id="sum" aria-labelledby="sumT">
            <h2 id="sumT">Order summary</h2>
            <dl>
              <div>
                <dt>Items ({cartCount})</dt>
                <dd className="price">{formatPrice(subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>
                  {currency !== "INR"
                    ? "Calculated at checkout"
                    : isFreeShipping
                    ? "Free"
                    : formatPrice(shippingFee)}
                </dd>
              </div>
              <div className="tot">
                <dt>Total</dt>
                <dd className="price">{formatPrice(grandTotal)}</dd>
              </div>
            </dl>

            <Link className="btn" href="/checkout">
              Go to checkout <span className="ar">→</span>
            </Link>

            <p>
              Free shipping in India on orders over {formatPrice(1000000)}. International duties are
              shown at checkout.
            </p>
          </aside>
        </>
      )}
    </section>
  );
}

