/**
 * Notify Shortkey inbox of a Coming Soon pre-register signup.
 * Prefer Resend when RESEND_API_KEY is set; otherwise FormSubmit.co → info@shortkey.beauty.
 * Mirrors src/lib/notify-meeting.ts.
 */

const INBOX = "info@shortkey.beauty";

export type PreRegisterNotifyPayload = {
  id: string;
  email: string;
  role: "creator" | "brand" | "visitor";
};

export async function sendPreRegisterNotifyEmail(
  payload: PreRegisterNotifyPayload,
): Promise<{ ok: boolean; via?: string; error?: string }> {
  const subject = `[Shortkey] Coming Soon pre-register — ${payload.email}`;
  const text = [
    `New Coming Soon pre-register`,
    ``,
    `ID: ${payload.id}`,
    `Email: ${payload.email}`,
    `Role: ${payload.role}`,
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
        console.error("[pre-register-email] Resend failed", res.status, body);
        return { ok: false, via: "resend", error: body };
      }
      return { ok: true, via: "resend" };
    } catch (err) {
      console.error("[pre-register-email] Resend error", err);
      return { ok: false, via: "resend", error: err instanceof Error ? err.message : "send failed" };
    }
  }

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
        id: payload.id,
        email: payload.email,
        role: payload.role,
        message: text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[pre-register-email] FormSubmit failed", res.status, body);
      return { ok: false, via: "formsubmit", error: body };
    }
    return { ok: true, via: "formsubmit" };
  } catch (err) {
    console.error("[pre-register-email] FormSubmit error", err);
    return { ok: false, via: "formsubmit", error: err instanceof Error ? err.message : "send failed" };
  }
}
