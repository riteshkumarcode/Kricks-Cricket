/**
 * Krickscricket — Shared Brand & Design Token Utilities
 */

/**
 * Procedural color shading helper extracted exactly from kricks.js
 * Darkens (negative amt) or lightens (positive amt) a hex color.
 */
export function shade(hex: string, amt: number): string {
  if (!hex) return "";
  if (!hex.startsWith("#")) return hex;
  const cleanHex = hex.replace("#", "");
  const n = parseInt(cleanHex.length === 3 ? cleanHex.split("").map((c) => c + c).join("") : cleanHex, 16);
  if (isNaN(n)) return hex;

  const r = n >> 16;
  const g = (n >> 8) & 255;
  const b = n & 255;

  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));

  return "#" + [f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, "0")).join("");
}

/**
 * Standard exchange rates relative to INR base
 */
export const DEFAULT_RATES: Record<string, number> = {
  INR: 1,
  USD: 1 / 88,
  GBP: 1 / 116,
  AUD: 1 / 57,
  AED: 1 / 24,
  ZAR: 1 / 5,
};

/**
 * Currency formatter supporting minor units (paise/cents)
 * @param inrMinor - Amount in INR minor units (paise: e.g. 2499900 = 24,999 INR)
 * @param currency - Active currency code (INR, USD, GBP, AUD, AED, ZAR)
 * @param rates - Current exchange rates map
 */
export function formatMoney(
  inrMinor: number,
  currency: string = "INR",
  rates: Record<string, number> = DEFAULT_RATES
): string {
  const inr = inrMinor / 100;
  const rate = rates[currency] || DEFAULT_RATES[currency] || 1;
  const converted = inr * rate;

  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-GB", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(currency === "INR" ? converted : Math.ceil(converted));
}

/**
 * Escape HTML special characters for safe SVG / string injection
 */
export function escapeHtml(s: string | number): string {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c] || c));
}
