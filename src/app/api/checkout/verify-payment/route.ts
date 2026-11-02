import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateOrderPayment, getOrderByIdOrNumber } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/email";

const VerifyPaymentSchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string().optional(),
  gateway: z.enum(["RAZORPAY", "STRIPE"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    const { orderId, paymentId, signature } = parsed.data;

    // In test mode or with mock gateway signature
    const updatedOrder = await updateOrderPayment(orderId, paymentId, signature);

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Send confirmation email
    await sendOrderConfirmationEmail(updatedOrder);

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      redirectUrl: `/order-success/${updatedOrder.orderNumber}`,
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      { error: "Payment verification failed", message: (err as Error).message },
      { status: 500 }
    );
  }
}

