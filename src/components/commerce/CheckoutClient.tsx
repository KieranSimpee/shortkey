"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/commerce/CartProvider";
import { formatMoney } from "@/lib/commerce/pricing";
import type { CheckoutResponse } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

export function CheckoutClient() {
  const { lines, subtotal, setQuantity, removeItem, clear, itemCount } = useCart();
  const [provider, setProvider] = useState<"stripe" | "shopify">("stripe");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function startCheckout() {
    if (!lines.length) return;
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          customerEmail: email || undefined,
          lines: lines.map((line) => ({
            sku: line.sku,
            quantity: line.quantity,
            name: line.name,
            unitPrice: line.unitPrice,
            shopifyVariantId: line.shopifyVariantId,
            stripePriceId: line.stripePriceId,
          })),
        }),
      });
      const json = (await res.json()) as CheckoutResponse;
      if (!json.ok) {
        setStatus(json.error);
        return;
      }
      if (json.provider === "mock") {
        clear();
      }
      window.location.href = json.checkoutUrl;
    } catch {
      setStatus("Checkout request failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!itemCount) {
    return (
      <div className="rounded-xl border border-white/50 bg-white/40 p-6 text-center">
        <p className="text-sm text-ink-muted">Your bag is empty.</p>
        <Link
          href="/shop"
          className="mt-4 inline-flex text-[11px] font-semibold uppercase tracking-[0.12em] text-brand"
        >
          Continue shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <ul className="space-y-3">
        {lines.map((line) => (
          <li
            key={line.sku}
            className="flex gap-3 rounded-xl border border-white/50 bg-white/45 p-3"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/50">
              <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] text-brand/70">{line.sku}</p>
              <p className="text-sm font-semibold text-ink">{line.name}</p>
              <p className="text-xs text-ink-muted">{formatMoney(line.unitPrice)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={line.quantity}
                  onChange={(e) => setQuantity(line.sku, Number(e.target.value) || 1)}
                  className="w-16 rounded-full border border-white/60 bg-white/70 px-2 py-1 text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeItem(line.sku)}
                  className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted hover:text-ink"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="h-fit rounded-xl border border-white/50 bg-white/45 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand/80">
          Checkout
        </p>
        <p className="mt-3 text-2xl font-semibold text-ink">{formatMoney(subtotal)}</p>
        <p className="mt-1 text-xs text-ink-muted">{itemCount} item(s) · USD</p>

        <label className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
          Email (optional)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="mt-1 w-full rounded-full border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
          />
        </label>

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
          Payment gateway
        </p>
        <div className="mt-2 flex gap-2">
          {(
            [
              ["stripe", "Stripe"],
              ["shopify", "Shopify"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setProvider(id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]",
                provider === id
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-white/60 bg-white/50 text-ink-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={startCheckout}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white disabled:opacity-60"
        >
          {busy ? "Redirecting…" : `Pay with ${provider === "stripe" ? "Stripe" : "Shopify"} →`}
        </button>

        {status ? <p className="mt-3 text-xs text-red-600/90">{status}</p> : null}

        <p className="mt-4 text-[10px] leading-relaxed text-ink-muted">
          Without API keys the request uses mock success. With keys, you are redirected to Stripe
          Checkout or Shopify checkout.
        </p>
      </div>
    </div>
  );
}
