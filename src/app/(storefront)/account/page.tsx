"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OrderRecord } from "@/lib/orders";
import { formatMoney } from "@/lib/tokens";

export default function CustomerAccountPage() {
  const [email, setEmail] = useState("virat@example.com");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if any orders exist in local storage or fetch from API
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/account/orders?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchOrders();
  }, [email]);

  return (
    <section className="frame" id="account-view" style={{ paddingBlock: "64px 96px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "clamp(36px, 4vw, 54px)", textTransform: "uppercase" }}>
          My Account<span>.</span>
        </h1>
        <p style={{ fontSize: "19px", color: "var(--muted)", marginTop: "8px" }}>
          Track orders, workshop progress and view tax invoices.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
        {/* Profile Card */}
        <div style={{ background: "var(--surface)", padding: "32px", alignSelf: "start" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "20px", textTransform: "uppercase" }}>
            Customer Profile
          </h2>
          <div style={{ display: "grid", gap: "12px", fontSize: "16px" }}>
            <div>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "13px" }}>Account Email</span>
              <b>{email}</b>
            </div>
            <div>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "13px" }}>Membership</span>
              <span>Kricks Squad Member</span>
            </div>
            <div>
              <span style={{ color: "var(--muted)", display: "block", fontSize: "13px" }}>Default Currency</span>
              <span>INR (₹)</span>
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div style={{ gridColumn: "span 2" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textTransform: "uppercase" }}>
            Recent Orders ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div style={{ background: "var(--surface)", padding: "40px", textAlign: "center" }}>
              <p style={{ fontSize: "18px", color: "var(--muted)", marginBottom: "20px" }}>
                No past orders found under {email}.
              </p>
              <Link href="/leather-bats" className="btn">
                Shop Leather Bats <span className="ar">→</span>
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {orders.map((o) => (
                <div
                  key={o.id}
                  style={{
                    background: "var(--surface)",
                    padding: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                      <b style={{ fontSize: "18px" }}>#{o.orderNumber}</b>
                      <span
                        style={{
                          background: o.paymentStatus === "PAID" ? "#E8F5E9" : "#FFF3E0",
                          color: o.paymentStatus === "PAID" ? "#2E7D32" : "#E65100",
                          padding: "2px 8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {o.status.replace("_", " ")}
                      </span>
                    </div>
                    <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                      Placed on {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} {o.items.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <span className="price" style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {formatMoney(o.grandTotal, o.currency)}
                    </span>
                    <Link
                      href={`/order-success/${o.orderNumber}`}
                      className="btn ink"
                      style={{ minHeight: "40px", fontSize: "15px", padding: "0 16px" }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

