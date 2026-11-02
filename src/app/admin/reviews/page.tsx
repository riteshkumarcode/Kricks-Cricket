"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductReview, getReviews } from "@/lib/cms-store";
import { Star, CheckCircle, XCircle, ShieldCheck } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([
    {
      id: "rev-1",
      productSlug: "pro-edition",
      productName: "Pro Edition",
      author: "Aditya Roy",
      rating: 5,
      title: "Best ping I have ever experienced",
      comment:
        "Straight 11 grains, perfectly balanced pickup. First match scored 78 not out.",
      verified: true,
      status: "approved",
      date: "2026-10-25",
    },
    {
      id: "rev-2",
      productSlug: "custom-bat",
      productName: "Custom Bat",
      author: "Prashant K.",
      rating: 5,
      title: "Laser engraving looks exquisite",
      comment:
        "My jersey number and initials look stunning down the back spine. Worth every penny.",
      verified: true,
      status: "approved",
      date: "2026-10-27",
    },
    {
      id: "rev-3",
      productSlug: "street",
      productName: "Street Tennis Bat",
      author: "Naveen S.",
      rating: 4,
      title: "Great box cricket blade",
      comment:
        "Lightweight and packs immense power for overhead tennis smashes.",
      verified: false,
      status: "pending",
      date: "2026-10-31",
    },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const setReviewStatus = (
    id: string,
    status: "approved" | "rejected"
  ) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setToastMsg(`Review marked as ${status}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const columns: Column<ProductReview>[] = [
    {
      key: "product",
      header: "Product",
      render: (row) => (
        <span className="font-display text-base uppercase tracking-wider text-ink">
          {row.productName}
        </span>
      ),
    },
    {
      key: "author",
      header: "Customer",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-ink text-sm">{row.author}</span>
          {row.verified && (
            <span
              className="text-green-700 flex items-center text-xs"
              title="Verified Buyer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < row.rating
                  ? "fill-accent text-accent"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "review",
      header: "Review Comment",
      render: (row) => (
        <div>
          <span className="font-medium text-ink text-sm block">{row.title}</span>
          <span className="text-xs text-ink-muted line-clamp-1">{row.comment}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-block px-2 py-0.5 text-xs font-display tracking-widest uppercase border ${
            row.status === "approved"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "pending"
              ? "bg-orange-50 text-accent border-accent/30 font-bold"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Moderation",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status !== "approved" && (
            <button
              onClick={() => setReviewStatus(row.id, "approved")}
              className="px-2.5 py-1 bg-green-600 text-white font-display text-xs uppercase tracking-wider hover:bg-green-700"
            >
              Approve
            </button>
          )}
          {row.status !== "rejected" && (
            <button
              onClick={() => setReviewStatus(row.id, "rejected")}
              className="px-2.5 py-1 border border-red-300 text-red-600 font-display text-xs uppercase tracking-wider hover:bg-red-50"
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMsg}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="Community & Social Proof"
        title="Product Reviews Moderation"
        description="Verify and publish customer reviews, star ratings, and workshop testimonials."
      />

      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={reviews}
          keyExtractor={(r) => r.id}
          emptyMessage="No customer reviews awaiting moderation."
        />
      </div>
    </div>
  );
}

