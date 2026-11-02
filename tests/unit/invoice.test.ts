import { describe, it, expect } from "vitest";
import { generateInvoiceData } from "@/lib/invoice";
import { OrderRecord } from "@/lib/orders";

describe("Tax Invoice Engine", () => {
  const mockOrder: OrderRecord = {
    id: "ord_test_123",
    orderNumber: "KRC-2026-9999",
    customerEmail: "virat@example.com",
    customerPhone: "+91 98765 43210",
    customerName: "Virat Kohli",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    currency: "INR",
    subtotal: 2499900,
    discountTotal: 0,
    shippingTotal: 0,
    taxTotal: 0,
    grandTotal: 2499900,
    shippingAddress: {
      fullName: "Virat Kohli",
      street: "18 Pavilion Drive",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    billingAddress: {
      fullName: "Virat Kohli",
      street: "18 Pavilion Drive",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    paymentGateway: "RAZORPAY",
    items: [
      {
        id: "item_1",
        productId: "pro-edition",
        name: "Pro Edition",
        unitPrice: 2499900,
        quantity: 1,
        lineTotal: 2499900,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("generates GST invoice with HSN 95069920 and IGST for inter-state supply", () => {
    const invoice = generateInvoiceData(mockOrder);
    expect(invoice.invoiceNumber).toBe("INV-2026-9999");
    expect(invoice.isInterState).toBe(true); // Maharashtra vs Delhi
    expect(invoice.items[0].hsnCode).toBe("95069920");
    expect(invoice.items[0].igstAmount).toBeGreaterThan(0);
    expect(invoice.items[0].cgstAmount).toBe(0);
  });
});

