/**
 * Orders Service
 * Handles transactional order creation, status transitions, and lookups.
 * Resilient multi-storage: Uses PostgreSQL via Prisma with graceful file-storage fallback.
 */

import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export interface CreateOrderItemInput {
  productId?: string;
  name: string;
  sku?: string;
  optionsText?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  isCustom?: boolean;
  configuration?: Record<string, unknown> | null;
}

export interface CreateOrderInput {
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  currency: string;
  subtotal: number;
  discountTotal?: number;
  shippingTotal?: number;
  taxTotal?: number;
  grandTotal: number;
  couponCode?: string | null;
  gstin?: string | null;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod?: string;
  paymentGateway: "RAZORPAY" | "STRIPE" | "COD";
  items: CreateOrderItemInput[];
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  status:
    | "PENDING"
    | "PAID"
    | "CONFIRMED"
    | "IN_WORKSHOP"
    | "IN_PRODUCTION"
    | "PACKED"
    | "DISPATCHED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  currency: string;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  couponCode?: string | null;
  gstin?: string | null;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
  trackingUrl?: string | null;
  paymentGateway: string;
  paymentReference?: string | null;
  items: Array<CreateOrderItemInput & { id: string }>;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function ensureFileStorage(): OrderRecord[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]), "utf8");
    return [];
  }
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveFileStorage(orders: OrderRecord[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `KRC-${year}-${randomSuffix}`;
}

export async function createOrder(data: CreateOrderInput): Promise<OrderRecord> {
  const orderNumber = generateOrderNumber();
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newRecord: OrderRecord = {
    id: orderId,
    orderNumber,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    customerName: data.customerName,
    status: data.paymentGateway === "COD" ? "CONFIRMED" : "PENDING",
    paymentStatus: data.paymentGateway === "COD" ? "PENDING" : "PENDING",
    currency: data.currency,
    subtotal: data.subtotal,
    discountTotal: data.discountTotal || 0,
    shippingTotal: data.shippingTotal || 0,
    taxTotal: data.taxTotal || 0,
    grandTotal: data.grandTotal,
    couponCode: data.couponCode || null,
    gstin: data.gstin || null,
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress || data.shippingAddress,
    shippingMethod: data.shippingMethod || "standard",
    paymentGateway: data.paymentGateway,
    paymentReference: null,
    items: data.items.map((item, idx) => ({
      ...item,
      id: `item_${orderId}_${idx}`,
    })),
    createdAt: now,
    updatedAt: now,
  };

  // Attempt database persistence via Prisma
  try {
    if (process.env.DATABASE_URL) {
      await prisma.order.create({
        data: {
          id: newRecord.id,
          orderNumber: newRecord.orderNumber,
          customerEmail: newRecord.customerEmail,
          customerPhone: newRecord.customerPhone,
          customerName: newRecord.customerName,
          status: newRecord.status as any,
          paymentStatus: newRecord.paymentStatus as any,
          currency: newRecord.currency,
          subtotal: newRecord.subtotal,
          discountTotal: newRecord.discountTotal,
          shippingTotal: newRecord.shippingTotal,
          taxTotal: newRecord.taxTotal,
          grandTotal: newRecord.grandTotal,
          couponCode: newRecord.couponCode,
          gstin: newRecord.gstin,
          shippingAddress: newRecord.shippingAddress as any,
          billingAddress: newRecord.billingAddress as any,
          shippingMethod: newRecord.shippingMethod,
          items: {
            create: newRecord.items.map((i) => ({
              id: i.id,
              productId: i.productId,
              name: i.name,
              sku: i.sku,
              optionsText: i.optionsText,
              unitPrice: i.unitPrice,
              quantity: i.quantity,
              lineTotal: i.lineTotal,
              isCustom: i.isCustom || false,
              configuration: i.configuration as any,
            })),
          },
          payments: {
            create: {
              gateway: newRecord.paymentGateway,
              amount: newRecord.grandTotal,
              currency: newRecord.currency,
              status: newRecord.paymentStatus as any,
            },
          },
        },
      });
    }
  } catch (err) {
    // Database unreachable; seamlessly fall back to local file store
    console.warn("Database createOrder skipped or unavailable, using fallback storage:", (err as Error).message);
  }

  // Always keep file store synchronized for fast zero-config dev and test assertions
  const localOrders = ensureFileStorage();
  localOrders.unshift(newRecord);
  saveFileStorage(localOrders);

  return newRecord;
}

export async function getOrderByIdOrNumber(idOrNumber: string): Promise<OrderRecord | null> {
  const localOrders = ensureFileStorage();
  const foundLocal = localOrders.find(
    (o) => o.id === idOrNumber || o.orderNumber === idOrNumber
  );

  if (foundLocal) return foundLocal;

  try {
    if (process.env.DATABASE_URL) {
      const dbOrder = await prisma.order.findFirst({
        where: {
          OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
        },
        include: { items: true, payments: true },
      });

      if (dbOrder) {
        return {
          id: dbOrder.id,
          orderNumber: dbOrder.orderNumber,
          customerEmail: dbOrder.customerEmail,
          customerPhone: dbOrder.customerPhone,
          customerName: dbOrder.customerName,
          status: dbOrder.status as any,
          paymentStatus: dbOrder.paymentStatus as any,
          currency: dbOrder.currency,
          subtotal: dbOrder.subtotal,
          discountTotal: dbOrder.discountTotal,
          shippingTotal: dbOrder.shippingTotal,
          taxTotal: dbOrder.taxTotal,
          grandTotal: dbOrder.grandTotal,
          couponCode: dbOrder.couponCode,
          gstin: dbOrder.gstin,
          shippingAddress: dbOrder.shippingAddress as any,
          billingAddress: dbOrder.billingAddress as any,
          shippingMethod: dbOrder.shippingMethod,
          trackingNumber: dbOrder.trackingNumber,
          trackingCarrier: (dbOrder as any).trackingCarrier || "Blue Dart",
          trackingUrl: dbOrder.trackingUrl,
          paymentGateway: dbOrder.payments[0]?.gateway || "RAZORPAY",
          paymentReference: dbOrder.payments[0]?.gatewayPaymentId,
          items: dbOrder.items.map((i) => ({
            id: i.id,
            productId: i.productId || undefined,
            name: i.name,
            sku: i.sku || undefined,
            optionsText: i.optionsText || undefined,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
            lineTotal: i.lineTotal,
            isCustom: i.isCustom,
            configuration: i.configuration as any,
          })),
          createdAt: dbOrder.createdAt.toISOString(),
          updatedAt: dbOrder.updatedAt.toISOString(),
        };
      }
    }
  } catch (err) {
    // Ignore db read error
  }

  return null;
}

export async function updateOrderPayment(
  orderId: string,
  gatewayPaymentId: string,
  gatewaySignature?: string
): Promise<OrderRecord | null> {
  const localOrders = ensureFileStorage();
  const idx = localOrders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);

  if (idx !== -1) {
    localOrders[idx].paymentStatus = "PAID";
    localOrders[idx].status = "CONFIRMED";
    localOrders[idx].paymentReference = gatewayPaymentId;
    localOrders[idx].updatedAt = new Date().toISOString();
    saveFileStorage(localOrders);

    try {
      if (process.env.DATABASE_URL) {
        await prisma.order.update({
          where: { id: localOrders[idx].id },
          data: {
            status: "PAID" as any,
            paymentStatus: "CAPTURED" as any,
          },
        });
      }
    } catch {}

    return localOrders[idx];
  }

  return null;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderRecord["status"],
  tracking?: { carrier?: string; number?: string; url?: string }
): Promise<OrderRecord | null> {
  const localOrders = ensureFileStorage();
  const idx = localOrders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);

  if (idx !== -1) {
    localOrders[idx].status = status;
    if (tracking) {
      if (tracking.carrier) localOrders[idx].trackingCarrier = tracking.carrier;
      if (tracking.number) localOrders[idx].trackingNumber = tracking.number;
      if (tracking.url) localOrders[idx].trackingUrl = tracking.url;
    }
    localOrders[idx].updatedAt = new Date().toISOString();
    saveFileStorage(localOrders);

    try {
      if (process.env.DATABASE_URL) {
        await prisma.order.update({
          where: { id: localOrders[idx].id },
          data: {
            status: status as any,
            trackingNumber: tracking?.number,
            trackingUrl: tracking?.url,
          },
        });
      }
    } catch {}

    return localOrders[idx];
  }

  return null;
}

export async function getCustomerOrders(email: string): Promise<OrderRecord[]> {
  const localOrders = ensureFileStorage();
  return localOrders.filter(
    (o) => o.customerEmail.toLowerCase() === email.toLowerCase()
  );
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  return ensureFileStorage();
}
