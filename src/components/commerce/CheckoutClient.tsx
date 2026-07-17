"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/commerce/pricing";
import type { CheckoutResponse } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

/** Client checkout body — uses live cart + bridged /api/checkout */
export function CheckoutContent() {
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
      <div className="rounded-xl border border-[#2B2B2B] bg-[#111] p-6 text-center">
        <p className="text-sm text-[#9A9A9A]">Your bag is empty.</p>
        <Link
          href="/shop"
          className="mt-4 inline-flex text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F4F4F4]"
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
            className="flex gap-3 rounded-xl border border-[#2B2B2B] bg-[#111] p-3"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#2B2B2B] bg-[#1A1A1A]">
              <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] text-[#6E6E6E]">{line.sku}</p>
              <p className="text-sm font-semibold text-[#F4F4F4]">{line.name}</p>
              <p className="text-xs text-[#9A9A9A]">{formatMoney(line.unitPrice)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={line.quantity}
                  onChange={(e) => setQuantity(line.sku, Number(e.target.value) || 1)}
                  className="w-16 rounded-full border border-[#2B2B2B] bg-[#0A0A0A] px-2 py-1 text-xs text-[#F4F4F4]"
                />
                <button
                  type="button"
                  onClick={() => removeItem(line.sku)}
                  className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6E6E6E] hover:text-[#F4F4F4]"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="h-fit rounded-xl border border-[#2B2B2B] bg-[#111] p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A9A9A]">
          Checkout
        </p>
        <p className="mt-3 text-2xl font-semibold text-[#F4F4F4]">{formatMoney(subtotal)}</p>
        <p className="mt-1 text-xs text-[#6E6E6E]">{itemCount} item(s) · USD</p>

        <label className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6E6E6E]">
          Email (optional)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="mt-1 w-full rounded-full border border-[#2B2B2B] bg-[#0A0A0A] px-3 py-2 text-sm text-[#F4F4F4]"
          />
        </label>

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6E6E6E]">
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
                  ? "border-[#F4F4F4] bg-[#F4F4F4] text-[#0A0A0A]"
                  : "border-[#2B2B2B] bg-[#0A0A0A] text-[#9A9A9A]",
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
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#F4F4F4] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#0A0A0A] disabled:opacity-60"
        >
          {busy ? "Redirecting…" : `Pay with ${provider === "stripe" ? "Stripe" : "Shopify"} →`}
        </button>

        {status ? <p className="mt-3 text-xs text-red-400">{status}</p> : null}

        <p className="mt-4 text-[10px] leading-relaxed text-[#6E6E6E]">
          Cart lines are enriched by the bridge hub on checkout (Senti / static SKU map → Stripe or
          Shopify).
        </p>
      </div>
    </div>
  );
}

/** @deprecated use CheckoutContent — kept for existing imports */
export const CheckoutClient = CheckoutContent;
