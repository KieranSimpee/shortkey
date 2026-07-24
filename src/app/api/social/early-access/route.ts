import { NextResponse } from "next/server";
import {
  appendSocialEarlyAccess,
  loadSocialEarlyAccess,
} from "@/lib/social/store";
import {
  SOCIAL_CATEGORIES,
  SOCIAL_COLLAB_TYPES,
  SOCIAL_DEFAULT_STATUS,
  SOCIAL_FOLLOWER_RANGES,
  SOCIAL_PAYOUT_BANDS,
  SOCIAL_PLATFORMS,
  type SocialCategory,
  type SocialCollabType,
  type SocialFollowerRange,
  type SocialPayoutBand,
  type SocialPlatform,
} from "@/lib/social/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET/POST /api/social/early-access
 * Creator Circle interest list — local/dev file store or ephemeral memory.
 * New submissions default to status Submitted.
 * No Upstash · no payment · not production publish.
 */

function isOneOf<T extends string>(value: unknown, list: readonly T[]): value is T {
  return typeof value === "string" && (list as readonly string[]).includes(value);
}

function trimStr(v: unknown, max = 200): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export async function GET() {
  try {
    const result = await loadSocialEarlyAccess();
    return NextResponse.json({
      meta: result.meta,
      count: result.state.entries.length,
      // Do not leak full contact list on public GET — count + honesty only
    });
  } catch (err) {
    console.error("[social] loadSocialEarlyAccess", err);
    return NextResponse.json(
      { error: "Failed to load early-access store.", code: "store_error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const name = trimStr(raw.name, 120);
  const email = trimStr(raw.email, 160);
  const country = trimStr(raw.country, 120);
  const handle = trimStr(raw.handle, 120);
  const portfolioLink = trimStr(raw.portfolioLink, 500);
  const notes = trimStr(raw.notes, 1000);

  if (!name || !email || !country || !handle) {
    return NextResponse.json(
      {
        error: "name, email, country, and handle are required.",
        code: "validation",
      },
      { status: 400 },
    );
  }

  if (!email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required.", code: "validation" },
      { status: 400 },
    );
  }

  if (!isOneOf(raw.platform, SOCIAL_PLATFORMS)) {
    return NextResponse.json({ error: "Invalid platform.", code: "validation" }, { status: 400 });
  }
  if (!isOneOf(raw.beautyCategory, SOCIAL_CATEGORIES)) {
    return NextResponse.json(
      { error: "Invalid beautyCategory.", code: "validation" },
      { status: 400 },
    );
  }
  if (!isOneOf(raw.followerRange, SOCIAL_FOLLOWER_RANGES)) {
    return NextResponse.json(
      { error: "Invalid followerRange.", code: "validation" },
      { status: 400 },
    );
  }
  if (!isOneOf(raw.preferredCollabType, SOCIAL_COLLAB_TYPES)) {
    return NextResponse.json(
      { error: "Invalid preferredCollabType.", code: "validation" },
      { status: 400 },
    );
  }
  if (!isOneOf(raw.preferredPayoutBand, SOCIAL_PAYOUT_BANDS)) {
    return NextResponse.json(
      { error: "Invalid preferredPayoutBand.", code: "validation" },
      { status: 400 },
    );
  }

  try {
    const result = await appendSocialEarlyAccess({
      name,
      email,
      country,
      platform: raw.platform as SocialPlatform,
      handle,
      followerRange: raw.followerRange as SocialFollowerRange,
      beautyCategory: raw.beautyCategory as SocialCategory,
      preferredCollabType: raw.preferredCollabType as SocialCollabType,
      preferredPayoutBand: raw.preferredPayoutBand as SocialPayoutBand,
      portfolioLink,
      notes,
      status: SOCIAL_DEFAULT_STATUS,
    });
    return NextResponse.json({
      ok: true,
      id: result.entry.id,
      status: result.entry.status,
      meta: result.meta,
    });
  } catch (err) {
    console.error("[social] appendSocialEarlyAccess", err);
    return NextResponse.json(
      { error: "Failed to save early-access entry.", code: "store_error" },
      { status: 500 },
    );
  }
}
