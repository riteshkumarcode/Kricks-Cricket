"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OrderRecord } from "@/lib/orders";
import { InvoiceData } from "@/lib/invoice";
import { formatMoney } from "@/lib/tokens";
import { generateBatSvg } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import { getProductById } from "@/lib/catalog";

export function OrderSuccessClient({
  order,
  invoice,
}: {
  order: OrderRecord;
  invoice: InvoiceData;
}) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const steps = [
    { title: "Confirmed", desc: "Payment received & logged" },
    { title: "In Workshop", desc: "Willow selection & shaping" },
    { title: "Dispatched", desc: "Tracked air courier" },
    { title: "Delivered", desc: "Ready for the middle" },
  ];

  const currentStepIndex =
    order.status === "DELIVERED"
      ? 3
      : order.status === "DISPATCHED"
      ? 2
      : order.status === "IN_WORKSHOP"
      ? 1
      : 0;

  const renderThumbnail = (item: OrderRecord["items"][0]) => {
    if (item.isCustom && item.configuration) {
      const batConfig = item.configuration as any;
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: generateBatSvg({
              blade: batConfig.blade || "#E8CE95",
              grip: batConfig.grip || "#C3262C",
              sticker: batConfig.sticker || "#0A0A0A",
              grains: batConfig.grains || 11,
              name: batConfig.name,
              num: batConfig.num,
              label: item.name,
            }),
          }}
        />
      );
    }

    const p = item.productId ? getProductById(item.productId) : null;
    const isAcc = p?.cat === "acc";

    if (isAcc) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: generateItemSvg(
              p?.drawingType || "gloves",
              p?.color1 || "#F3EEE3",
              p?.color2 || "#C3262C"
            ),
          }}
        />
      );
    }

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: generateBatSvg({
            blade: p?.bladeColor || "#E8CE95",
            grip: p?.gripColor || "#C3262C",
            sticker: p?.stickerColor || "#0A0A0A",
            grains: p?.grainsCount || 11,
            label: item.name,
          }),
        }}
      />
    );
  };

  return (
    <>
      <section className="frame" id="order-success-view" style={{ paddingBlock: "64px 96px" }}>
        {/* Header Confirmation Banner */}
        <div style={{ maxWidth: "800px", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "#E8F5E9", color: "#2E7D32", padding: "6px 14px", fontWeight: "bold", fontSize: "14px", marginBottom: "16px" }}>
            ✓ ORDER #{order.orderNumber} CONFIRMED
          </div>

          <h1 style={{ fontSize: "clamp(38px, 5vw, 60px)", lineHeight: 0.95, textTransform: "uppercase" }}>
            Thank you, {order.customerName}<span>.</span>
          </h1>

          <p style={{ fontSize: "20px", color: "var(--muted)", marginTop: "14px", maxWidth: "54ch" }}>
            We&apos;ve sent your order confirmation receipt to <b style={{ color: "var(--ink)" }}>{order.customerEmail}</b>. Our craftsmen will select your willow cleft and begin preparation immediately.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
            <button
              type="button"
              className="btn ink"
              onClick={() => setShowInvoiceModal(true)}
              style={{ minHeight: "44px", fontSize: "17px", padding: "0 20px" }}
            >
              📄 View Tax Invoice
            </button>
            <a
              href={`https://wa.me/919811000000?text=${encodeURIComponent(`Hi Kricks, I placed order ${order.orderNumber}. Could I get WhatsApp dispatch updates?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ minHeight: "44px", fontSize: "17px", padding: "0 20px" }}
            >
              💬 WhatsApp Updates
            </a>
          </div>
        </div>

        {/* Fulfillment Timeline Steps */}
        <div style={{ background: "var(--surface)", padding: "32px", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "24px", textTransform: "uppercase" }}>
            Order Status: <span style={{ color: "var(--accent)" }}>{order.status.replace("_", " ")}</span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "24px",
              position: "relative",
            }}
          >
            {steps.map((st, i) => {
              const isPastOrCurrent = i <= currentStepIndex;
              return (
                <div key={st.title} style={{ opacity: isPastOrCurrent ? 1 : 0.45 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        background: isPastOrCurrent ? "var(--accent)" : "#9C9993",
                        color: "#FFFFFF",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {isPastOrCurrent ? "✓" : i + 1}
                    </div>
                    <b style={{ fontSize: "17px" }}>{st.title}</b>
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--muted)" }}>{st.desc}</p>
                </div>
              );
            })}
          </div>

          {order.trackingNumber && (
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
              <b>Tracking:</b> {order.trackingCarrier} #{order.trackingNumber}
            </div>
          )}
        </div>

        {/* Two-column Order Details */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
          {/* Purchased Items */}
          <div>
            <h2 style={{ fontSize: "24px", marginBottom: "20px", textTransform: "uppercase" }}>
              Items Ordered ({order.items.length})
            </h2>

            <div style={{ display: "grid", gap: "16px" }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "18px",
                    alignItems: "center",
                    paddingBottom: "16px",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "76px",
                      background: "var(--surface)",
                      display: "grid",
                      placeItems: "center",
                      flex: "none",
                    }}
                  >
                    {renderThumbnail(item)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <b style={{ fontSize: "18px", display: "block" }}>{item.name}</b>
                    {item.optionsText && (
                      <span style={{ fontSize: "14px", color: "var(--muted)", display: "block" }}>
                        {item.optionsText}
                      </span>
                    )}
                    <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                      Qty: {item.quantity} × {formatMoney(item.unitPrice, order.currency)}
                    </span>
                  </div>
                  <span className="price" style={{ fontSize: "18px", fontWeight: 600 }}>
                    {formatMoney(item.lineTotal, order.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Summary */}
          <div style={{ display: "grid", gap: "32px" }}>
            <div style={{ background: "var(--surface)", padding: "24px" }}>
              <h3 style={{ fontSize: "20px", marginBottom: "14px", textTransform: "uppercase" }}>
                Delivery Address
              </h3>
              <p style={{ fontSize: "16px", lineHeight: 1.6 }}>
                <b>{order.shippingAddress.fullName}</b><br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}<br />
                Phone: {order.customerPhone}
              </p>
            </div>

            <div style={{ background: "var(--surface)", padding: "24px" }}>
              <h3 style={{ fontSize: "20px", marginBottom: "14px", textTransform: "uppercase" }}>
                Payment Summary
              </h3>
              <div style={{ display: "grid", gap: "8px", fontSize: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Payment Gateway</span>
                  <b>{order.paymentGateway} ({order.paymentStatus})</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <span className="price">{formatMoney(order.subtotal, order.currency)}</span>
                </div>
                {order.discountTotal > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent)" }}>
                    <span>Discount ({order.couponCode})</span>
                    <span className="price">-{formatMoney(order.discountTotal, order.currency)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping</span>
                  <span className="price">
                    {order.shippingTotal === 0 ? "Free" : formatMoney(order.shippingTotal, order.currency)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "2px solid var(--ink)",
                    paddingTop: "10px",
                    marginTop: "6px",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  <span>Grand Total</span>
                  <span className="price" id="confirmed-total">
                    {formatMoney(order.grandTotal, order.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "48px" }}>
          <Link href="/leather-bats" className="btn">
            Continue Browsing <span className="ar">→</span>
          </Link>
        </div>
      </section>

      {/* Tax Invoice Modal */}
      {showInvoiceModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              maxWidth: "800px",
              width: "100%",
              padding: "40px",
              color: "#111111",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #111111", paddingBottom: "20px", marginBottom: "24px" }}>
              <div>
                <div style={{ fontFamily: "var(--display)", fontSize: "36px", lineHeight: 1 }}>
                  KRICKS<span style={{ color: "#C8501A" }}>.</span>
                </div>
                <div style={{ fontSize: "14px", color: "#6B6966", marginTop: "4px" }}>
                  {invoice.seller.legalName}<br />
                  GSTIN: {invoice.seller.gstin} | PAN: {invoice.seller.pan}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ fontSize: "28px", margin: 0 }}>TAX INVOICE</h2>
                <div style={{ fontSize: "14px", color: "#6B6966", marginTop: "4px" }}>
                  Invoice: <b>{invoice.invoiceNumber}</b><br />
                  Date: {invoice.invoiceDate}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px", fontSize: "14px" }}>
              <div>
                <b>Billed To:</b><br />
                {invoice.buyer.name}<br />
                {invoice.buyer.billingAddress}<br />
                {invoice.buyer.gstin && <>GSTIN: {invoice.buyer.gstin}<br /></>}
                Phone: {invoice.buyer.phone}
              </div>
              <div>
                <b>Shipped To:</b><br />
                {invoice.buyer.name}<br />
                {invoice.buyer.shippingAddress}<br />
                Place of Supply: {invoice.buyer.placeOfSupply}
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#F4F3F0", borderBottom: "1px solid #111111" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>#</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Item &amp; Description</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>HSN</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Qty</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Rate</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((i) => (
                  <tr key={i.sn} style={{ borderBottom: "1px solid #E6E3DE" }}>
                    <td style={{ padding: "10px" }}>{i.sn}</td>
                    <td style={{ padding: "10px" }}><b>{i.description}</b></td>
                    <td style={{ padding: "10px", textAlign: "center" }}>{i.hsnCode}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>{i.qty}</td>
                    <td style={{ padding: "10px", textAlign: "right" }}>{formatMoney(i.unitPrice, invoice.currency)}</td>
                    <td style={{ padding: "10px", textAlign: "right" }}>{formatMoney(i.total, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
              <div style={{ width: "280px", display: "grid", gap: "8px", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span>{formatMoney(invoice.subtotal, invoice.currency)}</span>
                </div>
                {invoice.discountTotal > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#C8501A" }}>
                    <span>Discount:</span>
                    <span>-{formatMoney(invoice.discountTotal, invoice.currency)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping:</span>
                  <span>{invoice.shippingTotal === 0 ? "Free" : formatMoney(invoice.shippingTotal, invoice.currency)}</span>
                </div>
                {invoice.totalTax > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#6B6966" }}>
                    <span>Estimated GST (12% incl):</span>
                    <span>{formatMoney(invoice.totalTax, invoice.currency)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #111111", paddingTop: "8px", fontWeight: "bold", fontSize: "18px" }}>
                  <span>Total Amount:</span>
                  <span>{formatMoney(invoice.grandTotal, invoice.currency)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                className="btn"
                onClick={() => window.print()}
                style={{ padding: "0 20px", minHeight: "44px", fontSize: "16px" }}
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                className="btn ink"
                onClick={() => setShowInvoiceModal(false)}
                style={{ padding: "0 20px", minHeight: "44px", fontSize: "16px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

