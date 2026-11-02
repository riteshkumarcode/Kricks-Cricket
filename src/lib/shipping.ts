/**
 * Shipping Rates & Methods Calculator
 * Pluggable adapter for Shiprocket & custom flat-rate international zones.
 */

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number; // in minor units of currency
  currency: string;
  estimatedDays: string;
}

export interface ShippingCalculationParams {
  country: string;
  postalCode: string;
  subtotal: number; // in minor units
  currency: string;
}

// Domestic Free Shipping Threshold: ₹10,000 (1,000,000 paise)
export const DOMESTIC_FREE_SHIPPING_THRESHOLD = 1000000;
export const DOMESTIC_STANDARD_FEE = 29900; // ₹299
export const DOMESTIC_EXPRESS_FEE = 59900; // ₹599
export const COD_HANDLING_FEE = 9900; // ₹99

// International flat rates per currency
const INTERNATIONAL_SHIPPING_RATES: Record<string, { standard: number; express: number }> = {
  USD: { standard: 3500, express: 5500 }, // $35 / $55
  GBP: { standard: 2500, express: 4000 }, // £25 / £40
  AUD: { standard: 4500, express: 7000 }, // A$45 / A$70
  AED: { standard: 12000, express: 18000 }, // AED 120 / AED 180
  ZAR: { standard: 55000, express: 85000 }, // R 550 / R 850
};

/**
 * Returns available shipping methods for a given address and cart total
 */
export function getAvailableShippingMethods({
  country,
  subtotal,
  currency,
}: ShippingCalculationParams): ShippingMethod[] {
  const isIndia = country.toUpperCase() === "IN" || country.toLowerCase() === "india";

  if (isIndia && currency === "INR") {
    const isFree = subtotal >= DOMESTIC_FREE_SHIPPING_THRESHOLD;

    return [
      {
        id: "standard",
        name: isFree ? "Standard Delivery (Free)" : "Standard Delivery",
        description: isFree
          ? "Complimentary on orders over ₹10,000. Tracked delivery in 3–5 working days."
          : "Fully tracked courier via Blue Dart / Delhivery (3–5 working days).",
        cost: isFree ? 0 : DOMESTIC_STANDARD_FEE,
        currency: "INR",
        estimatedDays: "3–5 working days",
      },
      {
        id: "express",
        name: "Express Air Delivery",
        description: "Priority dispatch with next-day air freight to major cities (1–2 working days).",
        cost: DOMESTIC_EXPRESS_FEE,
        currency: "INR",
        estimatedDays: "1–2 working days",
      },
    ];
  }

  // International shipping
  const rates = INTERNATIONAL_SHIPPING_RATES[currency] || { standard: 3500, express: 5500 };

  return [
    {
      id: "intl-standard",
      name: "International Tracked Delivery",
      description: "DHL Express / FedEx International Economy with full doorstep tracking.",
      cost: rates.standard,
      currency,
      estimatedDays: "7–12 working days",
    },
    {
      id: "intl-priority",
      name: "International Priority Express",
      description: "Fastest air courier dispatch (4–7 working days).",
      cost: rates.express,
      currency,
      estimatedDays: "4–7 working days",
    },
  ];
}

/**
 * Validates if an Indian PIN code is eligible for Cash on Delivery (COD)
 */
export function isCodEligible(country: string, postalCode: string, grandTotal: number): boolean {
  const isIndia = country.toUpperCase() === "IN" || country.toLowerCase() === "india";
  if (!isIndia) return false;

  // Maximum COD order limit: ₹50,000 (5,000,000 paise)
  if (grandTotal > 5000000) return false;

  // 6-digit Indian PIN code check
  const cleanPin = postalCode.trim();
  return /^[1-9][0-9]{5}$/.test(cleanPin);
}

