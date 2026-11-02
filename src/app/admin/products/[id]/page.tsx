import React from "react";
import { notFound } from "next/navigation";
import { getStoredProductById } from "@/lib/cms-store";
import { ProductForm } from "@/components/admin/ProductForm";

interface ProductEditPageProps {
  params: { id: string };
}

export default function ProductEditPage({ params }: ProductEditPageProps) {
  const product = getStoredProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductForm initialProduct={product} isNew={false} />;
}

