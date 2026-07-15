"use client";

import Image from "next/image";
import { useState } from "react";
import { brandConfirmationContent, type ConfirmationSku } from "@/content/brandConfirmation";
import {
  PanelAlert,
  PanelCardInner,
  PanelFieldLabel,
  PanelInput,
} from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

type SkuPricingListProps = {
  skus: ConfirmationSku[];
  light?: boolean;
};

type SkuPricingState = {
  cost: string;
  retail: string;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function parsePrice(value: string) {
  const parsed = parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function SkuPricingList({ skus, light = false }: SkuPricingListProps) {
  const copy = brandConfirmationContent.sections.skus;
  const [pricing, setPricing] = useState<Record<string, SkuPricingState>>(() =>
    Object.fromEntries(skus.map((sku) => [sku.sku, { cost: "", retail: "" }])),
  );

  function updateField(sku: string, field: keyof SkuPricingState, value: string) {
    setPricing((prev) => ({
      ...prev,
      [sku]: { ...prev[sku], [field]: value },
    }));
  }

  return (
    <>
      <ul className="space-y-4">
        {skus.map((product) => {
          const fields = pricing[product.sku] ?? { cost: "", retail: "" };
          const retailValue = parsePrice(fields.retail);
          const retailBlocked = retailValue != null && retailValue > product.onlineRetailUsd;

          return (
            <li key={product.sku}>
              <PanelCardInner error={retailBlocked}>
                <div className="flex items-start gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-brand/15 bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand/80">
                      {product.sku}
                    </p>
                    <p className={cn("text-sm font-medium", light ? "text-ink" : "text-white")}>
                      {product.name}
                    </p>
                    <p className={cn("mt-0.5 text-xs", light ? "text-ink-subtle" : "text-white/50")}>
                      {product.type}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <PanelFieldLabel>{copy.costLabel}</PanelFieldLabel>
                    <PanelInput
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={fields.cost}
                      onChange={(event) => updateField(product.sku, "cost", event.target.value)}
                    />
                  </label>
                  <label className="block">
                    <PanelFieldLabel>{copy.retailLabel}</PanelFieldLabel>
                    <PanelInput
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={fields.retail}
                      onChange={(event) => updateField(product.sku, "retail", event.target.value)}
                      aria-invalid={retailBlocked}
                      error={retailBlocked}
                    />
                  </label>
                </div>

                <div className="panel-stat-box mt-3 flex flex-wrap items-center justify-between gap-2 !p-3">
                  <div>
                    <p className="panel-field-label">{copy.quickSearchLabel}</p>
                    <p className="mt-0.5 text-xs text-ink-subtle">{copy.quickSearchNote}</p>
                  </div>
                  <p className="price-value">{formatUsd(product.onlineRetailUsd)}</p>
                </div>

                {retailBlocked ? (
                  <p className="mt-2 text-xs leading-relaxed text-red-600/90" role="alert">
                    {copy.retailBlocked}
                  </p>
                ) : null}
              </PanelCardInner>
            </li>
          );
        })}
      </ul>

      <PanelAlert className="mt-5">
        <ul className="list-disc space-y-1.5 pl-4">
          {copy.fulfillmentReminders.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </PanelAlert>
    </>
  );
}
