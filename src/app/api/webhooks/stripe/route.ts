import { NextRequest, NextResponse } from "next/server";
import { updateOrderPayment, getOrderByIdOrNumber } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    // In production with stripe SDK: stripe.webhooks.constructEvent(rawBody, signature, secret)
    // Resilient parser:
    const payload = JSON.parse(rawBody);

    if (payload.type === "payment_intent.succeeded" || payload.type === "checkout.session.completed") {
      const obj = payload.data?.object;
      const orderId = obj?.metadata?.orderId || obj?.client_reference_id;
      const paymentId = obj?.id;

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

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Stripe webhook failed" }, { status: 500 });
  }
}

