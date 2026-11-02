"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { clsx } from "clsx";

interface ToastMessage {
  id: string;
  message: string;
  actionText?: string;
  actionHref?: string;
}

interface ToastContextType {
  showToast: (message: string, actionText?: string, actionHref?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, actionText?: string, actionHref?: string) => {
    const id = Math.random().toString(36).substring(7);
    setToast({ id, message, actionText, actionHref });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3400);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        role="status"
        className={clsx(
          "toast",
          toast && "show"
        )}
      >
        {toast && (
          <>
            <span>{toast.message}</span>
            {toast.actionText && toast.actionHref && (
              <Link href={toast.actionHref}>{toast.actionText}</Link>
            )}
          </>
        )}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

