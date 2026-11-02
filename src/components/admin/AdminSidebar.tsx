"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Package,
  Layers,
  Wrench,
  Sliders,
  Menu as MenuIcon,
  FileText,
  ShoppingBag,
  Users,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  Mail,
  Star,
  Tag,
  Send,
  Coins,
  Truck,
  Receipt,
  CreditCard,
  Image as ImageIcon,
  Search,
  Settings,
  AtSign,
  ShieldAlert,
  History,
  Database,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ADMIN_NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Abandoned Carts", href: "/admin/abandoned-carts", icon: ShoppingCart },
      { label: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    group: "Catalog & Design",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Layers },
      { label: "Bat Builder", href: "/admin/custom-builder", icon: Wrench },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    group: "Storefront & CMS",
    items: [
      { label: "Home Builder", href: "/admin/home-builder", icon: Sliders },
      { label: "Navigation", href: "/admin/navigation", icon: MenuIcon },
      { label: "Pages (CMS)", href: "/admin/pages", icon: FileText },
      { label: "SEO & Redirects", href: "/admin/seo", icon: Search },
    ],
  },
  {
    group: "CRM & Marketing",
    items: [
      { label: "Bulk Enquiries", href: "/admin/bulk-enquiries", icon: MessageSquare },
      { label: "Bulk Pricing", href: "/admin/bulk-pricing", icon: DollarSign },
      { label: "Contact Inbox", href: "/admin/messages", icon: Mail },
      { label: "Discounts & Coupons", href: "/admin/discounts", icon: Tag },
      { label: "Newsletter", href: "/admin/newsletter", icon: Send },
    ],
  },
  {
    group: "Settings & System",
    items: [
      { label: "Currencies", href: "/admin/currencies", icon: Coins },
      { label: "Shipping", href: "/admin/shipping", icon: Truck },
      { label: "Taxes & GST", href: "/admin/taxes", icon: Receipt },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Store Settings", href: "/admin/settings", icon: Settings },
      { label: "Email Templates", href: "/admin/email-templates", icon: AtSign },
      { label: "Staff & Roles", href: "/admin/staff", icon: ShieldAlert },
      { label: "Activity Log", href: "/admin/activity-log", icon: History },
      { label: "Backups & Data", href: "/admin/backups", icon: Database },
    ],
  },
];

export interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 bg-[#111111] text-white flex flex-col border-r border-[#222222] transition-all duration-300 hidden md:flex",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-18 flex items-center justify-between px-5 border-b border-[#222222] min-h-[72px]">
        {!isCollapsed ? (
          <Link href="/admin" className="font-display text-3xl tracking-wider flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-accent inline-block" />
            KRICKS <span className="text-xs text-accent uppercase font-sans font-medium px-1.5 py-0.5 bg-accent/20">ADMIN</span>
          </Link>
        ) : (
          <span className="w-5 h-5 rounded-full bg-accent mx-auto" />
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-[#8C8984] hover:text-white transition-colors p-1"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 font-display text-xs tracking-widest text-[#8C8984] uppercase mb-2">
                {group.group}
              </h4>
            )}
            {group.items.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-none font-sans text-sm transition-colors",
                    isActive
                      ? "bg-accent text-white font-medium shadow-sm"
                      : "text-[#E6E3DE] hover:bg-[#1C1C1C] hover:text-white"
                  )}
                >
                  <Icon className={clsx("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-[#8C8984]")} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Storefront Link */}
      <div className="p-3 border-t border-[#222222]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 text-sm text-[#8C8984] hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>View Storefront</span>}
        </Link>
      </div>
    </aside>
  );
};

