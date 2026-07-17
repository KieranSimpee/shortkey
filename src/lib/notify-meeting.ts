/**
 * Notify Shortkey inbox of a meeting signup.
 * Prefer Resend when RESEND_API_KEY is set; otherwise FormSubmit.co → info@shortkey.beauty.
 */

const INBOX = "info@shortkey.beauty";

export type MeetingNotifyPayload = {
  kind: "creator" | "brand";
  name: string;
  email: string;
  phone: string;
  notes: string;
  slotLabel: string;
  bookingId: string;
};

export async function sendMeetingNotifyEmail(
  payload: MeetingNotifyPayload,
): Promise<{ ok: boolean; via?: string; error?: string }> {
  const subject = `[Shortkey] ${payload.kind === "creator" ? "Creator" : "Brand"} meeting — ${payload.slotLabel}`;
  const text = [
    `New ${payload.kind} signup meeting request`,
    ``,
    `Booking ID: ${payload.bookingId}`,
    `Slot (HKT): ${payload.slotLabel}`,
    ``,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Notes: ${payload.notes || "(none)"}`,
    ``,
    `Reply to the requester at ${payload.email} to confirm.`,
  ].join("\n");

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const from = process.env.RESEND_FROM_EMAIL?.trim() || "Shortkey <onboarding@resend.dev>";
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [INBOX],
          reply_to: payload.email,
          subject,
          text,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("[meeting-email] Resend failed", res.status, body);
        return { ok: false, via: "resend", error: body };
      }
      return { ok: true, via: "resend" };
    } catch (err) {
      console.error("[meeting-email] Resend error", err);
      return { ok: false, via: "resend", error: err instanceof Error ? err.message : "send failed" };
    }
  }

  // FormSubmit — first use may require confirming info@shortkey.beauty once
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${INBOX}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        _replyto: payload.email,
        kind: payload.kind,
        bookingId: payload.bookingId,
        slot: payload.slotLabel,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        notes: payload.notes || "(none)",
        message: text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[meeting-email] FormSubmit failed", res.status, body);
      return { ok: false, via: "formsubmit", error: body };
    }
    return { ok: true, via: "formsubmit" };
  } catch (err) {
    console.error("[meeting-email] FormSubmit error", err);
    return { ok: false, via: "formsubmit", error: err instanceof Error ? err.message : "send failed" };
  }
}
