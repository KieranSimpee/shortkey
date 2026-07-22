import { NextResponse } from "next/server";
import { recordPreRegister } from "@/lib/email-capture";
import { sendPreRegisterNotifyEmail } from "@/lib/notify-pre-register";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  email?: string;
  role?: "creator" | "brand" | "visitor";
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const email = (body.email || "").trim();
  const role = body.role === "creator" || body.role === "brand" ? body.role : "visitor";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }

  const result = recordPreRegister({ email, role });
  if ("error" in result) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 409 });
  }

  console.info("[signup/pre-register]", result);

  const emailed = await sendPreRegisterNotifyEmail(result);
  if (!emailed.ok) {
    console.error("[signup/pre-register] email failed", emailed);
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    message: "You're on the list — we'll email you before August 14.",
  });
}
