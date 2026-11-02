"use client";

import React, { useState } from "react";
import { generateBatSvg } from "@/lib/svg-bat";
import { useStore } from "@/context/StoreContext";

interface WillowOption {
  key: string;
  price: number;
  blade: string;
  grains: number;
  grade: string;
}

const WILLOWS: WillowOption[] = [
  {
    key: "Grade 1 English",
    price: 1849900,
    blade: "#E8CE95",
    grains: 11,
    grade: "ENGLISH WILLOW",
  },
  {
    key: "Grade 2 English",
    price: 1399900,
    blade: "#E3C78E",
    grains: 8,
    grade: "ENGLISH WILLOW · G2",
  },
  {
    key: "Kashmir",
    price: 499900,
    blade: "#EAD6A8",
    grains: 6,
    grade: "KASHMIR WILLOW",
  },
];

const SIZES = ["Short Handle", "Long Handle", "Harrow", "Size 6"];
const WEIGHTS = ["2lb 7oz", "2lb 8oz", "2lb 9oz", "2lb 10oz", "2lb 11oz"];

const COLOR_SWATCHES: [string, string][] = [
  ["Black", "#111417"],
  ["Navy", "#0A0A0A"],
  ["Red", "#C3262C"],
  ["Willow", "#E3C78E"],
  ["White", "#F3EEE3"],
  ["Green", "#3A3A3A"],
  ["Blue", "#C8501A"],
];

export default function CustomBatBuilderPage() {
  const { formatPrice, addToCart } = useStore();

  const [willowIdx, setWillowIdx] = useState(0);
  const [size, setSize] = useState("Short Handle");
  const [weight, setWeight] = useState("2lb 9oz");
  const [grip, setGrip] = useState("#0A0A0A");
  const [sticker, setSticker] = useState("#C3262C");
  const [view, setView] = useState<"face" | "back">("face");
  const [name, setName] = useState("Arjun");
  const [number, setNumber] = useState("07");
  const [knockIn, setKnockIn] = useState(true);
  const [isPopping, setIsPopping] = useState(false);

  const activeWillow = WILLOWS[willowIdx];
  const totalPrice = activeWillow.price + (knockIn ? 80000 : 0);

  const triggerPop = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 600);
  };

  const handleNameChange = (val: string) => {
    setName(val.replace(/[^a-zA-Z ]/g, ""));
  };

  const handleNumberChange = (val: string) => {
    setNumber(val.replace(/\D/g, ""));
  };

  const isLightSticker = ["#F3EEE3", "#E3C78E"].includes(sticker);

  const batSvg = generateBatSvg({
    blade: activeWillow.blade,
    grip,
    sticker,
    stickerInk: isLightSticker ? "#0A0A0A" : "#F3EEE3",
    grains: activeWillow.grains,
    grade: activeWillow.grade,
    name,
    num: number,
    view,
    label: "Your custom bat",
  });

  const handleAddToCart = () => {
    const bits = [activeWillow.key, size, weight];
    const n = name.toUpperCase().trim();
    const no = number.trim();
    if (n || no) {
      bits.push(`Engraved "${n}${no ? " " + no : ""}"`);
    }
    if (knockIn) {
      bits.push("Knocked in");
    }

    addToCart({
      id: "custom",
      name: "Customised bat",
      opts: bits.join(" · "),
      price: totalPrice,
      qty: 1,
      bat: {
        blade: activeWillow.blade,
        grip,
        sticker,
        grains: activeWillow.grains,
        name: n || undefined,
        num: no || undefined,
      },
    });
  };

  return (
    <>
      <section className="frame cb">
        {/* Sticky Orange Stage */}
        <div className="stage">
          <h1>Build your bat</h1>
          <div
            className={`view ${isPopping ? "pop" : ""}`}
            id="view"
            aria-live="polite"
            dangerouslySetInnerHTML={{ __html: batSvg }}
          />
          <div className="vt opts" id="vt">
            <button
              className="opt"
              type="button"
              aria-pressed={view === "face"}
              onClick={() => {
                setView("face");
                triggerPop();
              }}
            >
              Face
            </button>
            <button
              className="opt"
              type="button"
              aria-pressed={view === "back"}
              onClick={() => {
                setView("back");
                triggerPop();
              }}
            >
              Back
            </button>
          </div>
        </div>

        {/* Builder Configuration Panel */}
        <div className="ctl">
          <p>
            Choose the willow, size and weight, colour the grip and stickers, and add your name and
            shirt number. We engrave the blade by hand and ship in 10 to 14 days.
          </p>

          {/* Willow Grade */}
          <div className="grp" style={{ display: "grid", gap: "10px" }}>
            <span className="soft">Willow</span>
            <div className="opts" id="willow">
              {WILLOWS.map((w, idx) => (
                <button
                  key={w.key}
                  className="opt"
                  type="button"
                  aria-pressed={willowIdx === idx}
                  onClick={() => {
                    setWillowIdx(idx);
                    triggerPop();
                  }}
                >
                  {w.key}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="grp" style={{ display: "grid", gap: "10px" }}>
            <span className="soft">Size</span>
            <div className="opts" id="size">
              {SIZES.map((s) => (
                <button
                  key={s}
                  className="opt"
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s);
                    triggerPop();
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div className="grp" style={{ display: "grid", gap: "10px" }}>
            <span className="soft">Weight</span>
            <div className="opts" id="weight">
              {WEIGHTS.map((wt) => (
                <button
                  key={wt}
                  className="opt"
                  type="button"
                  aria-pressed={weight === wt}
                  onClick={() => {
                    setWeight(wt);
                    triggerPop();
                  }}
                >
                  {wt}
                </button>
              ))}
            </div>
          </div>

          {/* Grip Color */}
          <div className="grp" style={{ display: "grid", gap: "10px" }}>
            <span className="soft">Grip colour</span>
            <div className="sw" id="grip">
              {COLOR_SWATCHES.map(([n, hex]) => (
                <button
                  key={n}
                  type="button"
                  title={n}
                  aria-label={n}
                  aria-pressed={grip === hex}
                  style={{ "--c": hex } as React.CSSProperties}
                  onClick={() => {
                    setGrip(hex);
                    triggerPop();
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sticker Color */}
          <div className="grp" style={{ display: "grid", gap: "10px" }}>
            <span className="soft">Sticker colour</span>
            <div className="sw" id="sticker">
              {COLOR_SWATCHES.map(([n, hex]) => (
                <button
                  key={n}
                  type="button"
                  title={n}
                  aria-label={n}
                  aria-pressed={sticker === hex}
                  style={{ "--c": hex } as React.CSSProperties}
                  onClick={() => {
                    setSticker(hex);
                    triggerPop();
                  }}
                />
              ))}
            </div>
          </div>

          {/* Name & Number */}
          <div className="two">
            <div className="field">
              <label htmlFor="nm">Name on the blade</label>
              <input
                id="nm"
                maxLength={10}
                value={name}
                autoComplete="off"
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="no">Number</label>
              <input
                id="no"
                maxLength={3}
                value={number}
                inputMode="numeric"
                autoComplete="off"
                onChange={(e) => handleNumberChange(e.target.value)}
              />
            </div>
          </div>

          {/* Knocking in */}
          <label className="chk">
            <input
              type="checkbox"
              id="knock"
              checked={knockIn}
              onChange={(e) => setKnockIn(e.target.checked)}
            />
            <span>
              Knock it in for me, {formatPrice(80000)}. Oiled and knocked in by hand, ready for the
              nets.
            </span>
          </label>

          {/* Total & Action */}
          <div className="total">
            <div>
              <small>Your bat</small>
              <b className="price" id="tot">
                {formatPrice(totalPrice)}
              </b>
            </div>
            <button className="btn" id="add" type="button" onClick={handleAddToCart}>
              Add to cart <span className="ar">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="frame how" aria-labelledby="howT">
        <h2 id="howT" className="rv in">
          What happens next
        </h2>
        <ol>
          <li className="rv in">
            <b>We pick your cleft</b>
            <span>A bat-maker chooses willow to match the grade and weight you asked for.</span>
          </li>
          <li className="rv in">
            <b>Engraved and finished</b>
            <span>
              Your name goes down the blade and your number on the shoulder, then the stickers in
              your colours.
            </span>
          </li>
          <li className="rv in">
            <b>Knocked in</b>
            <span>If you added it, we oil the bat and knock the face in by hand.</span>
          </li>
          <li className="rv in">
            <b>Shipped to you</b>
            <span>Most custom bats leave us in 10 to 14 days, with tracking to your door.</span>
          </li>
        </ol>
      </section>
    </>
  );
}

