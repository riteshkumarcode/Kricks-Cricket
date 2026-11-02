"use client";

import React, { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ActivityLogEntry, getActivityLogs } from "@/lib/cms-store";
import { History, Search, Download } from "lucide-react";

export default function AdminActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([
    {
      id: "log-1",
      timestamp: new Date().toISOString(),
      user: "admin@kricks.com",
      action: "UPDATE_STATUS",
      details: "Order KC-10492 status updated to SHIPPED (AWB: BD-89104820)",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      user: "admin@kricks.com",
      action: "UPDATE_PRODUCT",
      details: "Updated price for Pro Edition English Willow",
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      user: "admin@kricks.com",
      action: "PUBLISH_HERO",
      details: "Hero slide published to storefront",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleExportCsv = () => {
    const headers = "Timestamp,User,Action,Details\n";
    const rows = logs
      .map((l) => `"${l.timestamp}","${l.user}","${l.action}","${l.details}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kricks-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filtered = logs.filter(
    (l) =>
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<ActivityLogEntry>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (row) => (
        <span className="text-xs text-ink-muted font-mono">
          {new Date(row.timestamp).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "user",
      header: "Operator",
      render: (row) => (
        <span className="font-mono text-xs text-ink font-medium">{row.user}</span>
      ),
    },
    {
      key: "action",
      header: "Event",
      render: (row) => (
        <span className="font-mono text-xs uppercase text-accent bg-accent/10 px-2 py-0.5 border border-accent/20">
          {row.action}
        </span>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (row) => <span className="text-sm text-ink">{row.details}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Audit Trail & Security"
        title="Activity Log"
        description="Immutable record of administrative operations, catalog changes, order transitions, and staff logins."
      >
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 bg-white border border-[#E6E3DE] text-ink px-4 py-2.5 font-display text-sm uppercase tracking-wider hover:border-black transition-colors"
        >
          <Download className="w-4 h-4 text-ink-muted" />
          <span>Export Audit Log</span>
        </button>
      </AdminPageHeader>

      <div className="bg-white border border-[#E6E3DE] p-4 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F4F3F0] border border-transparent focus:border-black text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(l) => l.id}
          emptyMessage="No audit logs recorded."
        />
      </div>
    </div>
  );
}

