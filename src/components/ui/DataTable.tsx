"use client";

import React from "react";
import { clsx } from "clsx";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No records found.",
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-[#E6E3DE] p-8 text-center text-ink-muted">
        <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2" />
        <p className="font-display text-xl tracking-wider uppercase">Loading records...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-[#F4F3F0] p-12 text-center border border-[#E6E3DE]">
        <p className="text-xl text-ink-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop & Tablet Table (Hidden on mobile <768px) */}
      <div className="hidden md:block overflow-x-auto border border-[#E6E3DE] bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E6E3DE] bg-[#F4F3F0]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    "px-4 py-3.5 font-display text-lg tracking-wider text-ink font-normal uppercase",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E3DE]">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  "hover:bg-[#F4F3F0]/60 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={clsx("px-4 py-4 text-base", col.className)}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card List (<768px) */}
      <div className="grid md:hidden gap-3">
        {data.map((row) => (
          <div
            key={keyExtractor(row)}
            onClick={() => onRowClick?.(row)}
            className={clsx(
              "bg-white border border-[#E6E3DE] p-4 flex flex-col gap-2.5 shadow-sm",
              onRowClick && "cursor-pointer active:bg-[#F4F3F0]"
            )}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-baseline gap-2">
                <span className="text-xs uppercase font-display tracking-wider text-ink-muted">
                  {col.header}
                </span>
                <span className="text-sm font-medium text-right">
                  {col.render ? col.render(row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

