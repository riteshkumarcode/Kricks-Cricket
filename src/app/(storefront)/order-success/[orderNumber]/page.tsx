import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByIdOrNumber } from "@/lib/orders";
import { generateInvoiceData } from "@/lib/invoice";
import { OrderSuccessClient } from "./OrderSuccessClient";

export async function generateMetadata({
  params,
}: {
  params: { orderNumber: string };
}) {
  return {
    title: `Order ${params.orderNumber} Confirmed · Krickscricket`,
    description: "Your cricket bat order has been confirmed and is being prepared in our workshop.",
  };
}

export default async function OrderSuccessPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await getOrderByIdOrNumber(params.orderNumber);

  if (!order) {
    notFound();
  }

  const invoiceData = generateInvoiceData(order);

  return <OrderSuccessClient order={order} invoice={invoiceData} />;
}

