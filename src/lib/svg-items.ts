import { shade } from "./tokens";

/**
 * Procedural Cricket Ball SVG generator
 */
export function generateBallSvg(type: "leather" | "tennis" | "white" = "leather"): string {
  if (type === "tennis") {
    return `<svg viewBox="0 0 100 100" role="img" aria-label="Tennis ball"><circle cx="50" cy="50" r="46" fill="#D5E04A"/><path d="M50 4a46 46 0 0 1 0 92a52 52 0 0 0 0-92z" fill="#B9C42F"/><path d="M14 22c18 14 18 42 0 56M86 22c-18 14-18 42 0 56" stroke="#F7F4E8" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
  }
  const c = type === "white" ? "#F2EEE4" : "#B8202A";
  const d = type === "white" ? "#D9D2C2" : "#8E1520";
  const s = type === "white" ? "#0A0A0A" : "#F2E3CC";

  return `<svg viewBox="0 0 100 100" role="img" aria-label="${type === "white" ? "White" : "Red"} leather ball"><circle cx="50" cy="50" r="46" fill="${c}"/><path d="M50 4a46 46 0 0 1 0 92a52 52 0 0 0 0-92z" fill="${d}"/><path d="M34 6c-9 27-9 61 0 88" stroke="${d}" stroke-width="6" fill="none"/><path d="M30 7c-8.5 27-8.5 59 0 86M38 5c-8.5 28-8.5 62 0 90" stroke="${s}" stroke-width="1.8" stroke-dasharray="3 3" fill="none"/></svg>`;
}

/**
 * Procedural Accessory SVG generator (Gloves, Pads, Kit bag, Helmet, Grips, etc.)
 */
export function generateItemSvg(kind: string, c1: string = "#F3EEE3", c2: string = "#C3262C"): string {
  const items: Record<string, string> = {
    gloves: `<svg viewBox="0 0 200 240" role="img" aria-label="Batting glove"><rect x="40" y="150" width="110" height="74" fill="${c2}"/><rect x="40" y="150" width="110" height="14" fill="${shade(c2, -0.25)}"/>${[0, 1, 2, 3].map((i) => `<rect x="${44 + i * 26}" y="${36 + (i % 3 === 0 ? 14 : 0)}" width="24" height="${120 - (i % 3 === 0 ? 14 : 0)}" rx="12" fill="${c1}"/>${[0, 1, 2, 3, 4].map((j) => `<rect x="${44 + i * 26}" y="${56 + (i % 3 === 0 ? 8 : 0) + j * 19}" width="24" height="5" fill="${shade(c1, -0.12)}"/>`).join("")}`).join("")}<rect x="10" y="118" width="40" height="22" rx="11" transform="rotate(-38 30 129)" fill="${c1}"/><rect x="60" y="182" width="72" height="24" fill="${c1}"/><text x="96" y="200" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="20" fill="${c2}">KRICKS</text></svg>`,
    pads: `<svg viewBox="0 0 200 240" role="img" aria-label="Batting pads">${[22, 108].map((x) => `<rect x="${x}" y="20" width="72" height="206" rx="30" fill="${c1}"/>${[0, 1, 2].map((i) => `<rect x="${x + 10 + i * 19}" y="60" width="14" height="150" rx="7" fill="${shade(c1, -0.1)}"/>`).join("")}<rect x="${x}" y="20" width="72" height="44" rx="22" fill="${shade(c1, -0.06)}"/><rect x="${x - 6}" y="96" width="84" height="12" fill="${c2}"/><rect x="${x - 6}" y="160" width="84" height="12" fill="${c2}"/>`).join("")}</svg>`,
    kitbag: `<svg viewBox="0 0 240 200" role="img" aria-label="Kit bag"><path d="M70 60 C70 28 170 28 170 60" stroke="${shade(c2, -0.3)}" stroke-width="10" fill="none"/><rect x="16" y="56" width="208" height="110" fill="${c2}"/><rect x="16" y="56" width="208" height="20" fill="${shade(c2, -0.22)}"/><rect x="30" y="96" width="120" height="50" fill="${shade(c2, -0.12)}"/><text x="90" y="131" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="30" fill="${c1}">KRICKS</text><circle cx="196" cy="172" r="16" fill="#0E1729"/><circle cx="196" cy="172" r="6" fill="${c1}"/><rect x="170" y="90" width="38" height="56" fill="${shade(c2, -0.12)}"/></svg>`,
    helmet: `<svg viewBox="0 0 220 220" role="img" aria-label="Batting helmet"><path d="M30 120 C30 50 80 24 120 24 C170 24 200 60 200 112 L200 128 L30 128 Z" fill="${c2}"/><path d="M120 24 C170 24 200 60 200 112 L200 128 L170 128 C176 80 160 40 120 24Z" fill="${shade(c2, -0.22)}"/><rect x="20" y="122" width="150" height="16" fill="${shade(c2, -0.35)}"/>${[0, 1, 2, 3].map((i) => `<path d="M${70 + i * 28} 140 L${74 + i * 28} 200" stroke="#C9CDD4" stroke-width="5"/>`).join("")}<path d="M60 150 L176 150 M64 176 L172 176 M70 200 L168 200" stroke="#C9CDD4" stroke-width="5" fill="none"/><rect x="40" y="70" width="70" height="24" fill="${c1}"/><text x="75" y="88" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="20" fill="${c2}">KRICKS</text></svg>`,
    grips: `<svg viewBox="0 0 220 220" role="img" aria-label="Bat grips">${[[30, "#C3262C"], [90, "#F3EEE3"], [150, "#3A3A3A"]].map(([x, c]) => `<rect x="${x}" y="24" width="44" height="176" rx="22" fill="${c}"/>${Array.from({ length: 14 }, (_, j) => `<path d="M${+x + 2} ${40 + j * 11} L${+x + 42} ${32 + j * 11}" stroke="${shade(String(c), -0.25)}" stroke-width="3"/>`).join("")}`).join("")}</svg>`,
    toeguard: `<svg viewBox="0 0 220 160" role="img" aria-label="Toe guard"><path d="M30 30 L30 96 Q30 130 70 130 L150 130 Q190 130 190 96 L190 30 L172 30 L172 92 Q172 112 148 112 L72 112 Q48 112 48 92 L48 30 Z" fill="${c2}"/><path d="M30 96 Q30 130 70 130 L150 130 Q190 130 190 96 L190 112 Q186 144 150 144 L70 144 Q34 144 30 112Z" fill="${shade(c2, -0.3)}"/></svg>`,
    balls: `<svg viewBox="0 0 220 200" role="img" aria-label="Six leather balls">${[[20, 96], [80, 96], [140, 96], [50, 40], [110, 40], [80, 140]].map(([x, y], i) => `<svg x="${x}" y="${y - 36}" width="64" height="64" viewBox="0 0 100 100">${generateBallSvg(i === 4 ? "white" : "leather").replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>`).join("")}</svg>`,
    tballs: `<svg viewBox="0 0 220 200" role="img" aria-label="Six tennis balls">${[[20, 96], [80, 96], [140, 96], [50, 40], [110, 40], [80, 140]].map(([x, y]) => `<svg x="${x}" y="${y - 36}" width="64" height="64" viewBox="0 0 100 100">${generateBallSvg("tennis").replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>`).join("")}</svg>`,
  };

  return items[kind] || "";
}

