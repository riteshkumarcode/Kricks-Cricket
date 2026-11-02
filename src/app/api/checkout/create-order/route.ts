import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/orders";
import { validateCoupon } from "@/lib/coupons";
import { getAvailableShippingMethods, isCodEligible } from "@/lib/shipping";
import { sendOrderConfirmationEmail } from "@/lib/email";

const CreateOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email required"),
    phone: z.string().min(7, "Valid phone number required"),
  }),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(3),
    country: z.string().min(2),
  }),
  currency: z.string().default("INR"),
  shippingMethodId: z.string().default("standard"),
  couponCode: z.string().optional().nullable(),
  gstin: z.string().optional().nullable(),
  paymentGateway: z.enum(["RAZORPAY", "STRIPE", "COD"]),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      opts: z.string().optional().nullable(),
      price: z.number().int().positive(),
      qty: z.number().int().positive(),
      bat: z.any().optional(),
      drawingType: z.string().optional(),
    })
  ).min(1, "Cart cannot be empty"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      customer,
      shippingAddress,
      currency,
      shippingMethodId,
      couponCode,
      gstin,
      paymentGateway,
      items,
    } = parsed.data;

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Apply coupon if provided
    let discountTotal = 0;
    if (couponCode) {
      const couponRes = validateCoupon(couponCode, subtotal);
      if (couponRes.valid) {
        discountTotal = couponRes.calculatedDiscount;
      }
    }

    // Calculate shipping
    const shippingMethods = getAvailableShippingMethods({
      country: shippingAddress.country,
      postalCode: shippingAddress.postalCode,
      subtotal,
      currency,
    });

    const chosenShipping =
      shippingMethods.find((m) => m.id === shippingMethodId) || shippingMethods[0];
    let shippingTotal = chosenShipping.cost;

    // If coupon is free shipping
    if (couponCode && couponCode.toUpperCase() === "FREESHIP") {
      shippingTotal = 0;
    }

    // COD eligibility & fee check
    if (paymentGateway === "COD") {
      const eligible = isCodEligible(shippingAddress.country, shippingAddress.postalCode, subtotal);
      if (!eligible) {
        return NextResponse.json(
          { error: "Cash on delivery is not eligible for this address or order value" },
          { status: 400 }
        );
      }
      shippingTotal += 9900; // Add ₹99 COD handling fee
    }

    const grandTotal = Math.max(0, subtotal - discountTotal + shippingTotal);

    // Format line items
    const orderItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      optionsText: item.opts || undefined,
      unitPrice: item.price,
      quantity: item.qty,
      lineTotal: item.price * item.qty,
      isCustom: !!item.bat,
      configuration: item.bat || null,
    }));

    // Create order
    const order = await createOrder({
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerName: customer.name,
      currency,
      subtotal,
      discountTotal,
      shippingTotal,
      grandTotal,
      couponCode: couponCode || null,
      gstin: gstin || null,
      shippingAddress,
      shippingMethod: chosenShipping.name,
      paymentGateway,
      items: orderItems,
    });

    // If COD, dispatch confirmation email immediately
    if (paymentGateway === "COD") {
      await sendOrderConfirmationEmail(order);
    }

    return NextResponse.json({
      success: true,
      order,
      razorpayOrderId: paymentGateway === "RAZORPAY" ? `rzp_order_${order.id}` : null,
      stripeClientSecret: paymentGateway === "STRIPE" ? `seti_${order.id}_secret_test` : null,
    });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: "Failed to create order", message: (err as Error).message },
      { status: 500 }
    );
  }
}

