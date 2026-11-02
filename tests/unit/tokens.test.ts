import { describe, it, expect } from "vitest";
import { shade, formatMoney, escapeHtml } from "../../src/lib/tokens";

describe("Design Tokens & Helpers", () => {
  it("shades colors correctly", () => {
    // Darken #FFFFFF
    const darkened = shade("#FFFFFF", -0.5);
    expect(darkened).toBe("#808080");

    // Lighten #000000
    const lightened = shade("#000000", 0.5);
    expect(lightened).toBe("#808080");

    // Handles invalid or missing inputs gracefully
    expect(shade("", 0.2)).toBe("");
  });

  it("formats currency in INR minor units without decimals", () => {
    // 2499900 paise = ₹24,999
    const formatted = formatMoney(2499900, "INR");
    expect(formatted).toContain("24,999");
  });

  it("converts and formats foreign currencies", () => {
    // 2499900 paise = ~24999 / 88 = $285
    const usd = formatMoney(2499900, "USD");
    expect(usd).toContain("285");
  });

  it("escapes HTML characters", () => {
    expect(escapeHtml('<script>alert("XSS")</script>')).toBe(
      "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
    );
  });
});

