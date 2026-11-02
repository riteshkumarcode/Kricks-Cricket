"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, Bell, User as UserIcon, Menu, ExternalLink } from "lucide-react";
import { clsx } from "clsx";

export interface AdminTopbarProps {
  onOpenMobileNav: () => void;
  isSidebarCollapsed: boolean;
  user?: { name?: string | null; email?: string | null };
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  onOpenMobileNav,
  isSidebarCollapsed,
  user,
}) => {
  const [showNewMenu, setShowNewMenu] = useState(false);

  return (
    <header
      className={clsx(
        "fixed top-0 right-0 z-30 h-[72px] bg-white border-b border-[#E6E3DE] flex items-center justify-between px-4 md:px-8 transition-all duration-300",
        isSidebarCollapsed ? "md:left-20" : "md:left-64",
        "left-0"
      )}
    >
      {/* Left: Mobile trigger & Global search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="md:hidden w-11 h-11 bg-[#111111] text-white flex items-center justify-center rounded-none"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="search"
            placeholder="Search orders, products, customers... (Press /)"
            className="w-full bg-[#F4F3F0] border border-transparent pl-10 pr-4 py-2 text-sm rounded-none focus:outline-none focus:border-[#111111] transition-colors"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* + New Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="btn py-0 px-4 min-h-[42px] text-base gap-1.5 hidden sm:inline-flex"
          >
            <Plus size={16} /> New
          </button>

          {showNewMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-48 bg-[#111111] text-white p-2 shadow-floating z-50 rounded-none border border-[#333333]"
              onMouseLeave={() => setShowNewMenu(false)}
            >
              <Link
                href="/admin/products?new=1"
                className="block px-3 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => setShowNewMenu(false)}
              >
                + New Product
              </Link>
              <Link
                href="/admin/orders?new=1"
                className="block px-3 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => setShowNewMenu(false)}
              >
                + Create Order
              </Link>
              <Link
                href="/admin/discounts?new=1"
                className="block px-3 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => setShowNewMenu(false)}
              >
                + New Coupon
              </Link>
              <Link
                href="/admin/pages?new=1"
                className="block px-3 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => setShowNewMenu(false)}
              >
                + New CMS Page
              </Link>
            </div>
          )}
        </div>

        {/* View Store (Desktop) */}
        <Link
          href="/"
          target="_blank"
          title="View storefront"
          className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ExternalLink size={16} /> Store
        </Link>

        {/* Notifications Bell */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative w-10 h-10 flex items-center justify-center bg-[#F4F3F0] text-ink hover:bg-[#EAE8E3] transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E6E3DE]">
          <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center font-display text-lg">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-sm font-medium leading-none">{user?.name || "Kricks Admin"}</p>
            <p className="text-xs text-ink-muted leading-tight mt-0.5">{user?.email || "admin@kricks.com"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

