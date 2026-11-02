import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateOrderPayment, getOrderByIdOrNumber } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify cryptographic signature if secret is configured
    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const orderId = orderEntity?.receipt || paymentEntity?.notes?.orderId;
      const paymentId = paymentEntity?.id;

      if (orderId && paymentId) {
        const order = await getOrderByIdOrNumber(orderId);
        if (order && order.paymentStatus !== "PAID") {
          const updated = await updateOrderPayment(order.id, paymentId, signature || undefined);
          if (updated) {
            await sendOrderConfirmationEmail(updated);
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

