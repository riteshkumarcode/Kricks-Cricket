"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContactMessageRecord, getContactMessages } from "@/lib/cms-store";
import { Mail, CheckCircle, Send, Archive, Clock } from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([
    {
      id: "msg-101",
      name: "Sunil Gavaskar Fans Club",
      email: "sunilclub@mumbai.com",
      phone: "+91 98201 98201",
      subject: "Custom bat weight inquiry",
      message:
        "Can we request a custom bat with a 2lb 6oz pick up for an opening batsman?",
      status: "unread",
      createdAt: "Today, 10:15",
    },
    {
      id: "msg-102",
      name: "Devendra Patel",
      email: "patel.d@ahmedabad.in",
      phone: "+91 99090 12345",
      subject: "International delivery to Dubai",
      message: "How many days does courier take to Reach Dubai Marina?",
      status: "read",
      createdAt: "Oct 30",
    },
  ]);

  const [selectedMsg, setSelectedMsg] = useState<ContactMessageRecord | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleMarkRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "read" } : m))
    );
  };

  const handleSendReply = () => {
    if (!selectedMsg) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMsg.id ? { ...m, status: "replied" } : m
      )
    );
    setToastMsg(`Reply emailed to ${selectedMsg.email}`);
    setSelectedMsg(null);
    setReplyText("");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const columns: Column<ContactMessageRecord>[] = [
    {
      key: "sender",
      header: "Sender",
      render: (row) => (
        <div>
          <span className="font-medium text-ink block text-base">{row.name}</span>
          <span className="text-xs text-ink-muted font-mono">{row.email}</span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject & Message",
      render: (row) => (
        <div>
          <span className="font-medium text-ink block text-sm">{row.subject}</span>
          <span className="text-xs text-ink-muted line-clamp-1">{row.message}</span>
        </div>
      ),
    },
    {
      key: "time",
      header: "Received",
      render: (row) => <span className="text-xs text-ink-muted">{row.createdAt}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-block px-2 py-0.5 text-xs font-display tracking-widest uppercase border ${
            row.status === "unread"
              ? "bg-accent/10 text-accent border-accent/30 font-bold"
              : row.status === "replied"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      className: "text-right",
      render: (row) => (
        <button
          onClick={() => {
            handleMarkRead(row.id);
            setSelectedMsg(row);
          }}
          className="text-xs font-display uppercase tracking-wider text-accent hover:underline"
        >
          Open & Reply
        </button>
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
        kicker="Inbound Support"
        title="Contact Messages Inbox"
        description="Review inquiries submitted from the storefront contact form and reply via transactional email."
      />

      <div className="bg-white border border-[#E6E3DE]">
        <DataTable
          columns={columns}
          data={messages}
          keyExtractor={(m) => m.id}
          emptyMessage="Inbox is clean. No unread customer messages."
        />
      </div>

      {selectedMsg && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-black max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E6E3DE] pb-3">
              <div>
                <span className="text-xs uppercase font-display tracking-widest text-accent">
                  From: {selectedMsg.name} ({selectedMsg.email})
                </span>
                <h3 className="font-display text-2xl uppercase tracking-wider text-ink">
                  {selectedMsg.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="font-display text-xl text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#F4F3F0] border border-[#E6E3DE] text-sm text-ink">
              {selectedMsg.message}
            </div>

            <div>
              <label className="block text-xs uppercase font-display tracking-widest text-ink-muted mb-1">
                Your Reply Note:
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your email reply..."
                className="w-full p-2.5 bg-[#F4F3F0] border border-[#E6E3DE] text-sm outline-none focus:border-black"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E6E3DE]">
              <button
                onClick={() => setSelectedMsg(null)}
                className="px-4 py-2 border border-[#E6E3DE] font-display text-sm uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2 font-display text-base uppercase tracking-wider hover:bg-[#A9420F]"
              >
                <Send className="w-4 h-4" />
                <span>Send Email Reply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

