"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatMoney } from "@/lib/tokens";
import { CatalogProduct } from "@/lib/catalog";
import { generateBatSvg } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchProducts = () => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Deleted ${name}`);
        setProducts((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
      }
    } catch {
      alert("Failed to delete product");
    }
  };

  const handleExportCsv = () => {
    const headers = "ID,Name,Category,Price(Paise),Badge,Grade\n";
    const rows = products
      .map(
        (p) =>
          `"${p.id}","${p.name}","${p.cat}",${p.price},"${p.badge || ""}","${p.grade || ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kricks-products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.cat === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const columns: Column<CatalogProduct>[] = [
    {
      key: "preview",
      header: "Bat / Item",
      render: (row) => {
        const isBat = row.drawingType === "bat" || !row.drawingType;
        const svgMarkup = isBat
          ? generateBatSvg({
              blade: row.bladeColor || undefined,
              grip: row.gripColor || undefined,
              sticker: row.stickerColor || undefined,
              stickerInk: row.stickerInkColor || undefined,
              label: row.gradeLabel || undefined,
              view: "face",
            })
          : generateItemSvg(
              (row.drawingType as any) || "balls",
              row.color1 || undefined,
              row.color2 || undefined
            );

        return (
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 bg-[#F4F3F0] border border-[#E6E3DE] p-1 flex items-center justify-center flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
            <div>
              <Link
                href={`/admin/products/${row.id}`}
                className="font-display text-lg tracking-wider text-ink hover:text-accent block uppercase"
              >
                {row.name}
              </Link>
              <span className="text-xs text-ink-muted">{row.subTitle || row.slug}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "cat",
      header: "Category",
      render: (row) => (
        <span className="text-xs uppercase tracking-widest font-display text-ink-muted">
          {row.cat === "leather"
            ? "Leather Bats"
            : row.cat === "tennis"
            ? "Tennis Bats"
            : "Accessories"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => (
        <div>
          <span className="font-display text-lg tracking-wider text-ink block">
            {formatMoney(row.price, "INR")}
          </span>
          {row.was && (
            <span className="text-xs line-through text-ink-muted">
              {formatMoney(row.was, "INR")}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "badge",
      header: "Badge",
      render: (row) =>
        row.badge ? (
          <span className="inline-block px-2 py-0.5 text-xs font-display tracking-widest uppercase bg-accent text-white">
            {row.badge}
          </span>
        ) : (
          <span className="text-xs text-ink-muted">—</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/products/${row.id}`}
            className="p-2 text-ink-muted hover:text-accent transition-colors"
            title="Edit product"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-2 text-ink-muted hover:text-red-600 transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMessage}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="Catalog"
        title="Products"
        description="Manage workshop cleft models, specs, pricing, and visual drawing tokens."
      >
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <Download className="w-4 h-4 text-ink-muted" />
          <span>Export CSV</span>
        </button>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </Link>
      </AdminPageHeader>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E6E3DE] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F4F3F0] border border-transparent focus:border-black text-sm outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs uppercase font-display tracking-widest text-ink-muted">
            Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-display uppercase tracking-wider px-3 py-2 outline-none focus:border-black"
          >
            <option value="all">All Categories</option>
            <option value="leather">Leather Bats</option>
            <option value="tennis">Tennis Bats</option>
            <option value="acc">Accessories</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          isLoading={loading}
          emptyMessage="No products match your criteria."
        />
      </div>
    </div>
  );
}
