"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatDayHeading,
  formatSlotFull,
  groupSlotsByDay,
  type MeetingKind,
  type MeetingSlot,
} from "@/lib/meeting-slots";
import { cn } from "@/lib/utils";

type Props = {
  kind: MeetingKind;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

type Step = "details" | "calendar" | "sent";

export function MeetingSignupForm({ kind }: Props) {
  const [step, setStep] = useState<Step>("details");
  const [slots, setSlots] = useState<MeetingSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  async function loadSlots() {
    setLoadingSlots(true);
    setError("");
    try {
      const res = await fetch("/api/signup/slots");
      const json = (await res.json()) as { ok?: boolean; slots?: MeetingSlot[] };
      if (json.ok && json.slots) {
        setSlots(json.slots);
        const firstDay = json.slots[0]?.dayKey;
        if (firstDay) setSelectedDay(firstDay);
      } else {
        setError("Could not load available times.");
      }
    } catch {
      setError("Could not load available times. Refresh and try again.");
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    if (step === "calendar" && slots.length === 0 && !loadingSlots) {
      void loadSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const byDay = useMemo(() => groupSlotsByDay(slots), [slots]);
  const dayKeys = useMemo(() => Object.keys(byDay).sort(), [byDay]);
  const daySlots = selectedDay ? byDay[selectedDay] ?? [] : [];

  function goToCalendar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in name, email, and contact number.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Enter a valid email.");
      return;
    }
    setStep("calendar");
  }

  async function sendRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!selectedSlot) {
      setError("Pick a 1-hour time slot on the calendar.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/signup/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          ...form,
          slotStartIso: selectedSlot,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "Booking failed. Try another slot.");
        return;
      }
      setSuccess(json.message || "Request sent to info@shortkey.beauty.");
      setSlots((prev) => prev.filter((s) => s.startIso !== selectedSlot));
      setSelectedSlot("");
      setStep("sent");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (step === "sent" && success) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-white/50 bg-white/45 px-6 py-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand">Sent</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{success}</p>
        <p className="mt-2 text-[11px] text-ink-subtle">
          Notification emailed to{" "}
          <span className="font-semibold text-ink-muted">info@shortkey.beauty</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setSuccess(null);
            setStep("details");
            setForm({ name: "", email: "", phone: "", notes: "" });
          }}
          className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink hover:text-brand"
        >
          Start another request
        </button>
      </div>
    );
  }

  if (step === "details") {
    return (
      <form onSubmit={goToCalendar} className="mx-auto max-w-lg">
        <div className="rounded-xl border border-white/50 bg-white/45 p-4 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            Step 1 of 2
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-ink">Your details</p>
          <p className="mt-1 text-[11px] text-ink-subtle">
            {kind === "creator" ? "Creator signup" : "Brand signup"} — then choose a calendar slot
          </p>

          <div className="mt-4 space-y-3">
            <Field
              label="Name"
              required
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder={kind === "brand" ? "Contact name" : "Your name"}
            />
            <Field
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              placeholder="you@email.com"
            />
            <Field
              label="Contact number"
              type="tel"
              required
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              placeholder="+852 …"
            />
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Anything else
              </span>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder={
                  kind === "brand"
                    ? "Brand name, market, products…"
                    : "Platforms, audience, niche…"
                }
                className="w-full rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-brand/40 focus:outline-none"
              />
            </label>
          </div>

          {error ? <p className="mt-3 text-[11px] text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-brand px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-dark"
          >
            Request meeting →
          </button>
        </div>
      </form>
    );
  }

  // step === "calendar"
  return (
    <form onSubmit={sendRequest} className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-white/50 bg-white/45 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
              Step 2 of 2
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-ink">
              Pick a 1-hour slot
            </p>
            <p className="mt-1 text-[11px] text-ink-subtle">
              Hong Kong time (HKT) · Mon–Fri · then we email info@shortkey.beauty
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError("");
              setStep("details");
            }}
            className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted hover:text-ink"
          >
            ← Edit details
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-white/50 bg-white/40 px-3 py-2 text-[11px] text-ink-muted">
          <span className="font-semibold text-ink">{form.name}</span>
          {" · "}
          {form.email}
          {" · "}
          {form.phone}
        </div>

        {loadingSlots ? (
          <p className="mt-6 text-sm text-ink-muted">Loading calendar…</p>
        ) : dayKeys.length === 0 ? (
          <p className="mt-6 text-sm text-ink-muted">
            No open slots right now. Email info@shortkey.beauty directly.
          </p>
        ) : (
          <>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {dayKeys.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day);
                    setSelectedSlot("");
                  }}
                  className={cn(
                    "shrink-0 rounded-xl border px-3 py-2 text-left transition",
                    selectedDay === day
                      ? "border-brand/40 bg-brand/10 text-ink"
                      : "border-white/60 bg-white/50 text-ink-muted hover:border-brand/25",
                  )}
                >
                  <span className="block text-sm font-bold text-ink">{formatDayHeading(day)}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {daySlots.map((slot) => {
                const active = selectedSlot === slot.startIso;
                return (
                  <button
                    key={slot.startIso}
                    type="button"
                    onClick={() => setSelectedSlot(slot.startIso)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition",
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-white/60 bg-white/60 text-ink-muted hover:border-brand/40 hover:text-ink",
                    )}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>

            {selectedSlot ? (
              <p className="mt-4 text-[11px] text-ink-muted">
                Selected:{" "}
                <span className="font-semibold text-ink">
                  {formatSlotFull(daySlots.find((s) => s.startIso === selectedSlot)!)}
                </span>
              </p>
            ) : (
              <p className="mt-4 text-[11px] text-ink-subtle">Pick a day, then a 1-hour slot.</p>
            )}
          </>
        )}

        {error ? <p className="mt-3 text-[11px] text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={busy || !selectedSlot || loadingSlots}
          className="mt-5 w-full rounded-full bg-brand px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send to info@shortkey.beauty"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-brand/40 focus:outline-none"
      />
    </label>
  );
}
