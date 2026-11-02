"use client";

import React, { useEffect } from "react";
import { clsx } from "clsx";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: "right" | "left";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="fixed inset-0" aria-hidden="true" onClick={onClose} />
      <div
        className={clsx(
          "fixed inset-y-0 flex max-w-full",
          position === "right" ? "right-0" : "left-0"
        )}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="w-screen max-w-md bg-white text-ink border-l border-[#E6E3DE] p-6 shadow-floating flex flex-col"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E3DE] mb-6">
            <h2 className="text-3xl font-display uppercase tracking-wide">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="w-10 h-10 flex items-center justify-center bg-[#F4F3F0] text-ink hover:bg-[#111111] hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

