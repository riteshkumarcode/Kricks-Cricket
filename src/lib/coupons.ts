/**
 * Promotional Coupon Validator
 */

export interface CouponResult {
  valid: boolean;
  code: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number; // Percentage (e.g. 10 for 10%) or fixed minor units
  description: string;
  calculatedDiscount: number;
}

const ACTIVE_COUPONS: Record<
  string,
  { type: "percentage" | "fixed" | "free_shipping"; value: number; description: string; minOrder?: number }
> = {
  WELCOME10: {
    type: "percentage",
    value: 10,
    description: "10% off your entire order",
  },
  CLUB15: {
    type: "percentage",
    value: 15,
    description: "15% off squad orders",
    minOrder: 2000000, // ₹20,000 minimum
  },
  FLAT1000: {
    type: "fixed",
    value: 100000, // ₹1,000 off
    description: "₹1,000 off on orders over ₹15,000",
    minOrder: 1500000,
  },
  FREESHIP: {
    type: "free_shipping",
    value: 100,
    description: "Free shipping worldwide",
  },
};

export function validateCoupon(code: string, subtotal: number): CouponResult {
  const cleanCode = code.trim().toUpperCase();
  const coupon = ACTIVE_COUPONS[cleanCode];

  if (!coupon) {
    return {
      valid: false,
      code: cleanCode,
      discountType: "fixed",
      discountValue: 0,
      description: "Invalid coupon code",
      calculatedDiscount: 0,
    };
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      valid: false,
      code: cleanCode,
      discountType: coupon.type,
      discountValue: coupon.value,
      description: `Minimum order requirement not met for this coupon`,
      calculatedDiscount: 0,
    };
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = Math.round((subtotal * coupon.value) / 100);
  } else if (coupon.type === "fixed") {
    discount = Math.min(coupon.value, subtotal);
  }

  return {
    valid: true,
    code: cleanCode,
    discountType: coupon.type,
    discountValue: coupon.value,
    description: coupon.description,
    calculatedDiscount: discount,
  };
}

