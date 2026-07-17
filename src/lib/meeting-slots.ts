/**
 * Meeting slot generator — 1-hour availability in HKT.
 * Mon–Fri, 10:00–17:00 (last start 16:00).
 */

export type MeetingKind = "creator" | "brand";

export type MeetingSlot = {
  /** ISO start time (UTC) */
  startIso: string;
  /** Display label in HKT */
  label: string;
  /** YYYY-MM-DD in HKT */
  dayKey: string;
  /** Hour start 0–23 in HKT */
  hourHkt: number;
};

const HKT_OFFSET_MS = 8 * 60 * 60 * 1000;
const SLOT_HOURS = [10, 11, 12, 13, 14, 15, 16] as const;
const DAYS_AHEAD = 14;

function toHktParts(date: Date) {
  const hkt = new Date(date.getTime() + HKT_OFFSET_MS);
  return {
    y: hkt.getUTCFullYear(),
    m: hkt.getUTCMonth(),
    d: hkt.getUTCDate(),
    weekday: hkt.getUTCDay(), // 0 Sun … 6 Sat
    h: hkt.getUTCHours(),
    min: hkt.getUTCMinutes(),
  };
}

/** Build UTC Date for a given HKT wall-clock time */
function hktWallToUtc(y: number, m: number, d: number, hour: number, minute = 0): Date {
  return new Date(Date.UTC(y, m, d, hour, minute, 0) - HKT_OFFSET_MS);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatSlotLabel(hour: number): string {
  const end = hour + 1;
  const fmt = (h: number) => {
    const suffix = h >= 12 ? "PM" : "AM";
    const twelve = h % 12 === 0 ? 12 : h % 12;
    return `${twelve}:00 ${suffix}`;
  };
  return `${fmt(hour)} - ${fmt(end)}`;
}

/** Next N business days of 1-hour slots in HKT (skips past times today). */
export function generateAvailableSlots(now = new Date()): MeetingSlot[] {
  const slots: MeetingSlot[] = [];
  const nowHkt = toHktParts(now);

  for (let offset = 0; offset < DAYS_AHEAD; offset++) {
    const probe = hktWallToUtc(nowHkt.y, nowHkt.m, nowHkt.d + offset, 12, 0);
    const day = toHktParts(probe);
    if (day.weekday === 0 || day.weekday === 6) continue; // weekends off

    const dayKey = `${day.y}-${pad(day.m + 1)}-${pad(day.d)}`;

    for (const hour of SLOT_HOURS) {
      const start = hktWallToUtc(day.y, day.m, day.d, hour, 0);
      if (start.getTime() <= now.getTime() + 60 * 60 * 1000) continue; // need ≥1h notice
      slots.push({
        startIso: start.toISOString(),
        label: formatSlotLabel(hour),
        dayKey,
        hourHkt: hour,
      });
    }
  }

  return slots;
}

export function groupSlotsByDay(slots: MeetingSlot[]): Record<string, MeetingSlot[]> {
  return slots.reduce<Record<string, MeetingSlot[]>>((acc, slot) => {
    (acc[slot.dayKey] ??= []).push(slot);
    return acc;
  }, {});
}

export function formatDayHeading(dayKey: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  const utc = hktWallToUtc(y, m - 1, d, 12, 0);
  return new Intl.DateTimeFormat("en-HK", {
    timeZone: "Asia/Hong_Kong",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(utc);
}

export function formatSlotFull(slot: MeetingSlot): string {
  return `${formatDayHeading(slot.dayKey)} · ${slot.label} HKT`;
}
