import { NextResponse } from "next/server";

import { verifyDeskPassword } from "@/lib/deskAccess";

import {

  isFamilyAskAgentKey,

  type FamilyAskAgentKey,

} from "@/lib/familyAsk";

import { checkGorGorRateLimit, getClientIp } from "@/lib/gorGorChatRateLimit";

import {

  loadMinionChatThread,

  runMinionChatBox,

} from "@/lib/minion/chatBox";

import { isMinionRelayReady } from "@/lib/minion/relay";

import { listRecentRelayMessages } from "@/lib/minion/relayPersist";

import type { RelayReviewStatus } from "@/lib/minion/types";



export const runtime = "nodejs";

export const dynamic = "force-dynamic";



const REVIEW_STATUSES = new Set<RelayReviewStatus>([

  "PENDING",

  "GOR_GOR_REVIEW",

  "PASS",

  "HOLD",

  "APPROVED",

  "REJECTED",

]);



/**

 * POST /api/minion/chat

 * Minion Chat Box send — Kieran message → verbatim minion report → Simpee →

 * family seats (each sees prior board) → all Message rows share parent_id.

 *

 * Body: {

 *   message: string,

 *   password?: string,

 *   seats?: ("kura"|"gorgor"|"senti"|"agent-r")[],

 *   persistOnly?: boolean,

 *   reviewStatus?: RelayReviewStatus

 * }

 */

export async function POST(request: Request) {

  const ip = getClientIp(request);

  const limit = checkGorGorRateLimit(ip, {
    host: request.headers.get("host"),
  });

  if (!limit.ok) {

    return NextResponse.json(

      {

        error: "Too many Minion Chat requests. Try again in a few minutes.",

        code: "rate_limited",

      },

      {

        status: 429,

        headers: limit.retryAfterSec

          ? { "Retry-After": String(limit.retryAfterSec) }

          : undefined,

      },

    );

  }



  let body: unknown;

  try {

    body = await request.json();

  } catch {

    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });

  }



  const raw = body as {

    message?: unknown;

    password?: unknown;

    seats?: unknown;

    persistOnly?: unknown;

    reviewStatus?: unknown;

  };



  const access = verifyDeskPassword(raw.password);

  if (!access.ok) {

    return NextResponse.json(

      { error: access.error, code: "unauthorized" },

      { status: access.status },

    );

  }



  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  if (!message || message.length > 8000) {

    return NextResponse.json(

      { error: "Message is required (max 8000 characters)." },

      { status: 400 },

    );

  }



  let seats: FamilyAskAgentKey[] | undefined;

  if (Array.isArray(raw.seats)) {

    seats = [];

    for (const s of raw.seats) {

      if (!isFamilyAskAgentKey(s)) {

        return NextResponse.json(

          {

            error:

              'Invalid seats. Use "kura" | "gorgor" | "senti" | "agent-r".',

          },

          { status: 400 },

        );

      }

      seats.push(s);

    }

  }



  const reviewStatus =

    typeof raw.reviewStatus === "string" &&

    REVIEW_STATUSES.has(raw.reviewStatus as RelayReviewStatus)

      ? (raw.reviewStatus as RelayReviewStatus)

      : undefined;



  const ready = isMinionRelayReady();

  if (!ready.minion) {

    return NextResponse.json(

      {

        error:

          "Minion Chat not connected. Add K_MINION_API_KEY on the server (.env.local / Vercel).",

        code: "not_configured",

      },

      { status: 503 },

    );

  }



  try {

    const result = await runMinionChatBox({

      message,

      seats,

      persistOnly: Boolean(raw.persistOnly),

      reviewStatus,

    });



    return NextResponse.json({

      ...result,

      passwordRequired: access.passwordRequired,

      ready,

      note: "Minion reports only (verbatim). Family seats post into the same Message thread. GOR_GOR_REVIEW.",

    });

  } catch {

    return NextResponse.json(

      { error: "Minion Chat Box failed unexpectedly.", code: "unknown" },

      { status: 500 },

    );

  }

}



/**

 * GET /api/minion/chat?root_id=… — load one shared thread as bubbles.

 * GET /api/minion/chat — readiness + recent Message peek (no secrets).

 */

export async function GET(request: Request) {

  const ready = isMinionRelayReady();

  const url = new URL(request.url);

  const rootId = url.searchParams.get("root_id")?.trim() || "";



  if (!ready.minion) {

    return NextResponse.json({

      ok: false,

      mode: "minion_chat_box",

      app_id: "6a5f20ace942aedd542584a2",

      entity: "Message",

      env: "K_MINION_API_KEY",

      ready,

      error: "Minion Chat not connected.",

      code: "not_configured",

    });

  }



  if (rootId) {

    try {

      const thread = await loadMinionChatThread(rootId);

      return NextResponse.json({

        ...thread,

        mode: "minion_chat_box",

        app_id: "6a5f20ace942aedd542584a2",

        entity: "Message",

        ready,

        note: "Shared board via Message parent_id chain. Superagents do not share private silos — this thread is the co-visible board.",

      });

    } catch {

      return NextResponse.json(

        { error: "Could not load thread.", code: "load_failed" },

        { status: 502 },

      );

    }

  }



  try {

    const recent = await listRecentRelayMessages(24);

    const roots = recent

      .filter((m) => m.message_type === "kieran_message")

      .slice(0, 8)

      .map((m) => ({

        id: m.id,

        preview: String(m.content || "").slice(0, 120),

        created_date: m.created_date,

      }));



    return NextResponse.json({

      ok: true,

      mode: "minion_chat_box",

      app_id: "6a5f20ace942aedd542584a2",

      entity: "Message",

      env: "K_MINION_API_KEY",

      ready,

      recent_roots: roots,

      note: "Open Desk Family → Minion Chat Box. Pass ?root_id= to load a thread.",

    });

  } catch {

    return NextResponse.json({

      ok: true,

      mode: "minion_chat_box",

      app_id: "6a5f20ace942aedd542584a2",

      entity: "Message",

      ready,

      recent_roots: [],

      warnings: ["Could not list recent messages."],

    });

  }

}


