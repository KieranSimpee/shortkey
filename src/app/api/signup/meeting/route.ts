import { NextResponse } from "next/server";
import { recordBooking } from "@/lib/meeting-bookings";
import { formatSlotFull, generateAvailableSlots, type MeetingKind } from "@/lib/meeting-slots";
import { sendMeetingNotifyEmail } from "@/lib/notify-meeting";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  kind?: MeetingKind;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  slotStartIso?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const kind = body.kind === "brand" ? "brand" : body.kind === "creator" ? "creator" : null;
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const notes = (body.notes || "").trim();
  const slotStartIso = (body.slotStartIso || "").trim();

  if (!kind) {
    return NextResponse.json({ ok: false, error: "Invalid signup type." }, { status: 400 });
  }
  if (!name || !email || !phone) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and contact number are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }
  if (!slotStartIso) {
    return NextResponse.json({ ok: false, error: "Please select a 1-hour time slot." }, { status: 400 });
  }

  const valid = generateAvailableSlots().some((s) => s.startIso === slotStartIso);
  if (!valid) {
    return NextResponse.json(
      { ok: false, error: "That slot is no longer available. Pick another time." },
      { status: 409 },
    );
  }

  const result = recordBooking({
    kind,
    name,
    email,
    phone,
    notes,
    slotStartIso,
  });

  if ("error" in result) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 409 });
  }

  const slot = generateAvailableSlots().find((s) => s.startIso === slotStartIso);
  const slotLabel = slot ? formatSlotFull(slot) : slotStartIso;

  console.info("[signup/meeting]", {
    id: result.id,
    kind,
    name,
    email,
    phone,
    notes,
    slotLabel,
    notifyTo: "info@shortkey.beauty",
  });

  const emailed = await sendMeetingNotifyEmail({
    kind,
    name,
    email,
    phone,
    notes,
    slotLabel,
    bookingId: result.id,
  });

  if (!emailed.ok) {
    console.error("[signup/meeting] email failed", emailed);
    // Booking is still recorded; ask user to retry contact if mail fails hard
    return NextResponse.json({
      ok: true,
      bookingId: result.id,
      slotLabel,
      emailed: false,
      message: `Your slot ${slotLabel} is reserved. We could not auto-email info@shortkey.beauty — please also message us if you do not hear back.`,
    });
  }

  const webhook = process.env.SIGNUP_NOTIFY_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "meeting_signup",
          ...result,
          slotLabel,
          notifyTo: "info@shortkey.beauty",
        }),
      });
    } catch (err) {
      console.error("[signup/meeting] webhook failed", err);
    }
  }

  return NextResponse.json({
    ok: true,
    bookingId: result.id,
    slotLabel,
    emailed: true,
    message: `Sent — your 1-hour ${kind} meeting for ${slotLabel} was emailed to info@shortkey.beauty. We'll confirm soon.`,
  });
}
