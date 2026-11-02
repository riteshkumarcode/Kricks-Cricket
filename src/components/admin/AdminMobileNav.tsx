"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_GROUPS } from "./AdminSidebar";
import { X, ExternalLink } from "lucide-react";
import { clsx } from "clsx";

export interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMobileNav: React.FC<AdminMobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#111111] text-white overflow-y-auto flex flex-col p-6 animate-fade-in"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#2C2C2C] mb-6">
        <Link href="/admin" onClick={onClose} className="font-display text-4xl tracking-wider">
          KRICKS <span className="text-sm text-accent">ADMIN</span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close admin menu"
          className="w-12 h-12 bg-white text-[#111111] flex items-center justify-center font-bold text-xl rounded-none active:bg-accent active:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 space-y-8 pb-12">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-3">
            <h3 className="font-display text-xl tracking-wider text-accent uppercase">
              {group.group}
            </h3>
            <ul className="grid grid-cols-1 gap-1">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={clsx(
                        "flex items-center gap-3.5 px-4 py-3 min-h-[48px] text-lg font-sans transition-colors rounded-none",
                        isActive
                          ? "bg-accent text-white font-medium"
                          : "text-[#E6E3DE] hover:bg-[#1C1C1C]"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Storefront Link */}
      <div className="pt-4 border-t border-[#2C2C2C]">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="btn ink w-full justify-between min-h-[52px]"
        >
          <span>View Public Storefront</span>
          <ExternalLink size={20} />
        </Link>
      </div>
    </div>
  );
};

