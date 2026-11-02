"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, MessageSquare, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";

export interface AdminBottomTabsProps {
  onOpenMore: () => void;
}

export const AdminBottomTabs: React.FC<AdminBottomTabsProps> = ({ onOpenMore }) => {
  const pathname = usePathname();

  const tabs = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Enquiries", href: "/admin/bulk-enquiries", icon: MessageSquare },
  ];

  return (
    <nav
      aria-label="Mobile admin bottom tabs"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#111111] text-white border-t border-[#2C2C2C] flex md:hidden h-16 items-stretch justify-around px-2"
    >
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 gap-1 font-sans text-xs transition-colors",
              isActive ? "text-accent font-medium" : "text-[#8C8984] hover:text-white"
            )}
          >
            <Icon size={20} />
            <span className="truncate">{tab.label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={onOpenMore}
        className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 gap-1 font-sans text-xs text-[#8C8984] hover:text-white transition-colors"
      >
        <MoreHorizontal size={20} />
        <span>More</span>
      </button>
    </nav>
  );
};

