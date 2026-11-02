import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductById, PRODUCTS } from "@/lib/catalog";
import { ProductDetailClient } from "./ProductDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductById(params.slug);
  if (!product) {
    return {
      title: "Product Not Found · Krickscricket",
    };
  }

  return {
    title: `${product.name} · Krickscricket`,
    description: product.blurb,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductById(params.slug);
  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
