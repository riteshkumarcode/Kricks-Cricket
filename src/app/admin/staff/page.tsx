"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StaffMember, getStaffMembers } from "@/lib/cms-store";
import { Shield, ShieldAlert, Plus, CheckCircle, Lock } from "lucide-react";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: "staff-1",
      name: "Master Batmaker (Owner)",
      email: "admin@kricks.com",
      role: "Owner",
      twoFactorEnabled: true,
      status: "active",
    },
    {
      id: "staff-2",
      name: "Workshop Supervisor",
      email: "workshop@kricks.com",
      role: "Workshop Manager",
      twoFactorEnabled: false,
      status: "active",
    },
    {
      id: "staff-3",
      name: "Logistics Desk",
      email: "dispatch@kricks.com",
      role: "Fulfilment",
      twoFactorEnabled: false,
      status: "active",
    },
  ]);

  const [enforce2FA, setEnforce2FA] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const columns: Column<StaffMember>[] = [
    {
      key: "name",
      header: "Staff Member",
      render: (row) => (
        <div>
          <span className="font-medium text-ink block text-base">{row.name}</span>
          <span className="text-xs text-ink-muted font-mono">{row.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role Level",
      render: (row) => (
        <span className="font-display text-sm uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 border border-accent/20">
          {row.role}
        </span>
      ),
    },
    {
      key: "twoFactor",
      header: "2FA Status",
      render: (row) => (
        <span
          className={`text-xs font-display uppercase tracking-widest px-2 py-0.5 border ${
            row.twoFactorEnabled
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {row.twoFactorEnabled ? "Enforced (TOTP)" : "Not Setup"}
        </span>
      ),
    },
    {
      key: "status",
      header: "State",
      render: (row) => (
        <span className="text-xs font-display uppercase tracking-widest text-ink">
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMsg}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="Access Governance"
        title="Staff & Role Permissions"
        description="Invite workshop admins, configure granular role permissions, and enforce two-factor authentication."
      >
        <button
          onClick={() => {
            alert("Invite dialog: Enter staff email to send role invitation.");
          }}
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-display text-lg uppercase tracking-wider hover:bg-[#A9420F] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Staff</span>
        </button>
      </AdminPageHeader>

      {/* Security Enforcement Card */}
      <div className="bg-white border border-[#E6E3DE] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-accent" />
          <div>
            <span className="font-display text-lg uppercase tracking-wider text-ink block">
              Enforce 2FA for All Staff
            </span>
            <span className="text-xs text-ink-muted">
              Require Google Authenticator / TOTP verification on staff login.
            </span>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enforce2FA}
            onChange={(e) => {
              setEnforce2FA(e.target.checked);
              setToastMsg(
                e.target.checked
                  ? "2FA required for staff"
                  : "2FA optional for staff"
              );
              setTimeout(() => setToastMsg(null), 2000);
            }}
            className="w-4 h-4 accent-accent"
          />
          <span className="text-xs font-display uppercase tracking-widest text-ink">
            {enforce2FA ? "Enforced" : "Optional"}
          </span>
        </label>
      </div>

      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={staff}
          keyExtractor={(s) => s.id}
          emptyMessage="No staff accounts found."
        />
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white border border-[#E6E3DE] p-6 space-y-4">
        <h3 className="font-display text-xl uppercase tracking-wider text-ink border-b border-[#E6E3DE] pb-2">
          Role Permissions Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E6E3DE] font-display uppercase tracking-wider text-ink">
                <th className="py-2">Module</th>
                <th>Owner</th>
                <th>Workshop Manager</th>
                <th>Fulfilment</th>
                <th>Content Editor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E3DE]">
              <tr>
                <td className="py-2.5 font-medium">Orders & Fulfillment</td>
                <td className="text-green-700 font-bold">Full Access</td>
                <td className="text-green-700 font-bold">View / Update</td>
                <td className="text-green-700 font-bold">View / Track</td>
                <td className="text-gray-400">No Access</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Product Catalog & Prices</td>
                <td className="text-green-700 font-bold">Full Access</td>
                <td className="text-green-700 font-bold">Edit Specs</td>
                <td className="text-gray-400">View Only</td>
                <td className="text-green-700 font-bold">Edit Blurbs</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Store Settings & Taxes</td>
                <td className="text-green-700 font-bold">Full Access</td>
                <td className="text-gray-400">No Access</td>
                <td className="text-gray-400">No Access</td>
                <td className="text-gray-400">No Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

