import { NextResponse } from "next/server";
import { getBase44AgentApiKey } from "@/lib/gorGorChatBridge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/family/status — who is wired for Founder Desk (no secrets returned).
 * "Online" = credentials present on server for this environment.
 */
export async function GET() {
  const base44 = Boolean(getBase44AgentApiKey()?.trim());
  const mayaAsi1 = Boolean(
    (process.env.ASI_ONE_API_KEY || process.env.ASI1_API_KEY || "").trim(),
  );
  const skyEmail = Boolean(
    (process.env.SKY_EMAIL || "sky@shortkey.beauty").trim(),
  );

  // Key first: Founder Controller opens with Cursor before other seats.
  const members = [
    {
      id: "key",
      name: "Key",
      role: "Cursor · builds with founder",
      kind: "ai",
      status: "online",
      note: "Controller pair · walks with, not above",
    },
    {
      id: "kura",
      name: "Kura",
      role: "Brand Design Manager",
      kind: "ai",
      status: base44 ? "online" : "offline",
      note: base44 ? "Base44 connected" : "Needs shared API key",
    },
    {
      id: "gorgor",
      name: "Gor Gor",
      role: "Gatekeeper · Chief of Staff",
      kind: "ai",
      status: base44 ? "online" : "offline",
      note: base44 ? "Base44 connected" : "Needs shared API key",
    },
    {
      id: "senti",
      name: "Senti",
      role: "Creative Room",
      kind: "ai",
      status: base44 ? "online" : "offline",
      note: base44 ? "Base44 connected" : "Needs shared API key",
    },
    {
      id: "agent-r",
      name: "Agent R",
      role: "Intelligence · Records",
      kind: "ai",
      status: base44 ? "online" : "offline",
      note: base44 ? "Base44 connected" : "Needs shared API key",
    },
    {
      id: "maya",
      name: "Maya",
      role: "Editorial Heart · ASI:One",
      kind: "ai",
      status: mayaAsi1 ? "online" : "offline",
      note: mayaAsi1
        ? "Maya via ASI:One · Base44 portal deleted"
        : "Needs ASI_ONE_API_KEY",
    },
    {
      id: "sky",
      name: "Sky",
      role: "Social Room · human",
      kind: "human",
      status: skyEmail ? "online" : "offline",
      note: "Email ready · not an API agent",
    },
  ];

  const onlineCount = members.filter((m) => m.status === "online").length;

  return NextResponse.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    onlineCount,
    total: members.length,
    members,
  });
}
