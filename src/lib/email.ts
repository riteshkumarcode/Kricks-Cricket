/**
 * Transactional Email Dispatcher
 * Brand-styled HTML templates with zero-config test logging and Resend/SMTP support.
 */

import { OrderRecord } from "./orders";
import { formatMoney } from "./tokens";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  // If Resend API key is provided
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Krickscricket <orders@krickscricket.com>",
          to,
          subject,
          html,
        }),
      });
      return res.ok;
    } catch (err) {
      console.warn("Failed sending via Resend:", (err as Error).message);
    }
  }

  // Development & Test Mode logger
  console.log(`\n================== TRANSACTIONAL EMAIL SENT ==================`);
  console.log(`TO:      ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`TIME:    ${new Date().toISOString()}`);
  console.log(`--------------------------------------------------------------`);
  console.log(`HTML length: ${html.length} characters`);
  console.log(`==============================================================\n`);
  return true;
}

export async function sendOrderConfirmationEmail(order: OrderRecord): Promise<boolean> {
  const isCustomBat = order.items.some((i) => i.isCustom);
  const estDispatch = isCustomBat
    ? "10–14 working days (handcrafted to your custom specs)"
    : "3 working days";

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E6E3DE;">
          <b style="font-size: 16px; color: #111111;">${item.name}</b>
          ${item.optionsText ? `<div style="font-size: 14px; color: #6B6966; margin-top: 4px;">${item.optionsText}</div>` : ""}
          <div style="font-size: 14px; color: #6B6966;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E6E3DE; text-align: right; font-weight: 500; font-size: 16px; color: #111111;">
          ${formatMoney(item.lineTotal, order.currency)}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F3F0; margin: 0; padding: 40px 16px;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; padding: 40px; border: 1px solid #E6E3DE;">
        <div style="font-family: Impact, 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: -0.5px; color: #111111; margin-bottom: 24px;">
          KRICKS<span style="color: #C8501A;">.</span>
        </div>

        <h1 style="font-size: 26px; color: #111111; margin: 0 0 16px;">Order Confirmed, ${order.customerName}!</h1>
        <p style="font-size: 16px; color: #6B6966; line-height: 1.6; margin: 0 0 24px;">
          Thank you for trusting Kricks with your game. We have received your order <b style="color: #111111;">${order.orderNumber}</b> and our workshop is preparing it.
        </p>

        <div style="background: #F4F3F0; padding: 18px 24px; margin-bottom: 32px;">
          <div style="font-size: 14px; color: #6B6966; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Estimated Dispatch</div>
          <div style="font-size: 18px; font-weight: 600; color: #111111;">${estDispatch}</div>
        </div>

        <h2 style="font-size: 18px; text-transform: uppercase; letter-spacing: 0.05em; color: #111111; border-bottom: 2px solid #111111; padding-bottom: 8px; margin: 0 0 16px;">
          Order Summary
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          ${itemsHtml}
        </table>

        <div style="border-top: 2px solid #111111; padding-top: 16px; margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px; color: #6B6966;">
            <span>Subtotal</span>
            <span>${formatMoney(order.subtotal, order.currency)}</span>
          </div>
          ${order.discountTotal ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px; color: #C8501A;">
            <span>Discount (${order.couponCode})</span>
            <span>-${formatMoney(order.discountTotal, order.currency)}</span>
          </div>
          ` : ""}
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px; color: #6B6966;">
            <span>Shipping</span>
            <span>${order.shippingTotal === 0 ? "Free" : formatMoney(order.shippingTotal, order.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 20px; font-weight: 700; color: #111111;">
            <span>Total</span>
            <span>${formatMoney(order.grandTotal, order.currency)}</span>
          </div>
        </div>

        <div style="border-top: 1px solid #E6E3DE; padding-top: 24px; font-size: 14px; color: #6B6966; line-height: 1.6;">
          <b style="color: #111111;">Delivery Address:</b><br>
          ${order.shippingAddress.fullName}<br>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmed: ${order.orderNumber} · Krickscricket`,
    html,
  });
}

