"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { OrderRecord } from "@/lib/orders";
import { formatMoney } from "@/lib/tokens";
import { generateBatSvg } from "@/lib/svg-bat";
import {
  ArrowLeft,
  Truck,
  CheckCircle,
  FileText,
  Save,
  Package,
  Wrench,
  Clock,
  User,
  MapPin,
  CreditCard,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("PENDING");
  const [carrier, setCarrier] = useState<string>("Blue Dart");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/admin/orders`)
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && Array.isArray(data.orders)) {
          const found = data.orders.find(
            (o: OrderRecord) => o.id === orderId || o.orderNumber === orderId
          );
          if (found) {
            setOrder(found);
            setStatus(found.status);
            setCarrier(found.trackingCarrier || "Blue Dart");
            setTrackingNumber(found.trackingNumber || "");
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          status,
          tracking: {
            carrier,
            number: trackingNumber,
            url: trackingNumber
              ? `https://track.bluedart.com/?trackno=${trackingNumber}`
              : undefined,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        setToastMsg(`Order updated: Status is now ${status}`);
        setTimeout(() => setToastMsg(null), 3000);
      } else {
        alert(data.error || "Failed to update order");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-ink-muted">
        <p className="font-display text-2xl uppercase tracking-wider">
          Loading Order Details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="font-display text-2xl uppercase tracking-wider text-ink">
          Order Not Found
        </p>
        <Link
          href="/admin/orders"
          className="inline-block bg-accent text-white px-5 py-2 font-display uppercase tracking-wider"
        >
          Return to Orders List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMsg}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="Order Inspection"
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${new Date(order.createdAt).toLocaleString("en-IN")}`}
      >
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Orders</span>
        </Link>

        <a
          href={`/order-success/${order.orderNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <FileText className="w-4 h-4 text-accent" />
          <span>Tax Invoice & Receipt</span>
        </a>

        <button
          onClick={handleUpdateStatus}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Update Order"}</span>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items and Custom Bat Configurations (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Fulfillment Management Card */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2 flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" />
              <span>Fulfillment & Shipment Status</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-display text-base uppercase tracking-wider focus:border-black outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="IN_PRODUCTION">IN PRODUCTION</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Courier Carrier
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-medium text-sm focus:border-black outline-none"
                >
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="Delhivery">Delhivery</option>
                  <option value="Shiprocket">Shiprocket</option>
                  <option value="DHL Express">DHL Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                  Tracking Number (AWB)
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD-89104820"
                  className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] font-mono text-xs focus:border-black outline-none"
                />
              </div>
            </div>
          </div>

          {/* Line Items & Custom Bat Specifications */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
              Purchased Items ({order.items.length})
            </h3>

            <div className="divide-y divide-[#E6E3DE]">
              {order.items.map((item, idx) => {
                const config = item.configuration as any;
                const isCustom = item.isCustom || !!config;

                return (
                  <div key={idx} className="py-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-lg uppercase tracking-wider text-ink">
                            {item.name}
                          </h4>
                          {isCustom && (
                            <span className="bg-accent text-white text-[10px] font-display uppercase tracking-widest px-2 py-0.5">
                              Custom Bat Spec
                            </span>
                          )}
                        </div>
                        {item.optionsText && (
                          <p className="text-xs text-ink-muted">{item.optionsText}</p>
                        )}
                        <span className="text-xs text-ink-muted font-mono">
                          Qty: {item.quantity} · Unit Price:{" "}
                          {formatMoney(item.unitPrice, order.currency)}
                        </span>
                      </div>

                      <span className="font-display text-xl tracking-wider text-ink">
                        {formatMoney(item.lineTotal, order.currency)}
                      </span>
                    </div>

                    {/* Detailed custom bat configuration card */}
                    {isCustom && config && (
                      <div className="bg-[#F4F3F0] border border-[#E6E3DE] p-4 space-y-3">
                        <div className="flex items-center gap-2 border-b border-[#E6E3DE] pb-2">
                          <Wrench className="w-4 h-4 text-accent" />
                          <span className="font-display text-sm uppercase tracking-wider text-ink">
                            Workshop Build Sheet:
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-ink-muted block uppercase text-[10px] font-display">
                              Willow Cleft:
                            </span>
                            <span className="font-medium text-ink">
                              {config.willow || "Grade 1 Pro English Willow"}
                            </span>
                          </div>

                          <div>
                            <span className="text-ink-muted block uppercase text-[10px] font-display">
                              Grip Color:
                            </span>
                            <span className="font-medium text-ink">
                              {config.gripColor || "Signature Red"}
                            </span>
                          </div>

                          <div>
                            <span className="text-ink-muted block uppercase text-[10px] font-display">
                              Sticker Decal:
                            </span>
                            <span className="font-medium text-ink">
                              {config.stickerColor || "Black & Cream"}
                            </span>
                          </div>

                          <div>
                            <span className="text-ink-muted block uppercase text-[10px] font-display">
                              Knocking-in:
                            </span>
                            <span className="font-medium text-ink">
                              {config.knockingIn ? "Yes (Machine & Bone)" : "No"}
                            </span>
                          </div>
                        </div>

                        {(config.engravedName || config.engravedNumber) && (
                          <div className="pt-2 border-t border-[#E6E3DE] flex items-center gap-6">
                            {config.engravedName && (
                              <div>
                                <span className="text-ink-muted block uppercase text-[10px] font-display">
                                  Laser Engraved Name:
                                </span>
                                <span className="font-display text-base uppercase text-accent tracking-widest">
                                  {config.engravedName}
                                </span>
                              </div>
                            )}

                            {config.engravedNumber && (
                              <div>
                                <span className="text-ink-muted block uppercase text-[10px] font-display">
                                  Jersey Number:
                                </span>
                                <span className="font-display text-base uppercase text-accent tracking-widest">
                                  #{config.engravedNumber}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Payment summary */}
        <div className="space-y-6">
          {/* Customer Details Card */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              <span>Customer Details</span>
            </h3>

            <div className="space-y-2 text-sm">
              <p className="font-medium text-ink text-base">{order.customerName}</p>
              <p className="text-ink-muted font-mono text-xs">{order.customerEmail}</p>
              <p className="text-ink-muted font-mono text-xs">{order.customerPhone}</p>
            </div>

            <div className="pt-3 border-t border-[#E6E3DE] space-y-1 text-xs">
              <span className="text-ink-muted uppercase font-display tracking-widest block">
                Shipping Destination:
              </span>
              <p className="font-medium text-ink">{order.shippingAddress.fullName}</p>
              <p className="text-ink-muted">{order.shippingAddress.street}</p>
              <p className="text-ink-muted">
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-ink-muted font-medium">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment & Financial Breakdown Card */}
          <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <span>Financial Summary</span>
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Payment Gateway</span>
                <span className="font-medium text-ink">{order.paymentGateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Payment Status</span>
                <span className="font-display text-xs uppercase px-2 py-0.5 bg-green-50 text-green-700 border border-green-200">
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentReference && (
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-ink-muted">Reference ID</span>
                  <span className="text-ink truncate max-w-[150px]">
                    {order.paymentReference}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E6E3DE] space-y-2 text-sm">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal, order.currency)}</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Discount</span>
                  <span>-{formatMoney(order.discountTotal, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-muted">
                <span>Shipping</span>
                <span>
                  {order.shippingTotal === 0
                    ? "FREE"
                    : formatMoney(order.shippingTotal, order.currency)}
                </span>
              </div>
              <div className="flex justify-between font-display text-2xl text-ink pt-2 border-t border-[#E6E3DE]">
                <span>Total</span>
                <span>{formatMoney(order.grandTotal, order.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

