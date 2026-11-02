"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BulkEnquiryLead, getBulkEnquiries } from "@/lib/cms-store";
import { formatMoney } from "@/lib/tokens";
import {
  FileText,
  Send,
  CheckCircle,
  Phone,
  Mail,
  ChevronRight,
  Plus,
} from "lucide-react";

const STAGES = ["New", "Contacted", "Quote Sent", "Won", "Lost"] as const;

export default function AdminBulkEnquiriesPage() {
  const [leads, setLeads] = useState<BulkEnquiryLead[]>([
    {
      id: "ENQ-901",
      clubName: "Apex Cricket Academy",
      contactName: "Coach Rajesh Verma",
      email: "apex.academy@cricket.in",
      phone: "+91 98111 22334",
      batModel: "Players Grade 1 English Willow",
      quantity: 25,
      targetDate: "2026-12-15",
      notes: "Requires academy crest laser engraved on back spine and maroon grips.",
      stage: "Quote Sent",
      quoteValue: 33998000,
      createdAt: "2026-10-28",
    },
    {
      id: "ENQ-902",
      clubName: "Saint Paul's High School XI",
      contactName: "Father Thomas",
      email: "sports@stpaulsdelhi.edu",
      phone: "+91 98450 67890",
      batModel: "Kashmir Select Match Bats",
      quantity: 15,
      targetDate: "2026-11-20",
      notes: "Inter-school tournament kit package.",
      stage: "Contacted",
      createdAt: "2026-10-30",
    },
    {
      id: "ENQ-903",
      clubName: "London South Asian CC",
      contactName: "Tariq Mahmood",
      email: "tariq@lsacc.co.uk",
      phone: "+44 7911 123456",
      batModel: "Pro Edition Match Bats",
      quantity: 50,
      targetDate: "2027-01-10",
      notes: "Full team shipment to UK via DHL.",
      stage: "New",
      createdAt: "2026-11-01",
    },
  ]);

  const [selectedLead, setSelectedLead] = useState<BulkEnquiryLead | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const moveLeadStage = (
    id: string,
    newStage: (typeof STAGES)[number]
  ) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage: newStage } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
    setToastMsg(`Lead moved to ${newStage}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 flex items-center gap-3 border border-accent shadow-2xl">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="font-body text-sm">{toastMsg}</span>
        </div>
      )}

      <AdminPageHeader
        kicker="Team & Institutional Sales"
        title="Club Enquiries Pipeline (CRM)"
        description="Track club/school bat requests, generate discounted quotations, and close wholesale squad packages."
      />

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          return (
            <div
              key={stage}
              className="bg-[#F4F3F0] border border-[#E6E3DE] p-3 flex flex-col min-h-[450px]"
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E6E3DE]">
                <h3 className="font-display text-base uppercase tracking-wider text-ink">
                  {stage}
                </h3>
                <span className="text-xs font-mono bg-white px-2 py-0.5 border border-[#E6E3DE] text-ink">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-3 bg-white border border-[#E6E3DE] hover:border-black transition-all cursor-pointer shadow-sm space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono text-ink-muted">
                        {lead.id}
                      </span>
                      <span className="text-xs font-display uppercase tracking-wider text-accent font-bold">
                        {lead.quantity} Bats
                      </span>
                    </div>

                    <h4 className="font-display text-lg uppercase tracking-wider text-ink leading-tight">
                      {lead.clubName}
                    </h4>

                    <p className="text-xs text-ink-muted font-medium">
                      {lead.contactName}
                    </p>

                    {lead.quoteValue && (
                      <span className="block text-xs font-display uppercase tracking-widest text-ink pt-1 border-t border-[#E6E3DE]">
                        Quote: {formatMoney(lead.quoteValue, "INR")}
                      </span>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <select
                        value={lead.stage}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          moveLeadStage(lead.id, e.target.value as any)
                        }
                        className="bg-[#F4F3F0] border border-[#E6E3DE] text-[10px] font-display uppercase tracking-widest px-1 py-0.5"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Drawer / Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-black max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E6E3DE] pb-4">
              <div>
                <span className="text-xs uppercase font-display tracking-widest text-accent">
                  {selectedLead.id} · {selectedLead.stage}
                </span>
                <h3 className="font-display text-3xl uppercase tracking-wider text-ink">
                  {selectedLead.clubName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="font-display text-xl text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-ink-muted block uppercase font-display tracking-widest">
                  Contact Person:
                </span>
                <span className="font-medium text-ink">{selectedLead.contactName}</span>
                <span className="text-xs text-ink-muted block font-mono">
                  {selectedLead.email}
                </span>
                <span className="text-xs text-ink-muted block font-mono">
                  {selectedLead.phone}
                </span>
              </div>

              <div>
                <span className="text-xs text-ink-muted block uppercase font-display tracking-widest">
                  Order Details:
                </span>
                <span className="font-medium text-ink block">
                  {selectedLead.quantity} x {selectedLead.batModel}
                </span>
                <span className="text-xs text-ink-muted">
                  Required By: {selectedLead.targetDate}
                </span>
              </div>
            </div>

            <div className="bg-[#F4F3F0] p-4 border border-[#E6E3DE]">
              <span className="text-xs uppercase font-display tracking-widest text-ink-muted block mb-1">
                Workshop & Engraving Notes:
              </span>
              <p className="text-sm text-ink">{selectedLead.notes}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E6E3DE]">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-display tracking-wider text-ink-muted">
                  Move Stage:
                </span>
                <select
                  value={selectedLead.stage}
                  onChange={(e) =>
                    moveLeadStage(selectedLead.id, e.target.value as any)
                  }
                  className="p-1.5 bg-[#F4F3F0] border border-[#E6E3DE] text-xs font-display uppercase tracking-wider"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setToastMsg(
                    `Official PDF Quotation sent to ${selectedLead.email}`
                  );
                  setSelectedLead(null);
                  setTimeout(() => setToastMsg(null), 3000);
                }}
                className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2 font-display text-base uppercase tracking-wider hover:bg-[#A9420F]"
              >
                <Send className="w-4 h-4" />
                <span>Send Formal Quote</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

