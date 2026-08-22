/**
 * GET  /api/studio/discovery-curation
 * POST — hide | restore | add | upload | workflow | set-meta | set-interview | add-game | update-workflow
 *
 * ALWAYS TO TRUE: interview body / game brief = founder paste only.
 */

import { writeFileSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  SEASON_OPTIONS,
  assetKey,
  canWriteCuration,
  ensureUploadDir,
  getMeta,
  isAllowedPublicUrl,
  loadCuration,
  pushWorkflow,
  resolveInterviewStory,
  saveCuration,
  uploadPublicUrl,
  upsertMeta,
  type CurationAdded,
  type SeasonId,
  type WorkflowKind,
  type WorkflowStatus,
} from "@/lib/studio/discoveryCuration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function deny() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Curation writes only on localhost or Studio surface (:3003). Open discovery on 127.0.0.1.",
    },
    { status: 403 },
  );
}

export async function GET(request: Request) {
  const curation = loadCuration();
  const url = new URL(request.url);
  const packId = url.searchParams.get("packId")?.trim() || "";
  const file = url.searchParams.get("file")?.trim() || "";
  if (packId && file) {
    return NextResponse.json({
      ok: true,
      curation,
      seasons: SEASON_OPTIONS,
      meta: getMeta(curation, packId, file) || null,
      interview: resolveInterviewStory(curation, packId, file),
    });
  }
  return NextResponse.json({ ok: true, curation, seasons: SEASON_OPTIONS });
}

export async function POST(request: Request) {
  if (!canWriteCuration(request)) return deny();

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const action = String(form.get("action") || "upload");
    if (action !== "upload") {
      return NextResponse.json({ ok: false, error: "Use JSON for non-upload actions." }, { status: 400 });
    }
    const packId = String(form.get("packId") || "").trim();
    const reason = String(form.get("reason") || "Founder add").trim() || "Founder add";
    const file = form.get("file");
    if (!packId || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "packId + file required" }, { status: 400 });
    }
    const rawName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (!/\.(png|jpe?g|webp|gif|mp4|mp3|wav)$/i.test(rawName)) {
      return NextResponse.json(
        { ok: false, error: "Allowed: png jpg webp gif mp4 mp3 wav" },
        { status: 400 },
      );
    }
    const stamp = Date.now().toString(36);
    const safeName = `${stamp}_${rawName}`;
    const dir = ensureUploadDir();
    writeFileSync(path.join(dir, safeName), Buffer.from(await file.arrayBuffer()));

    const curation = loadCuration();
    const entry: CurationAdded = {
      id: `add_${stamp}`,
      packId,
      file: safeName,
      url: uploadPublicUrl(safeName),
      reason,
      at: new Date().toISOString(),
    };
    curation.added = curation.added.filter(
      (a) => assetKey(a.packId, a.file) !== assetKey(packId, safeName),
    );
    curation.added.push(entry);
    return NextResponse.json({ ok: true, curation: saveCuration(curation), added: entry });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const action = String(body.action || "").trim();
  const curation = loadCuration();

  if (action === "hide") {
    const packId = String(body.packId || "").trim();
    const file = String(body.file || "").trim();
    const note = String(body.note || "Not correct").trim();
    if (!packId || !file) {
      return NextResponse.json({ ok: false, error: "packId + file required" }, { status: 400 });
    }
    const key = assetKey(packId, file);
    curation.removed = curation.removed.filter((r) => assetKey(r.packId, r.file) !== key);
    curation.removed.push({ packId, file, note, at: new Date().toISOString() });
    curation.added = curation.added.filter((a) => assetKey(a.packId, a.file) !== key);
    pushWorkflow(curation, {
      packId,
      file,
      kind: "edit",
      status: "TODO",
      note: `Removed from discovery: ${note}`,
    });
    return NextResponse.json({ ok: true, curation: saveCuration(curation) });
  }

  if (action === "restore") {
    const packId = String(body.packId || "").trim();
    const file = String(body.file || "").trim();
    if (!packId || !file) {
      return NextResponse.json({ ok: false, error: "packId + file required" }, { status: 400 });
    }
    const key = assetKey(packId, file);
    curation.removed = curation.removed.filter((r) => assetKey(r.packId, r.file) !== key);
    return NextResponse.json({ ok: true, curation: saveCuration(curation) });
  }

  if (action === "add") {
    const packId = String(body.packId || "").trim();
    const file = String(body.file || "").trim();
    const url = String(body.url || "").trim();
    const reason = String(body.reason || "Founder add").trim() || "Founder add";
    if (!packId || !file || !url) {
      return NextResponse.json({ ok: false, error: "packId + file + url required" }, { status: 400 });
    }
    if (!isAllowedPublicUrl(url)) {
      return NextResponse.json(
        { ok: false, error: "url must be under /shortkey-assets/ · /magazine-demo/ · /studio-review/ · /logo/" },
        { status: 400 },
      );
    }
    const entry: CurationAdded = {
      id: `add_${Date.now().toString(36)}`,
      packId,
      file,
      url,
      reason,
      at: new Date().toISOString(),
    };
    curation.added = curation.added.filter(
      (a) => assetKey(a.packId, a.file) !== assetKey(packId, file),
    );
    curation.added.push(entry);
    curation.removed = curation.removed.filter(
      (r) => assetKey(r.packId, r.file) !== assetKey(packId, file),
    );
    return NextResponse.json({ ok: true, curation: saveCuration(curation), added: entry });
  }

  if (action === "remove-added") {
    const packId = String(body.packId || "").trim();
    const file = String(body.file || "").trim();
    if (!packId || !file) {
      return NextResponse.json({ ok: false, error: "packId + file required" }, { status: 400 });
    }
    const key = assetKey(packId, file);
    curation.added = curation.added.filter((a) => assetKey(a.packId, a.file) !== key);
    return NextResponse.json({ ok: true, curation: saveCuration(curation) });
  }

  if (action === "workflow") {
    const packId = String(body.packId || "").trim();
    const file = String(body.file || "").trim();
    const kind = String(body.kind || "").trim() as WorkflowKind;
    const note = String(body.note || "").trim();
    const season = String(body.season || "").trim() as SeasonId;
    const allowed: WorkflowKind[] = [
      "edit",
      "redesign",
      "move-season",
      "buy-real-picture",
      "interview-story",
      "add-game",
    ];
    if (!packId || !file || !allowed.includes(kind)) {
      return NextResponse.json(
        { ok: false, error: "packId + file + kind required" },
        { status: 400 },
      );
    }

    if (kind === "move-season") {
      if (!SEASON_OPTIONS.some((s) => s.id === season)) {
        return NextResponse.json({ ok: false, error: "Invalid season" }, { status: 400 });
      }
      upsertMeta(curation, {
        packId,
        file,
        season,
        editNote: note || `Move to ${season}`,
      });
      pushWorkflow(curation, {
        packId,
        file,
        kind,
        season,
        status: "TODO",
        note: note || `Move to ${season}`,
      });
    } else if (kind === "buy-real-picture") {
      upsertMeta(curation, { packId, file, needsRealPhoto: true });
      pushWorkflow(curation, {
        packId,
        file,
        kind,
        status: "AWAITING",
        note: note || "Buy / license real photograph — founder procurement",
      });
    } else if (kind === "redesign") {
      upsertMeta(curation, { packId, file, redesign: true });
      pushWorkflow(curation, {
        packId,
        file,
        kind,
        status: "TODO",
        note: note || "Redesign request — Lovart / Kura lane",
      });
    } else if (kind === "edit") {
      upsertMeta(curation, { packId, file, editNote: note || "Edit requested" });
      pushWorkflow(curation, {
        packId,
        file,
        kind,
        status: "TODO",
        note: note || "Edit requested",
      });
    } else if (kind === "interview-story") {
      const title = String(body.title || "").trim();
      const storyBody = String(body.body || "").trim();
      const source = String(body.source || "").trim();
      upsertMeta(curation, {
        packId,
        file,
        interviewStory: {
          title: title || undefined,
          body: storyBody || undefined,
          source: source || undefined,
        },
      });
      pushWorkflow(curation, {
        packId,
        file,
        kind,
        status: storyBody ? "REVIEW" : "AWAITING",
        note: note || (storyBody ? "Interview story saved" : "Interview story AWAITING founder paste"),
        interviewStory: {
          title: title || undefined,
          body: storyBody || undefined,
          source: source || undefined,
        },
      });
    } else if (kind === "add-game") {
      const name = String(body.gameName || body.name || "").trim() || "Untitled game";
      const brief = String(body.brief || "").trim();
      const gameSeason = (season || "season-01") as SeasonId;
      const gid = `game_${Date.now().toString(36)}`;
      curation.games.unshift({
        id: gid,
        name,
        brief: brief || undefined,
        season: gameSeason,
        status: brief ? "TODO" : "AWAITING",
        at: new Date().toISOString(),
      });
      pushWorkflow(curation, {
        packId,
        file,
        kind,
        season: gameSeason,
        status: brief ? "TODO" : "AWAITING",
        note: note || `New game stub: ${name}`,
        gameStub: { name, brief: brief || undefined },
      });
    }

    return NextResponse.json({
      ok: true,
      curation: saveCuration(curation),
      interview: resolveInterviewStory(curation, packId, file),
    });
  }

  if (action === "set-interview") {
    const packId = String(body.packId || "").trim();
    const file = String(body.file || "").trim();
    const title = String(body.title || "").trim();
    const storyBody = String(body.body || "").trim();
    const source = String(body.source || "").trim();
    if (!packId || !file) {
      return NextResponse.json({ ok: false, error: "packId + file required" }, { status: 400 });
    }
    upsertMeta(curation, {
      packId,
      file,
      interviewStory: {
        title: title || undefined,
        body: storyBody || undefined,
        source: source || undefined,
      },
    });
    return NextResponse.json({
      ok: true,
      curation: saveCuration(curation),
      interview: resolveInterviewStory(curation, packId, file),
    });
  }

  if (action === "update-workflow") {
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim() as WorkflowStatus;
    const allowed: WorkflowStatus[] = ["TODO", "DOING", "REVIEW", "DONE", "AWAITING"];
    if (!id || !allowed.includes(status)) {
      return NextResponse.json({ ok: false, error: "id + status required" }, { status: 400 });
    }
    curation.workflows = curation.workflows.map((w) =>
      w.id === id
        ? { ...w, status, updatedAt: new Date().toISOString(), note: String(body.note || w.note || "") }
        : w,
    );
    return NextResponse.json({ ok: true, curation: saveCuration(curation) });
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        "Unknown action. Use hide | restore | add | remove-added | upload | workflow | set-interview | update-workflow",
    },
    { status: 400 },
  );
}
