"use client";

import React, { useState } from "react";
import Link from "next/link";
import { generateBatSvg } from "@/lib/svg-bat";
import { useStore } from "@/context/StoreContext";

const COLOR_OPTIONS: [string, string][] = [
  ["Black", "#111111"],
  ["Orange", "#C8501A"],
  ["White", "#F5F4F1"],
  ["Willow", "#E3C78E"],
  ["Grey", "#6B6966"],
];

export const CustomBatTeaser: React.FC = () => {
  const { formatPrice } = useStore();
  const [name, setName] = useState("Arjun");
  const [num, setNum] = useState("07");
  const [grip, setGrip] = useState("#111111");
  const [sticker, setSticker] = useState("#C8501A");
  const [isPopping, setIsPopping] = useState(false);

  const triggerPop = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 600);
  };

  const handleNameChange = (val: string) => {
    setName(val.replace(/[^a-zA-Z ]/g, ""));
  };

  const handleNumChange = (val: string) => {
    setNum(val.replace(/\D/g, ""));
  };

  const isLightSticker = ["#F5F4F1", "#E3C78E"].includes(sticker);

  const batSvg = generateBatSvg({
    blade: "#E8CE95",
    grip,
    sticker,
    stickerInk: isLightSticker ? "#111111" : "#FFFFFF",
    grains: 10,
    name,
    num,
    label: "Your custom bat preview",
  });

  return (
    <section className="custom" aria-labelledby="cusT">
      <div className="frame grid">
        <div
          className={`cv ${isPopping ? "pop" : ""}`}
          id="cv"
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: batSvg }}
        />

        <div className="cc">
          <h2 id="cusT">
            Your name<br />
            <span>on the willow.</span>
          </h2>
          <p>
            Choose the willow, colour the grip and stickers, then we engrave your name and shirt
            number down the blade by hand. Try it here.
          </p>

          <div className="two">
            <div>
              <label htmlFor="cName">Name</label>
              <input
                id="cName"
                maxLength={10}
                value={name}
                autoComplete="off"
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cNum">Number</label>
              <input
                id="cNum"
                maxLength={3}
                value={num}
                inputMode="numeric"
                autoComplete="off"
                onChange={(e) => handleNumChange(e.target.value)}
              />
            </div>
          </div>

          <div>
            <span className="lbl">Grip</span>
            <div className="sw">
              {COLOR_OPTIONS.map(([n, hex]) => (
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

          <div>
            <span className="lbl">Sticker</span>
            <div className="sw">
              {COLOR_OPTIONS.map(([n, hex]) => (
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

          <div className="foot-row">
            <span className="from">
              <small>Custom bats from</small>
              <span>{formatPrice(499900)}</span>
            </span>
            <Link className="btn" href="/custom-bat">
              Open the full builder <span className="ar">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

