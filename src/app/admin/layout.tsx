import React from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Console · Krickscricket",
  description: "Manage products, orders, inventory, and storefront content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}

