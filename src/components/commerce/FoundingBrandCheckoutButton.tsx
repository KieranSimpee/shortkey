"use client";

import { useState } from "react";
import type { CheckoutResponse } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Use on dark brands panel (homepage) */
  dark?: boolean;
};

export function FoundingBrandCheckoutButton({ className, dark = false }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = (await res.json()) as CheckoutResponse;
      if (!json.ok) {
        setError(json.error);
        return;
      }
      window.location.href = json.checkoutUrl;
    } catch {
      setError("Could not start founding checkout.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={busy}
        onClick={pay}
        className={cn(
          "inline-flex rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition disabled:opacity-60",
          dark
            ? "border border-white/30 bg-transparent text-white hover:bg-white/10"
            : "bg-brand text-white hover:bg-brand-dark",
        )}
      >
        {busy ? "Starting Stripe…" : "Pay founding fee with Stripe →"}
      </button>
      {error ? (
        <p className={cn("mt-2 text-xs", dark ? "text-red-200" : "text-red-600/90")}>{error}</p>
      ) : null}
    </div>
  );
}
