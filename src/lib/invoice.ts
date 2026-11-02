/**
 * Tax & GST Invoice Generator
 * Generates GST-compliant invoices for Indian orders (HSN 9506) and commercial export receipts.
 */

import { OrderRecord } from "./orders";
import { formatMoney } from "./tokens";

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  orderNumber: string;
  orderDate: string;
  seller: {
    legalName: string;
    tradeName: string;
    address: string;
    state: string;
    stateCode: string;
    gstin: string;
    pan: string;
    email: string;
    phone: string;
  };
  buyer: {
    name: string;
    email: string;
    phone: string;
    billingAddress: string;
    shippingAddress: string;
    gstin?: string | null;
    placeOfSupply: string;
  };
  items: Array<{
    sn: number;
    description: string;
    hsnCode: string;
    qty: number;
    unitPrice: number;
    discount: number;
    taxableAmount: number;
    taxRate: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    total: number;
  }>;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  totalTax: number;
  grandTotal: number;
  currency: string;
  isInterState: boolean;
}

export function generateInvoiceData(order: OrderRecord): InvoiceData {
  const isIndia =
    order.shippingAddress.country.toUpperCase() === "IN" ||
    order.shippingAddress.country.toLowerCase() === "india";

  const sellerState = "Delhi";
  const sellerStateCode = "07";
  const buyerState = order.shippingAddress.state || "Delhi";
  const isInterState = isIndia && buyerState.toLowerCase() !== sellerState.toLowerCase();

  // Cricket equipment HSN code: 9506 (Articles & equipment for general physical exercise, gymnastics, athletics, other sports)
  // Standard GST on cricket equipment: 12% (CGST 6% + SGST 6%, or IGST 12%)
  const taxRate = isIndia ? 12 : 0;

  const items = order.items.map((item, idx) => {
    const rawTotal = item.lineTotal;
    // Calculate reverse GST if inclusive
    const taxableAmount = isIndia ? Math.round((rawTotal * 100) / (100 + taxRate)) : rawTotal;
    const taxTotal = rawTotal - taxableAmount;

    const cgstAmount = isIndia && !isInterState ? Math.round(taxTotal / 2) : 0;
    const sgstAmount = isIndia && !isInterState ? taxTotal - cgstAmount : 0;
    const igstAmount = isIndia && isInterState ? taxTotal : 0;

    return {
      sn: idx + 1,
      description: item.optionsText ? `${item.name} (${item.optionsText})` : item.name,
      hsnCode: "95069920",
      qty: item.quantity,
      unitPrice: item.unitPrice,
      discount: 0,
      taxableAmount,
      taxRate,
      cgstAmount,
      sgstAmount,
      igstAmount,
      total: item.lineTotal,
    };
  });

  return {
    invoiceNumber: `INV-${order.orderNumber.replace("KRC-", "")}`,
    invoiceDate: new Date(order.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    seller: {
      legalName: "Kricks Cricket Craft Pvt Ltd",
      tradeName: "Krickscricket",
      address: "Plot 42, Okhla Industrial Area Phase III, New Delhi 110020, India",
      state: "Delhi",
      stateCode: "07",
      gstin: "07AABCK9876Q1Z9",
      pan: "AABCK9876Q",
      email: "orders@krickscricket.com",
      phone: "+91 98110 00000",
    },
    buyer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      billingAddress: `${order.billingAddress.street}, ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postalCode}, ${order.billingAddress.country}`,
      shippingAddress: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
      gstin: order.gstin,
      placeOfSupply: `${buyerState}`,
    },
    items,
    subtotal: order.subtotal,
    discountTotal: order.discountTotal,
    shippingTotal: order.shippingTotal,
    totalTax: items.reduce((n, i) => n + (i.cgstAmount + i.sgstAmount + i.igstAmount), 0),
    grandTotal: order.grandTotal,
    currency: order.currency,
    isInterState,
  };
}

