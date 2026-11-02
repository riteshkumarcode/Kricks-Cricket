import { shade, escapeHtml } from "./tokens";

export interface BatOptions {
  blade?: string;
  grip?: string;
  sticker?: string;
  stickerInk?: string;
  view?: "face" | "back" | "edge";
  grains?: number;
  label?: string;
  grade?: string;
  name?: string;
  num?: string;
}

const BLADE_PATH =
  "M48 186 C48 202 20 206 16 224 L14 482 Q14 508 40 510 L80 510 Q106 508 106 482 L104 224 C100 206 72 202 72 186 Z";

function renderHandle(grip: string): string {
  let ribs = "";
  for (let y = 16; y < 192; y += 9) {
    ribs += `<path d="M49 ${y + 7} L71 ${y}" stroke="${shade(grip, -0.28)}" stroke-width="2.6"/>`;
  }
  return `<rect x="49" y="6" width="22" height="188" fill="${grip}"/>${ribs}<rect x="49" y="6" width="5" height="188" fill="${shade(grip, -0.22)}"/><rect x="47" y="2" width="26" height="10" fill="${shade(grip, -0.15)}"/>`;
}

/**
 * Generates the procedural Cricket Bat SVG string matching kricks.js pixel-faithfully
 */
export function generateBatSvg(o: BatOptions = {}): string {
  const blade = o.blade || "#E3C78E";
  const grip = o.grip || "#C3262C";
  const st = o.sticker || "#0A0A0A";
  const stInk = o.stickerInk || "#F0E3C3";
  const view = o.view || "face";
  const grains = o.grains || 9;

  const head = `<svg viewBox="0 0 120 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(o.label || "Cricket bat")}">`;

  if (view === "edge") {
    return (
      head +
      renderHandle(grip) +
      `<path d="M49 186 C52 214 50 236 48 260 C44 330 42 420 46 478 Q48 506 60 510 L66 510 Q78 500 78 470 C80 400 74 300 70 250 C68 226 70 206 71 186 Z" fill="${blade}"/>` +
      `<path d="M60 510 Q48 506 46 478 C42 420 44 330 48 260 L54 260 C51 330 50 420 53 478 Q55 504 62 510 Z" fill="${shade(blade, -0.16)}"/>` +
      `<path d="M46 492 Q48 508 60 512 L66 512 Q76 506 78 492" fill="${shade(blade, -0.45)}"/></svg>`
    );
  }

  let g = "";
  if (view === "face") {
    for (let i = 0; i < grains; i++) {
      const x = 24 + i * (72 / (grains - 1 || 1));
      g += `<path d="M${x} 236 C${x + 1.4} 320 ${x - 1.4} 420 ${x} 500" stroke="${shade(blade, -0.3)}" stroke-width="1"/>`;
    }
  }

  const edges = `<path d="M16 224 L14 482 Q14 508 40 510 L30 509 Q22 500 22 482 L23 226 Z" fill="${shade(blade, -0.18)}"/><path d="M104 224 L106 482 Q106 508 80 510 L90 509 Q98 500 98 482 L97 226 Z" fill="${shade(blade, -0.18)}"/>`;

  let face = "";
  if (view === "face") {
    face =
      `<rect x="20" y="232" width="80" height="58" fill="${st}"/><text x="60" y="275" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="34" fill="${stInk}">KRICKS</text>` +
      `<rect x="20" y="454" width="80" height="20" fill="${st}"/><text x="60" y="469" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="11.5" letter-spacing=".5" fill="${stInk}">${escapeHtml(o.grade || "ENGLISH WILLOW")}</text>`;

    if (o.name) {
      face += `<text transform="translate(70 446) rotate(-90)" font-family="Bebas Neue,Impact,sans-serif" font-size="36" fill="${shade(blade, -0.5)}">${escapeHtml(String(o.name).toUpperCase().slice(0, 10))}</text>`;
    }
    if (o.num) {
      face += `<text x="38" y="312" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="22" fill="${shade(blade, -0.5)}">${escapeHtml(String(o.num).slice(0, 3))}</text>`;
    }
  } else {
    // Back view
    face = `<path d="M52 214 C56 300 56 400 54 500 L66 500 C64 400 64 300 68 214 Z" fill="${shade(blade, 0.18)}"/><rect x="40" y="240" width="40" height="30" fill="${st}"/><text x="60" y="262" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="18" fill="${stInk}">KRICKS</text>`;
  }

  const toe = `<path d="M14 490 Q14 508 40 510 L80 510 Q106 508 106 490 L106 500 Q102 514 80 515 L40 515 Q18 514 14 500 Z" fill="${shade(blade, -0.45)}"/>`;

  return head + renderHandle(grip) + `<path d="${BLADE_PATH}" fill="${blade}"/>` + edges + g + face + toe + "</svg>";
}

