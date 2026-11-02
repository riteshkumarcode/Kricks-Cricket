import { describe, it, expect } from "vitest";
import { validateCoupon } from "@/lib/coupons";

describe("Coupon Validator", () => {
  it("applies valid 10% discount for WELCOME10", () => {
    const res = validateCoupon("welcome10", 2000000); // ₹20,000
    expect(res.valid).toBe(true);
    expect(res.calculatedDiscount).toBe(200000); // 10% = ₹2,000
  });

  it("checks minimum order limit for squad coupon CLUB15", () => {
    const underLimit = validateCoupon("CLUB15", 1000000); // ₹10,000 (< ₹20,000)
    expect(underLimit.valid).toBe(false);

    const meetsLimit = validateCoupon("CLUB15", 3000000); // ₹30,000
    expect(meetsLimit.valid).toBe(true);
    expect(meetsLimit.calculatedDiscount).toBe(450000); // 15% = ₹4,500
  });

  it("rejects unknown coupon codes", () => {
    const invalid = validateCoupon("RANDOM_CODE", 1000000);
    expect(invalid.valid).toBe(false);
    expect(invalid.calculatedDiscount).toBe(0);
  });
});

