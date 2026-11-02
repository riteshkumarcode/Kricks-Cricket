"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("admin-credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please verify your credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white text-ink p-8 md:p-10 shadow-floating">
        <div className="text-center mb-8">
          <div className="w-6 h-6 rounded-full bg-accent mx-auto mb-3" />
          <h1 className="font-display text-4xl tracking-wider uppercase text-ink">
            Kricks Staff Portal
          </h1>
          <p className="text-ink-muted text-sm mt-1">Sign in to access the store management console</p>
        </div>

        {error && (
          <div className="p-3 bg-[#B3261E]/10 border border-[#B3261E] text-[#B3261E] text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            label="Staff Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="admin@krickscricket.com"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? "Authenticating..." : "Sign In to Admin →"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E6E3DE] text-center text-xs text-ink-muted">
          Default seed credentials: <code className="text-ink font-semibold">admin@krickscricket.com</code> / <code className="text-ink font-semibold">Admin@Kricks2026!</code>
        </div>
      </div>
    </div>
  );
}

