"use client";

import React, { useState } from "react";
import Link from "next/link";
import { generateBatSvg } from "@/lib/svg-bat";

interface SizeDefinition {
  max: number;
  name: string;
  len: string;
  inch: number;
  wt: string;
}

const SIZES: SizeDefinition[] = [
  { max: 139, name: "Size 3", len: "28″ · 71 cm", inch: 28, wt: "1lb 14oz – 2lb 0oz" },
  { max: 149, name: "Size 4", len: "29.5″ · 75 cm", inch: 29.5, wt: "2lb 0oz – 2lb 2oz" },
  { max: 157, name: "Size 5", len: "30.5″ · 77 cm", inch: 30.5, wt: "2lb 2oz – 2lb 4oz" },
  { max: 164, name: "Size 6", len: "31.5″ · 80 cm", inch: 31.5, wt: "2lb 4oz – 2lb 6oz" },
  { max: 172, name: "Harrow", len: "32.5″ · 83 cm", inch: 32.5, wt: "2lb 5oz – 2lb 7oz" },
  { max: 188, name: "Short Handle", len: "33.5″ · 85 cm", inch: 33.5, wt: "2lb 8oz – 2lb 10oz" },
  { max: 999, name: "Long Handle", len: "34.5″ · 88 cm", inch: 34.5, wt: "2lb 9oz – 2lb 11oz" },
];

export const BatSizeFinder: React.FC = () => {
  const [height, setHeight] = useState(178);

  const matchedSize = SIZES.find((s) => height <= s.max) || SIZES[SIZES.length - 1];
  const ft = Math.floor(height / 30.48);
  const inch = Math.min(11, Math.round(height / 2.54 - ft * 12));
  const batCm = matchedSize.inch * 2.54;

  const personScale = height / 180;
  const batScale = batCm / 520;

  // Extract inner bat SVG without wrapping <svg> tags
  const batInner = generateBatSvg({
    blade: "#E8CE95",
    grip: "#C3262C",
    sticker: "#0A0A0A",
    stickerInk: "#F0E3C3",
    grains: 11,
  })
    .replace(/^<svg[^>]*>/, "")
    .replace("</svg>", "");

  const shopLink =
    matchedSize.name === "Harrow" ? "/product/junior-harrow" : "/leather-bats";

  return (
    <section className="sec frame sizer" id="size" aria-labelledby="szT">
      <div className="box">
        <div className="grid">
          {/* Copy and controls */}
          <div className="sz-copy">
            <h2 id="szT" className="rv in">
              Find your bat size
            </h2>
            <p className="rv in">Move the slider to your height. The drawing shows you and the bat to scale.</p>

            <div className="range rv in">
              <label htmlFor="height" className="sr">
                Your height in centimetres
              </label>
              <span className="val" id="hVal">
                {height} cm · {ft}′{inch}″
              </span>
              <input
                type="range"
                id="height"
                min="120"
                max="200"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>

            <div className="sz-out rv in" aria-live="polite">
              <span className="big" id="szName">
                {matchedSize.name}
              </span>
              <div className="facts">
                <span>
                  Bat length<b id="szLen">{matchedSize.len}</b>
                </span>
                <span>
                  Suggested weight<b id="szWt">{matchedSize.wt}</b>
                </span>
              </div>
            </div>

            <Link
              className="btn rv in"
              id="szGo"
              href={shopLink}
              style={{ justifySelf: "start" }}
            >
              Shop {matchedSize.name} bats <span className="ar">→</span>
            </Link>
          </div>

          {/* Scale figure drawing */}
          <div className="sz-fig rv in" id="szFig">
            <svg
              viewBox="40 0 300 240"
              role="img"
              aria-label={`A ${height} cm player beside a ${matchedSize.name} bat, to scale`}
            >
              {/* Floor baseline */}
              <rect x="0" y="230" width="400" height="10" fill="#E6E3DE" />

              {/* Scaled Human silhouette */}
              <g
                transform={`translate(150 230) scale(${personScale}) translate(0 -180)`}
                fill="#111"
              >
                <circle cx="0" cy="12" r="11" />
                <rect x="-16" y="26" width="32" height="70" />
                <rect x="-16" y="94" width="14" height="86" />
                <rect x="2" y="94" width="14" height="86" />
                <rect x="-26" y="28" width="9" height="60" />
                <rect x="17" y="28" width="9" height="60" />
              </g>

              {/* Scaled Bat */}
              <g
                transform={`translate(206 ${230 - batCm}) scale(${batScale})`}
                dangerouslySetInnerHTML={{ __html: batInner }}
              />

              {/* Annotation labels */}
              <text
                x="250"
                y={226 - batCm}
                fontFamily="Bebas Neue,Impact,sans-serif"
                fontSize="16"
                fill="#C8501A"
              >
                {matchedSize.name} · {matchedSize.len.split(" · ")[0]}
              </text>
              <text
                x="92"
                y={222 - height}
                fontFamily="Bebas Neue,Impact,sans-serif"
                fontSize="16"
                fill="#111"
              >
                {height} cm
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

