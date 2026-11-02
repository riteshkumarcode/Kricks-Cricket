"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CatalogProduct, PRODUCTS } from "@/lib/catalog";
import { generateBatSvg } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import { Tile } from "@/components/ui/Tile";
import { useStore } from "@/context/StoreContext";

export function ProductDetailClient({ product }: { product: CatalogProduct }) {
  const { currency, formatPrice, addToCart } = useStore();

  const isBat = product.cat !== "acc";
  const [currentView, setCurrentView] = useState<"face" | "back" | "edge">("face");
  const [quantity, setQuantity] = useState(1);
  const [knockIn, setKnockIn] = useState(false);
  const [engraving, setEngraving] = useState("");

  // Default option selections
  const getInitialOptions = (): Record<string, string> => {
    if (product.cat === "leather") {
      return {
        Size: product.id === "junior-harrow" ? "Harrow" : "Short Handle",
        Weight: product.id === "junior-harrow" ? "2lb 4oz" : "2lb 9oz",
      };
    }
    if (product.cat === "tennis") {
      return { Size: "Short Handle" };
    }
    if (["gloves", "pads", "helmet"].includes(product.id)) {
      return {
        Fit: "Men's",
        ...(product.id !== "helmet" ? { Hand: "Right-handed" } : {}),
      };
    }
    return {};
  };

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(getInitialOptions());

  // Category breadcrumb details
  const categoryMeta: Record<string, [string, string]> = {
    leather: ["Leather bats", "/leather-bats"],
    tennis: ["Tennis bats", "/tennis-bats"],
    acc: ["Accessories", "/accessories"],
  };
  const [catName, catUrl] = categoryMeta[product.cat] || ["Shop", "/"];

  // Unit and total price calculation (including knock-in add-on)
  const unitPrice = product.price + (knockIn ? 80000 : 0);
  const totalPrice = unitPrice * quantity;

  // Gallery rendering
  const renderMainGraphic = () => {
    if (!isBat) {
      const itemSvg = generateItemSvg(
        product.drawingType || "gloves",
        product.color1 || "#F3EEE3",
        product.color2 || "#C3262C"
      );
      return <div dangerouslySetInnerHTML={{ __html: itemSvg }} />;
    }

    const batSvg = generateBatSvg({
      blade: product.bladeColor || "#E8CE95",
      grip: product.gripColor || "#C3262C",
      sticker: product.stickerColor || "#0A0A0A",
      stickerInk: product.stickerInkColor || "#F0E3C3",
      grains: product.grainsCount || 9,
      grade: product.gradeLabel || "ENGLISH WILLOW",
      name: currentView === "face" && engraving ? engraving : "",
      view: currentView,
      label: `${product.name} ${currentView} view`,
    });
    return <div dangerouslySetInnerHTML={{ __html: batSvg }} />;
  };

  // Thumbnail buttons for bats
  const views: { key: "face" | "back" | "edge"; label: string }[] = [
    { key: "face", label: "Face" },
    { key: "back", label: "Back" },
    { key: "edge", label: "Edge" },
  ];

  // Options configuration
  const availableOptionGroups = (): Array<[string, string[]]> => {
    if (product.cat === "leather") {
      return [
        [
          "Size",
          product.id === "junior-harrow"
            ? ["Harrow"]
            : ["Short Handle", "Long Handle", "Harrow"],
        ],
        [
          "Weight",
          product.id === "junior-harrow"
            ? ["2lb 3oz", "2lb 4oz", "2lb 5oz"]
            : ["2lb 8oz", "2lb 9oz", "2lb 10oz", "2lb 11oz"],
        ],
      ];
    }
    if (product.cat === "tennis") {
      return [["Size", ["Short Handle", "Long Handle", "Size 6"]]];
    }
    if (["gloves", "pads", "helmet"].includes(product.id)) {
      const groups: Array<[string, string[]]> = [["Fit", ["Men's", "Youth"]]];
      if (product.id !== "helmet") {
        groups.push(["Hand", ["Right-handed", "Left-handed"]]);
      }
      return groups;
    }
    return [];
  };

  // Specs table rows
  const specRows = isBat
    ? [
        ["Willow", product.subTitle],
        ["Grains", String(product.grains || "—")],
        ["Weight", product.weight || "Standard"],
        ["Edges", product.edge || "38 mm"],
        ["Profile", product.profile || "Mid middle"],
        ["Handle", "Round, cane with rubber grip"],
        ["Finish", "Oiled, toe guard fitted"],
      ]
    : [
        ["Product", product.name],
        ["Details", product.subTitle],
      ];

  const relatedProducts = PRODUCTS.filter(
    (x) => x.cat === product.cat && x.id !== product.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    const bits = Object.values(selectedOptions);
    if (knockIn) bits.push("Knocked in");
    if (engraving) bits.push(`Engraved "${engraving.toUpperCase()}"`);

    addToCart({
      id: product.id,
      name: product.name,
      opts: bits.join(" · "),
      price: unitPrice,
      qty: quantity,
      drawingType: product.drawingType || undefined,
      color1: product.color1 || undefined,
      color2: product.color2 || undefined,
      bat: isBat
        ? {
            blade: product.bladeColor || "#E8CE95",
            grip: product.gripColor || "#C3262C",
            sticker: product.stickerColor || "#0A0A0A",
            grains: product.grainsCount || 9,
            name: engraving || undefined,
          }
        : undefined,
    });
  };

  return (
    <>
      <section className="frame pdp">
        {/* Left Column: Sticky Gallery */}
        <div className="gal">
          <div className={`main ${!isBat ? "acc" : ""}`} data-v={currentView}>
            {renderMainGraphic()}
          </div>

          {isBat && (
            <div className="thumbs">
              {views.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  aria-pressed={currentView === v.key}
                  aria-label={`${v.label} view`}
                  onClick={() => setCurrentView(v.key)}
                  dangerouslySetInnerHTML={{
                    __html: generateBatSvg({
                      blade: product.bladeColor || "#E8CE95",
                      grip: product.gripColor || "#C3262C",
                      sticker: product.stickerColor || "#0A0A0A",
                      stickerInk: product.stickerInkColor || "#F0E3C3",
                      grains: product.grainsCount || 9,
                      view: v.key,
                    }),
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Buy Panel */}
        <div className="buy">
          <p className="crumb">
            <Link href="/">Home</Link> / <Link href={catUrl}>{catName}</Link> / {product.name}
          </p>

          <div>
            <h1>{product.name}</h1>
            <p className="sub soft">{product.subTitle}</p>
          </div>

          <div className="pr price">
            <span>{formatPrice(totalPrice)}</span>
            {product.was && <s>{formatPrice(product.was * quantity)}</s>}
          </div>

          <p style={{ fontSize: "19px", maxWidth: "48ch" }}>{product.blurb}</p>

          <div style={{ display: "grid", gap: "22px" }}>
            {availableOptionGroups().map(([groupName, options]) => (
              <div key={groupName} className="grp">
                <span>{groupName}</span>
                <div className="opts" data-k={groupName}>
                  {options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className="opt"
                      aria-pressed={selectedOptions[groupName] === opt}
                      onClick={() =>
                        setSelectedOptions({ ...selectedOptions, [groupName]: opt })
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Knocking in Add-on */}
            {product.cat === "leather" && (
              <label className="chk">
                <input
                  type="checkbox"
                  checked={knockIn}
                  onChange={(e) => setKnockIn(e.target.checked)}
                />
                <span>
                  Knock it in for me, {formatPrice(80000)}. We oil the bat and knock the face in by
                  hand, so it&apos;s ready for the nets.
                </span>
              </label>
            )}

            {/* Name Engraving */}
            {isBat && (
              <div className="field">
                <label htmlFor="eng">Engrave a name (free, up to 10 letters)</label>
                <input
                  id="eng"
                  maxLength={10}
                  autoComplete="off"
                  placeholder="Optional"
                  value={engraving}
                  onChange={(e) =>
                    setEngraving(e.target.value.replace(/[^a-zA-Z ]/g, ""))
                  }
                />
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="grp">
            <span>Quantity</span>
            <div className="qty">
              <button
                type="button"
                aria-label="One fewer"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <output>{quantity}</output>
              <button
                type="button"
                aria-label="One more"
                onClick={() => setQuantity(Math.min(20, quantity + 1))}
              >
                +
              </button>
            </div>
          </div>

          <div className="addrow">
            <button className="btn" type="button" onClick={handleAddToCart}>
              Add to cart <span className="ar">→</span>
            </button>
          </div>

          <div className="notes soft">
            <p>Dispatched from India within 3 working days.</p>
            <p>
              Shipping to the UK, Australia, the UAE, the USA and more. Duties are shown at
              checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Specifications Table */}
      <section className="frame spec" aria-labelledby="specT">
        <h2 id="specT" className="rv in">
          The details
        </h2>
        <table id="spec" className="rv in">
          <tbody>
            {specRows.map(([label, val]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Knocking In Care Section (Leather bats only) */}
      {product.cat === "leather" && (
        <section className="frame care" id="careSec" aria-labelledby="careT">
          <h2 id="careT" className="rv in">
            Knocking in your bat
          </h2>
          <ol className="rv in">
            <li>
              Rub a teaspoon of raw linseed oil into the face, edges and toe. Leave it to soak in
              overnight. Never oil the splice or the sticker.
            </li>
            <li>
              Tap the face with a bat mallet for about two hours, slowly building up force. Round
              the edges and toe gently.
            </li>
            <li>
              Face throw-downs with an old ball for a week, then play in the nets before using it in
              a match.
            </li>
            <li>
              Add our knocking-in service and we do all of this for you before the bat ships.
            </li>
          </ol>
        </section>
      )}

      {/* Related Products Rail */}
      {relatedProducts.length > 0 && (
        <section className="frame rel" aria-labelledby="relT">
          <h2 id="relT" className="rv in">
            You may also like
          </h2>
          <div className="tiles">
            {relatedProducts.map((p) => (
              <Tile
                key={p.id}
                product={p}
                currency={currency}
                onQuickAdd={() =>
                  addToCart({
                    id: p.id,
                    name: p.name,
                    opts: p.subTitle,
                    price: p.price,
                    qty: 1,
                  })
                }
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

