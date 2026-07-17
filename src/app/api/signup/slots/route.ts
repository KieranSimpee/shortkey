import { NextResponse } from "next/server";
import { listBookedSlotIsos } from "@/lib/meeting-bookings";
import { generateAvailableSlots } from "@/lib/meeting-slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const booked = new Set(listBookedSlotIsos());
  const slots = generateAvailableSlots().filter((s) => !booked.has(s.startIso));
  return NextResponse.json({
    ok: true,
    timezone: "Asia/Hong_Kong",
    slotMinutes: 60,
    slots,
  });
}
