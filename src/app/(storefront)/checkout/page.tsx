"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, CartLineItem } from "@/context/StoreContext";
import { generateBatSvg } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import { getProductById } from "@/lib/catalog";
import {
  getAvailableShippingMethods,
  isCodEligible,
  DOMESTIC_FREE_SHIPPING_THRESHOLD,
  ShippingMethod,
} from "@/lib/shipping";
import { validateCoupon, CouponResult } from "@/lib/coupons";

const COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "US", name: "United States" },
  { code: "ZA", name: "South Africa" },
  { code: "NZ", name: "New Zealand" },
  { code: "CA", name: "Canada" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, currency, formatPrice, clearCart } = useStore();

  // Contact info
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  // Address
  const [country, setCountry] = useState("IN");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [gstin, setGstin] = useState("");

  // Shipping & Coupons
  const [shippingMethodId, setShippingMethodId] = useState("standard");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState("");

  // Payment
  const [paymentGateway, setPaymentGateway] = useState<"RAZORPAY" | "STRIPE" | "COD">("RAZORPAY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTestPaymentModal, setShowTestPaymentModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingOrderNumber, setPendingOrderNumber] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Available shipping options
  const shippingMethods = getAvailableShippingMethods({
    country,
    postalCode,
    subtotal,
    currency,
  });

  const selectedShipping =
    shippingMethods.find((m) => m.id === shippingMethodId) || shippingMethods[0];

  let shippingCost = selectedShipping ? selectedShipping.cost : 0;
  if (appliedCoupon && appliedCoupon.discountType === "free_shipping") {
    shippingCost = 0;
  }

  // COD fee check
  const codAllowed = isCodEligible(country, postalCode, subtotal);
  const codFee = paymentGateway === "COD" ? 9900 : 0;
  if (paymentGateway === "COD" && currency === "INR") {
    shippingCost += codFee;
  }

  const discountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  // Auto-switch payment gateway when currency changes
  React.useEffect(() => {
    if (currency === "INR") {
      if (paymentGateway === "STRIPE") setPaymentGateway("RAZORPAY");
    } else {
      setPaymentGateway("STRIPE");
    }
  }, [currency, paymentGateway]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;

    const res = validateCoupon(couponInput, subtotal);
    if (res.valid) {
      setAppliedCoupon(res);
      setCouponError("");
    } else {
      setCouponError(res.description);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage("Please complete all contact details.");
      return;
    }

    if (!street.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setErrorMessage("Please complete your delivery address.");
      return;
    }

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone },
          shippingAddress: {
            fullName: name,
            street,
            city,
            state,
            postalCode,
            country,
          },
          currency,
          shippingMethodId,
          couponCode: appliedCoupon?.code || null,
          gstin: gstin.trim() || null,
          paymentGateway,
          items: cart,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order creation failed");
      }

      const createdOrder = data.order;

      if (paymentGateway === "COD") {
        clearCart();
        router.push(`/order-success/${createdOrder.orderNumber}`);
      } else {
        // Open Test Payment Simulator Modal
        setPendingOrderId(createdOrder.id);
        setPendingOrderNumber(createdOrder.orderNumber);
        setShowTestPaymentModal(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
      setIsSubmitting(false);
    }
  };

  const handleConfirmTestPayment = async () => {
    if (!pendingOrderId || !pendingOrderNumber) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: pendingOrderId,
          paymentId: `pay_${Date.now()}_test`,
          signature: `sig_${Date.now()}_test`,
          gateway: paymentGateway,
        }),
      });

      if (res.ok) {
        clearCart();
        router.push(`/order-success/${pendingOrderNumber}`);
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
      setIsSubmitting(false);
    }
  };

  const renderThumbnail = (line: CartLineItem) => {
    if (line.bat) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: generateBatSvg({
              blade: line.bat.blade,
              grip: line.bat.grip,
              sticker: line.bat.sticker,
              grains: line.bat.grains,
              name: line.bat.name,
              num: line.bat.num,
              label: line.name,
            }),
          }}
        />
      );
    }

    const p = getProductById(line.id);
    const isAcc = line.drawingType || p?.cat === "acc";

    if (isAcc) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: generateItemSvg(
              line.drawingType || p?.drawingType || "gloves",
              line.color1 || p?.color1 || "#F3EEE3",
              line.color2 || p?.color2 || "#C3262C"
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
            label: line.name,
          }),
        }}
      />
    );
  };

  if (cart.length === 0 && !pendingOrderNumber) {
    return (
      <section className="frame ct" style={{ minHeight: "50vh", paddingBlock: "80px" }}>
        <div>
          <h1>Checkout</h1>
          <p className="mt-4 text-xl">Your cart is empty. Pick a bat before checkout.</p>
          <div className="mt-8 flex gap-4">
            <Link className="btn" href="/leather-bats">
              Shop bats <span className="ar">→</span>
            </Link>
            <Link className="btn ink" href="/">
              Return home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="frame ct checkout-layout" id="checkout-view" style={{ paddingBlock: "48px 96px" }}>
        {/* Left Column: Form Stepper */}
        <div>
          <h1 style={{ fontSize: "clamp(54px, 6vw, 88px)", lineHeight: 0.85, marginBottom: "36px" }}>
            Checkout<span style={{ color: "var(--accent)" }}>.</span>
          </h1>

          <form className="f" id="checkout-form" onSubmit={handlePlaceOrder}>
            {/* Step 1: Customer Contact */}
            <div className="chk-step" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "32px" }}>
              <h2 style={{ fontSize: "28px", marginBottom: "18px", display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span style={{ color: "var(--accent)" }}>01.</span> Contact Details
              </h2>
              <div className="field">
                <label htmlFor="c-name">Full name</label>
                <input
                  id="c-name"
                  required
                  placeholder="Virat Kohli"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="two" style={{ marginTop: "16px" }}>
                <div className="field">
                  <label htmlFor="c-email">Email address</label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    placeholder="virat@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-phone">Phone number</label>
                  <input
                    id="c-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="chk-step" style={{ borderBottom: "1px solid var(--line)", paddingBlock: "32px" }}>
              <h2 style={{ fontSize: "28px", marginBottom: "18px", display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span style={{ color: "var(--accent)" }}>02.</span> Delivery Address
              </h2>

              <div className="field">
                <label htmlFor="c-country">Country / Region</label>
                <select
                  id="c-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ marginTop: "16px" }}>
                <label htmlFor="c-street">Street address, house number &amp; apartment</label>
                <input
                  id="c-street"
                  required
                  placeholder="42 Willow Lane, Suite 3B"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              <div className="two" style={{ marginTop: "16px" }}>
                <div className="field">
                  <label htmlFor="c-city">City / Town</label>
                  <input
                    id="c-city"
                    required
                    placeholder="New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-state">State / Province</label>
                  <input
                    id="c-state"
                    required
                    placeholder="Delhi"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
              </div>

              <div className="two" style={{ marginTop: "16px" }}>
                <div className="field">
                  <label htmlFor="c-pin">
                    {country === "IN" ? "PIN code (6 digits)" : "Postal code"}
                  </label>
                  <input
                    id="c-pin"
                    required
                    placeholder={country === "IN" ? "110020" : "SW1A 1AA"}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                {country === "IN" && (
                  <div className="field">
                    <label htmlFor="c-gstin">GSTIN (Optional, for business tax invoice)</label>
                    <input
                      id="c-gstin"
                      placeholder="07AABCK9876Q1Z9"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Shipping Method Selection */}
            <div className="chk-step" style={{ borderBottom: "1px solid var(--line)", paddingBlock: "32px" }}>
              <h2 style={{ fontSize: "28px", marginBottom: "18px", display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span style={{ color: "var(--accent)" }}>03.</span> Shipping Method
              </h2>

              <div style={{ display: "grid", gap: "12px" }}>
                {shippingMethods.map((m) => (
                  <label
                    key={m.id}
                    className="shipping-opt"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 18px",
                      background: shippingMethodId === m.id ? "#ECEAE5" : "var(--surface)",
                      border: shippingMethodId === m.id ? "2px solid var(--ink)" : "1.5px solid #DFDCD6",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={m.id}
                        checked={shippingMethodId === m.id}
                        onChange={() => setShippingMethodId(m.id)}
                        style={{ accentColor: "var(--accent)", width: "18px", height: "18px" }}
                      />
                      <div>
                        <b style={{ display: "block", fontSize: "17px", color: "var(--ink)" }}>{m.name}</b>
                        <span style={{ fontSize: "14px", color: "var(--muted)" }}>{m.description}</span>
                      </div>
                    </div>
                    <span className="price" style={{ fontWeight: 600, fontSize: "17px", color: m.cost === 0 ? "var(--accent)" : "var(--ink)" }}>
                      {m.cost === 0 ? "Free" : formatPrice(m.cost)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 4: Payment Gateway Choice */}
            <div className="chk-step" style={{ borderBottom: "1px solid var(--line)", paddingBlock: "32px" }}>
              <h2 style={{ fontSize: "28px", marginBottom: "18px", display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span style={{ color: "var(--accent)" }}>04.</span> Payment Method
              </h2>

              <div style={{ display: "grid", gap: "12px" }}>
                {currency === "INR" ? (
                  <>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px 18px",
                        background: paymentGateway === "RAZORPAY" ? "#ECEAE5" : "var(--surface)",
                        border: paymentGateway === "RAZORPAY" ? "2px solid var(--ink)" : "1.5px solid #DFDCD6",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="RAZORPAY"
                        checked={paymentGateway === "RAZORPAY"}
                        onChange={() => setPaymentGateway("RAZORPAY")}
                        style={{ accentColor: "var(--accent)", width: "18px", height: "18px" }}
                      />
                      <div>
                        <b style={{ display: "block", fontSize: "17px", color: "var(--ink)" }}>Razorpay (UPI, Cards, Netbanking)</b>
                        <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                          Pay instantly via Google Pay, PhonePe, Paytm, UPI QR, or Debit/Credit Cards.
                        </span>
                      </div>
                    </label>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px 18px",
                        background: paymentGateway === "COD" ? "#ECEAE5" : "var(--surface)",
                        border: paymentGateway === "COD" ? "2px solid var(--ink)" : "1.5px solid #DFDCD6",
                        cursor: codAllowed ? "pointer" : "not-allowed",
                        opacity: codAllowed ? 1 : 0.6,
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        disabled={!codAllowed}
                        checked={paymentGateway === "COD"}
                        onChange={() => setPaymentGateway("COD")}
                        style={{ accentColor: "var(--accent)", width: "18px", height: "18px" }}
                      />
                      <div>
                        <b style={{ display: "block", fontSize: "17px", color: "var(--ink)" }}>
                          Cash on Delivery (COD) {codAllowed && <small style={{ color: "var(--accent)" }}>+₹99 handling</small>}
                        </b>
                        <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                          {codAllowed
                            ? "Pay cash or UPI upon delivery at your doorstep."
                            : "Available for eligible India PIN codes under ₹50,000."}
                        </span>
                      </div>
                    </label>
                  </>
                ) : (
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px 18px",
                      background: paymentGateway === "STRIPE" ? "#ECEAE5" : "var(--surface)",
                      border: paymentGateway === "STRIPE" ? "2px solid var(--ink)" : "1.5px solid #DFDCD6",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="STRIPE"
                      checked={paymentGateway === "STRIPE"}
                      onChange={() => setPaymentGateway("STRIPE")}
                      style={{ accentColor: "var(--accent)", width: "18px", height: "18px" }}
                    />
                    <div>
                      <b style={{ display: "block", fontSize: "17px", color: "var(--ink)" }}>Credit / Debit Card (Stripe)</b>
                      <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                        Visa, Mastercard, American Express, Apple Pay &amp; Google Pay.
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {errorMessage && (
              <p style={{ color: "#B3261E", fontSize: "16px", marginTop: "16px" }} role="alert">
                {errorMessage}
              </p>
            )}

            <div style={{ marginTop: "32px" }}>
              <button
                type="submit"
                id="place-order-btn"
                className="btn"
                disabled={isSubmitting}
                style={{ width: "100%", minHeight: "56px", fontSize: "24px" }}
              >
                {isSubmitting ? "Securing order…" : `Pay ${formatPrice(grandTotal)}`} <span className="ar">→</span>
              </button>
              <p style={{ textAlign: "center", fontSize: "14px", color: "var(--muted)", marginTop: "12px" }}>
                🔒 256-bit encrypted checkout · Full transit insurance included
              </p>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <aside className="sum" id="sum" aria-labelledby="chkSummary">
          <h2 id="chkSummary">Order Summary ({cart.length})</h2>

          {/* Line items thumbnail list */}
          <div style={{ display: "grid", gap: "16px", marginBlock: "12px", maxHeight: "360px", overflowY: "auto" }}>
            {cart.map((line, idx) => {
              const p = getProductById(line.id);
              const isAcc = Boolean(line.drawingType || p?.cat === "acc");
              return (
                <div key={`${line.id}-${idx}`} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div className={`chk-th ${isAcc ? "acc" : ""}`}>
                    {renderThumbnail(line)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ display: "block", fontSize: "17px", color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {line.name}
                    </b>
                    {line.opts && (
                      <span style={{ fontSize: "13px", color: "#BDBAB4", display: "block", lineHeight: 1.35 }}>
                        {line.opts}
                      </span>
                    )}
                    <span style={{ fontSize: "13px", color: "#9C9993" }}>Qty: {line.qty}</span>
                  </div>
                  <span className="price" style={{ fontSize: "17px", fontWeight: 500, color: "#FFFFFF" }}>
                    {formatPrice(line.price * line.qty)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} style={{ marginBlock: "8px", borderTop: "1px solid #2C2C2C", paddingTop: "18px" }}>
            <label htmlFor="chk-coupon" className="sr">
              Promo code
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                id="chk-coupon"
                placeholder="Promo code (e.g. WELCOME10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: "#1C1C1C",
                  border: "1.5px solid #3A3A3A",
                  color: "#FFFFFF",
                  padding: "10px 14px",
                  fontSize: "15px",
                }}
              />
              <button
                type="submit"
                className="btn"
                style={{
                  width: "auto",
                  flex: "none",
                  padding: "0 22px",
                  minHeight: "46px",
                  fontSize: "19px",
                }}
              >
                Apply
              </button>
            </div>
            {couponError && <p style={{ color: "#FF6B5B", fontSize: "14px", marginTop: "6px" }}>{couponError}</p>}
            {appliedCoupon && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", background: "#1C2E1E", border: "1px solid #2E7D32", padding: "8px 12px", fontSize: "14px", color: "#81C784" }}>
                <span>✓ {appliedCoupon.code} applied ({appliedCoupon.description})</span>
                <button type="button" onClick={handleRemoveCoupon} style={{ background: "none", border: 0, color: "#FFFFFF", cursor: "pointer", fontWeight: "bold" }}>
                  ✕
                </button>
              </div>
            )}
          </form>

          {/* Pricing Totals */}
          <dl style={{ borderTop: "1px solid #2C2C2C", paddingTop: "16px" }}>
            <div>
              <dt>Items subtotal</dt>
              <dd className="price" style={{ color: "#FFFFFF" }}>{formatPrice(subtotal)}</dd>
            </div>
            {discountAmount > 0 && (
              <div>
                <dt style={{ color: "var(--accent)" }}>Discount ({appliedCoupon?.code})</dt>
                <dd className="price" style={{ color: "var(--accent)" }}>
                  -{formatPrice(discountAmount)}
                </dd>
              </div>
            )}
            <div>
              <dt>Shipping</dt>
              <dd className="price" style={{ color: shippingCost === 0 ? "var(--accent)" : "#FFFFFF" }}>
                {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
              </dd>
            </div>
            {paymentGateway === "COD" && (
              <div>
                <dt>COD convenience fee</dt>
                <dd className="price" style={{ color: "#FFFFFF" }}>{formatPrice(codFee)}</dd>
              </div>
            )}
            <div className="tot" style={{ borderTop: "1.5px solid #3A3A3A", marginTop: "14px", paddingTop: "16px", alignItems: "baseline" }}>
              <dt style={{ color: "#FFFFFF" }}>Total to pay</dt>
              <dd className="price" id="checkout-total" style={{ color: "var(--accent)" }}>{formatPrice(grandTotal)}</dd>
            </div>
          </dl>

          <p style={{ fontSize: "13px", color: "#9C9993", marginTop: "12px", lineHeight: 1.5 }}>
            Orders dispatched from New Delhi workshop within 3 working days. Custom engraved bats take 10–14 days.
          </p>
        </aside>
      </section>

      {/* Test Mode Payment Simulator Modal */}
      {showTestPaymentModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              maxWidth: "480px",
              width: "100%",
              padding: "32px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontFamily: "var(--display)", fontSize: "28px" }}>
                {paymentGateway === "RAZORPAY" ? "RAZORPAY TEST GATEWAY" : "STRIPE TEST CHECKOUT"}
              </span>
              <span style={{ background: "#C8501A", color: "#FFFFFF", padding: "4px 8px", fontSize: "12px", fontWeight: "bold" }}>
                TEST MODE
              </span>
            </div>

            <p style={{ fontSize: "16px", color: "var(--muted)", marginBottom: "20px" }}>
              Order <b style={{ color: "#111111" }}>{pendingOrderNumber}</b> is ready for test authorization.
              Amount: <b style={{ color: "#111111" }}>{formatPrice(grandTotal)}</b>.
            </p>

            <div style={{ background: "var(--surface)", padding: "16px", marginBottom: "24px", fontSize: "14px" }}>
              <div><b>Test Customer:</b> {name}</div>
              <div><b>Method:</b> {paymentGateway === "RAZORPAY" ? "UPI / Netbanking Mock" : "Visa Test (•••• 4242)"}</div>
              <div style={{ color: "#2E7D32", marginTop: "6px" }}>✓ Signature validation ready</div>
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              <button
                type="button"
                id="confirm-test-pay-btn"
                className="btn"
                onClick={handleConfirmTestPayment}
                disabled={isSubmitting}
                style={{ width: "100%" }}
              >
                {isSubmitting ? "Authorizing…" : "Authorize Test Payment"} <span className="ar">→</span>
              </button>
              <button
                type="button"
                className="btn ink"
                onClick={() => setShowTestPaymentModal(false)}
                style={{ width: "100%" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

