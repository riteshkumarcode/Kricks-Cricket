"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminMobileNav } from "./AdminMobileNav";
import { AdminBottomTabs } from "./AdminBottomTabs";
import { clsx } from "clsx";

export interface AdminShellProps {
  children: React.ReactNode;
  user?: { name?: string | null; email?: string | null };
}

export const AdminShell: React.FC<AdminShellProps> = ({ children, user }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F3F0] text-ink antialiased">
      {/* Desktop & Tablet Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Top Header */}
      <AdminTopbar
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        user={user}
      />

      {/* Mobile Fullscreen Nav Overlay */}
      <AdminMobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Workspace */}
      <main
        className={clsx(
          "pt-[72px] pb-24 md:pb-12 transition-all duration-300 min-h-screen",
          isSidebarCollapsed ? "md:pl-20" : "md:pl-64",
          "pl-0"
        )}
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Bottom Tabs (<768px) */}
      <AdminBottomTabs onOpenMore={() => setIsMobileNavOpen(true)} />
    </div>
  );
};

