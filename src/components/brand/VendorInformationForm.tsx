"use client";

import { useState } from "react";
import { brandConfirmationContent } from "@/content/brandConfirmation";
import { PanelFieldLabel, PanelInput } from "@/components/ui/Panel";

type VendorFormState = {
  address: string;
  contactEmail: string;
  product: string;
  targetMarket: string;
  currentMarket: string;
  supportNeeds: string;
  yearRevenue: string;
  strength: string;
  identity: string;
};

const emptyForm: VendorFormState = {
  address: "",
  contactEmail: "",
  product: "",
  targetMarket: "",
  currentMarket: "",
  supportNeeds: "",
  yearRevenue: "",
  strength: "",
  identity: "",
};

export function VendorInformationForm() {
  const copy = brandConfirmationContent.sections.vendor;
  const [form, setForm] = useState<VendorFormState>(emptyForm);

  function updateField(field: keyof VendorFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <PanelFieldLabel>{copy.fields.address}</PanelFieldLabel>
          <PanelInput
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            placeholder={copy.placeholders.address}
          />
        </label>
        <label className="block">
          <PanelFieldLabel>{copy.fields.contactEmail}</PanelFieldLabel>
          <PanelInput
            type="email"
            value={form.contactEmail}
            onChange={(event) => updateField("contactEmail", event.target.value)}
            placeholder={copy.placeholders.contactEmail}
          />
        </label>
        <label className="block">
          <PanelFieldLabel>{copy.fields.yearRevenue}</PanelFieldLabel>
          <PanelInput
            value={form.yearRevenue}
            onChange={(event) => updateField("yearRevenue", event.target.value)}
            placeholder={copy.placeholders.yearRevenue}
          />
        </label>
        <label className="block sm:col-span-2">
          <PanelFieldLabel>{copy.fields.product}</PanelFieldLabel>
          <textarea
            value={form.product}
            onChange={(event) => updateField("product", event.target.value)}
            placeholder={copy.placeholders.product}
            rows={3}
            className="panel-input min-h-[88px] resize-y"
          />
        </label>
        <label className="block">
          <PanelFieldLabel>{copy.fields.targetMarket}</PanelFieldLabel>
          <PanelInput
            value={form.targetMarket}
            onChange={(event) => updateField("targetMarket", event.target.value)}
            placeholder={copy.placeholders.targetMarket}
          />
        </label>
        <label className="block">
          <PanelFieldLabel>{copy.fields.currentMarket}</PanelFieldLabel>
          <PanelInput
            value={form.currentMarket}
            onChange={(event) => updateField("currentMarket", event.target.value)}
            placeholder={copy.placeholders.currentMarket}
          />
        </label>
        <label className="block sm:col-span-2">
          <PanelFieldLabel>{copy.fields.supportNeeds}</PanelFieldLabel>
          <textarea
            value={form.supportNeeds}
            onChange={(event) => updateField("supportNeeds", event.target.value)}
            placeholder={copy.placeholders.supportNeeds}
            rows={3}
            className="panel-input min-h-[88px] resize-y"
          />
        </label>
        <label className="block">
          <PanelFieldLabel>{copy.fields.strength}</PanelFieldLabel>
          <PanelInput
            value={form.strength}
            onChange={(event) => updateField("strength", event.target.value)}
            placeholder={copy.placeholders.strength}
          />
        </label>
        <label className="block">
          <PanelFieldLabel>{copy.fields.identity}</PanelFieldLabel>
          <PanelInput
            value={form.identity}
            onChange={(event) => updateField("identity", event.target.value)}
            placeholder={copy.placeholders.identity}
          />
        </label>
      </div>
      <p className="text-xs leading-relaxed text-ink-muted">{copy.followUpNote}</p>
    </form>
  );
}
