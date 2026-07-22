"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Visual surface — light card or on-dark hero context */
  surface?: "light" | "dark";
};

/** Coming Soon — pre-register email capture (no product/pricing details exposed). */
export function EmailCaptureForm({ className, surface = "light" }: Props) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/signup/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role: "visitor" }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "Could not pre-register. Try again.");
        return;
      }
      setMessage(json.message || "You're on the list.");
      setEmail("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (message) {
    return (
      <p
        className={cn(
          "text-sm font-semibold",
          surface === "dark" ? "text-brand-light" : "text-brand",
          className,
        )}
      >
        {message}
      </p>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className={cn(
              "w-full rounded-full border px-4 py-2.5 text-sm outline-none transition",
              surface === "dark"
                ? "border-white/25 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50"
                : "border-brand/25 bg-white px-4 text-ink placeholder:text-ink-subtle focus:border-brand/50",
            )}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className={cn(
            "shrink-0 rounded-full px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.14em] transition disabled:opacity-60",
            surface === "dark"
              ? "bg-white text-brand hover:bg-brand-muted"
              : "bg-brand text-white hover:bg-brand-dark",
          )}
        >
          {busy ? "Sending…" : "Notify Me →"}
        </button>
      </form>
      {error ? <p className="mt-2 text-[11px] text-red-500">{error}</p> : null}
    </div>
  );
}
