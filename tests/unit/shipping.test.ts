import { describe, it, expect } from "vitest";
import {
  getAvailableShippingMethods,
  isCodEligible,
  DOMESTIC_FREE_SHIPPING_THRESHOLD,
  DOMESTIC_STANDARD_FEE,
} from "@/lib/shipping";

describe("Shipping Engine", () => {
  it("provides free standard shipping for domestic orders over ₹10,000", () => {
    const methods = getAvailableShippingMethods({
      country: "IN",
      postalCode: "110020",
      subtotal: DOMESTIC_FREE_SHIPPING_THRESHOLD + 50000,
      currency: "INR",
    });

    const standard = methods.find((m) => m.id === "standard");
    expect(standard).toBeDefined();
    expect(standard?.cost).toBe(0);
    expect(standard?.name).toContain("Free");
  });

  it("charges standard fee for domestic orders under ₹10,000", () => {
    const methods = getAvailableShippingMethods({
      country: "IN",
      postalCode: "110020",
      subtotal: 500000, // ₹5,000
      currency: "INR",
    });

    const standard = methods.find((m) => m.id === "standard");
    expect(standard).toBeDefined();
    expect(standard?.cost).toBe(DOMESTIC_STANDARD_FEE);
  });

  it("calculates international shipping in selected currency", () => {
    const methodsGBP = getAvailableShippingMethods({
      country: "GB",
      postalCode: "SW1A 1AA",
      subtotal: 15000,
      currency: "GBP",
    });

    expect(methodsGBP[0].currency).toBe("GBP");
    expect(methodsGBP[0].cost).toBe(2500); // £25
  });

  it("validates COD eligibility only for 6-digit Indian PIN codes under ₹50,000", () => {
    expect(isCodEligible("IN", "110020", 2500000)).toBe(true);
    expect(isCodEligible("IN", "11002", 2500000)).toBe(false);
    expect(isCodEligible("IN", "110020", 6000000)).toBe(false); // Over ₹50,000
    expect(isCodEligible("GB", "SW1A 1AA", 10000)).toBe(false); // Non-India
  });
});

