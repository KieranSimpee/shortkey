/**
 * Minion Chat Box reliability bench (Beauty :3005).
 *
 * Suites:
 *   1) Preset Q&A — readiness, HI persist (no live dispatch), platform persist,
 *      verbatim match, co_visible reload. Default 100 runs (fast infra path).
 *   2) Demo variety — rotating founder-style prompts. Default 100 persist demos
 *      + optional live council rounds (rate-limit aware).
 *
 * Usage:
 *   npm run minion:bench
 *   node scripts/bench-minion-chat.mjs --preset=100 --demo=100 --live=20
 *   node scripts/bench-minion-chat.mjs --preset=20 --demo=10 --live=0
 *
 * Does not print API keys. Writes JSON + CSV under scripts/minion-bench/results/.
 */
import {
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  appendFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const resultsDir = join(root, "scripts", "minion-bench", "results");
const BOOKMARK = "http://localhost:3005/desk/#family";
/** Prefer env override; default local Beauty Minion path. Production INTERNAL: https://shortkey.beauty/desk/#family */

function argNum(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  const n = Number(hit.split("=")[1]);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

const PRESET_N = argNum("preset", 100);
const DEMO_N = argNum("demo", 100);
const LIVE_N = argNum("live", 20);
const DELAY_MS = argNum("delay-ms", 250);
const LIVE_DELAY_MS = argNum("live-delay-ms", 5000);

function loadEnvLocal() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    const key = trimmed.slice(0, eq).trim();
    if (!(key in process.env) || process.env[key] === "") {
      process.env[key] = val;
    }
  }
}

loadEnvLocal();

const base =
  process.env.MINION_CHAT_BASE_URL?.trim() || "http://127.0.0.1:3005";
const password =
  process.env.DESK_ACCESS_PASSWORD?.trim() ||
  process.env.SITE_ACCESS_PASSWORD?.trim() ||
  "";

mkdirSync(resultsDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = join(resultsDir, `bench-${stamp}.json`);
const csvPath = join(resultsDir, `bench-${stamp}.csv`);
const summaryPath = join(resultsDir, `bench-${stamp}-summary.json`);

appendFileSync(
  csvPath,
  "suite,run,id,ok,http_status,ms,error,relay_root_id,review_status,verbatim,co_visible,seats_ok,live_dispatch\n",
);

const report = {
  started_at: new Date().toISOString(),
  bookmark: BOOKMARK,
  base,
  config: { PRESET_N, DEMO_N, LIVE_N, DELAY_MS, LIVE_DELAY_MS },
  suites: { preset: [], demo: [], live: [] },
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function recordRow(suite, run, id, result) {
  const row = {
    suite,
    run,
    id,
    ok: Boolean(result.ok),
    http_status: result.http_status ?? null,
    ms: result.ms ?? null,
    error: result.error || "",
    relay_root_id: result.relay_root_id || "",
    review_status: result.review_status || "",
    verbatim: result.verbatim ?? null,
    co_visible: result.co_visible ?? null,
    seats_ok: result.seats_ok ?? null,
    live_dispatch: result.live_dispatch ?? null,
    details: result.details || null,
  };
  report.suites[suite].push(row);
  appendFileSync(
    csvPath,
    [
      suite,
      run,
      csvEscape(id),
      row.ok ? 1 : 0,
      row.http_status ?? "",
      row.ms ?? "",
      csvEscape(row.error),
      csvEscape(row.relay_root_id),
      csvEscape(row.review_status),
      row.verbatim === null ? "" : row.verbatim ? 1 : 0,
      row.co_visible === null ? "" : row.co_visible ? 1 : 0,
      row.seats_ok === null ? "" : row.seats_ok ? 1 : 0,
      row.live_dispatch === null ? "" : row.live_dispatch ? 1 : 0,
    ].join(",") + "\n",
  );
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  return row;
}

async function fetchJson(url, opts = {}) {
  const t0 = Date.now();
  const timeoutMs = opts.timeoutMs ?? (opts.method === "POST" ? 180_000 : 30_000);
  const { timeoutMs: _drop, ...fetchOpts } = opts;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(url, { ...fetchOpts, signal: controller.signal });
  } catch (err) {
    const aborted = err && (err.name === "AbortError" || /aborted/i.test(String(err)));
    return {
      ok: false,
      http_status: 0,
      ms: Date.now() - t0,
      error: aborted
        ? `timeout_after_${timeoutMs}ms`
        : `network: ${err instanceof Error ? err.message : String(err)}`,
      data: null,
    };
  } finally {
    clearTimeout(timer);
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    return {
      ok: false,
      http_status: res.status,
      ms: Date.now() - t0,
      error: `non-json: ${text.slice(0, 160)}`,
      data: null,
    };
  }
  return {
    ok: res.ok,
    http_status: res.status,
    ms: Date.now() - t0,
    error: res.ok ? "" : data?.error || data?.code || `HTTP ${res.status}`,
    data,
  };
}

async function postChat({ message, persistOnly, seats, timeoutMs }) {
  return fetchJson(`${base}/api/minion/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      password: password || undefined,
      persistOnly: Boolean(persistOnly),
      seats,
    }),
    timeoutMs: timeoutMs ?? (persistOnly ? 60_000 : 180_000),
  });
}

async function getReady() {
  return fetchJson(`${base}/api/minion/chat`, { method: "GET" });
}

async function getThread(rootId) {
  return fetchJson(
    `${base}/api/minion/chat?root_id=${encodeURIComponent(rootId)}`,
    { method: "GET" },
  );
}

/** Direct Base44 Message create — persist + verbatim without full council HTTP. */
let sdkClient = null;
async function getSdk() {
  if (sdkClient) return sdkClient;
  const key =
    process.env.K_MINION_API_KEY?.trim() || process.env.KMINION?.trim() || "";
  if (!key) return null;
  const { createClient } = await import(
    pathToFileURL(join(root, "node_modules", "@base44", "sdk", "dist", "index.js"))
      .href
  );
  sdkClient = createClient({
    appId: "6a5f20ace942aedd542584a2",
    headers: { api_key: key },
  });
  return sdkClient;
}

async function sdkVerbatimCheck(message) {
  const t0 = Date.now();
  const base44 = await getSdk();
  if (!base44) {
    return {
      ok: false,
      ms: Date.now() - t0,
      error: "K_MINION_API_KEY missing",
      verbatim: false,
    };
  }
  try {
    const kieran = await base44.entities.Message.create({
      sender_name: "Kieran",
      recipient_name: "K Minion",
      recipient_id: "6a5f20afe942aedd542584a4",
      content: message,
      message_type: "kieran_message",
      workflow_steps: JSON.stringify({
        event: "kieran_message",
        at: new Date().toISOString(),
        bench: true,
        review_status: "GOR_GOR_REVIEW",
      }),
      parent_id: null,
    });
    const hop = await base44.entities.Message.create({
      sender_name: "K Minion",
      recipient_name: "Simpee",
      recipient_id: null,
      content: message,
      message_type: "minion_hop",
      workflow_steps: JSON.stringify({
        event: "minion_hop",
        at: new Date().toISOString(),
        role: "report",
        reported_message: message,
        kieran_message_id: kieran.id,
        bench: true,
        review_status: "GOR_GOR_REVIEW",
      }),
      parent_id: kieran.id,
    });
    const verbatim = hop.content === message && kieran.content === message;
    return {
      ok: verbatim,
      ms: Date.now() - t0,
      error: verbatim ? "" : "verbatim_mismatch",
      verbatim,
      relay_root_id: kieran.id,
      review_status: "GOR_GOR_REVIEW",
      live_dispatch: false,
    };
  } catch (err) {
    return {
      ok: false,
      ms: Date.now() - t0,
      error: err instanceof Error ? err.message.slice(0, 200) : String(err),
      verbatim: false,
    };
  }
}

function isPlaceholderSeatReply(reply) {
  const t = String(reply || "");
  return (
    t.includes("(persistOnly)") ||
    t.includes("(stub)") ||
    t.includes("placeholder")
  );
}

function evalPersistChat(message, res, threadReload) {
  const data = res.data || {};
  const verbatim =
    data.kieran_message === message && data.reported_message === message;
  const seats = Array.isArray(data.seats) ? data.seats : [];
  const seatsPersisted = seats.length >= 4 && seats.every((s) => s.message_id);
  const seatsOk = seats.length >= 4 && seats.every((s) => s.ok);
  const noLive = seats.every((s) => isPlaceholderSeatReply(s.reply));
  const thread = threadReload?.data?.thread || data.thread || [];
  const coVisible = Array.isArray(thread) && thread.length >= 3;
  const review = data.review_status === "GOR_GOR_REVIEW";
  const ok =
    res.ok &&
    data.ok !== false &&
    Boolean(data.relay_root_id) &&
    verbatim &&
    review &&
    seatsPersisted &&
    coVisible;
  return {
    ok,
    http_status: res.http_status,
    ms: res.ms,
    error: ok
      ? ""
      : [
          res.error,
          !verbatim ? "verbatim_fail" : "",
          !review ? "review_not_gorgor" : "",
          !seatsPersisted ? "seats_not_persisted" : "",
          !coVisible ? "not_co_visible" : "",
          data.ok === false ? "api_ok_false" : "",
        ]
          .filter(Boolean)
          .join("|"),
    relay_root_id: data.relay_root_id || "",
    review_status: data.review_status || "",
    verbatim,
    co_visible: coVisible,
    seats_ok: seatsOk,
    live_dispatch: !noLive,
    details: {
      seat_count: seats.length,
      thread_len: thread.length,
      warnings: data.warnings || [],
    },
  };
}

function evalLiveChat(message, res, threadReload) {
  const data = res.data || {};
  const verbatim =
    data.kieran_message === message && data.reported_message === message;
  const seats = Array.isArray(data.seats) ? data.seats : [];
  const seatsOk = seats.length >= 1 && seats.every((s) => s.ok);
  const live =
    seats.some((s) => s.ok && !isPlaceholderSeatReply(s.reply)) ||
    (typeof data.simpee_instruction === "string" &&
      !data.simpee_instruction.includes("(persistOnly)"));
  const thread = threadReload?.data?.thread || data.thread || [];
  const coVisible = Array.isArray(thread) && thread.length >= 3;
  const review = data.review_status === "GOR_GOR_REVIEW";
  const ok =
    res.ok &&
    Boolean(data.relay_root_id) &&
    verbatim &&
    review &&
    seatsOk &&
    live &&
    coVisible;
  return {
    ok,
    http_status: res.http_status,
    ms: res.ms,
    error: ok
      ? ""
      : [
          res.error,
          !verbatim ? "verbatim_fail" : "",
          !review ? "review_not_gorgor" : "",
          !seatsOk ? "seats_not_ok" : "",
          !live ? "no_live_family_reply" : "",
          !coVisible ? "not_co_visible" : "",
        ]
          .filter(Boolean)
          .join("|"),
    relay_root_id: data.relay_root_id || "",
    review_status: data.review_status || "",
    verbatim,
    co_visible: coVisible,
    seats_ok: seatsOk,
    live_dispatch: live,
    details: {
      seat_count: seats.length,
      seats_preview: seats.map((s) => ({
        seat: s.seat,
        ok: s.ok,
        preview: String(s.reply || "").slice(0, 80),
      })),
      warnings: data.warnings || [],
    },
  };
}

const PRESET_CASES = [
  {
    id: "ready_get",
    kind: "ready",
  },
  {
    id: "hi_persist_no_dispatch",
    kind: "persist",
    message: "HI",
  },
  {
    id: "platform_status_persist",
    kind: "persist",
    message:
      "Platform development status — each seat update your area in this Minion Chat Box. GOR_GOR_REVIEW.",
  },
  {
    id: "sdk_verbatim",
    kind: "sdk",
    message: "Bench verbatim lock — Minion reports only. GOR_GOR_REVIEW.",
  },
];

const DEMO_PROMPTS = [
  "Platform request: confirm Minion Chat Box is the communication path on Beauty :3005. GOR_GOR_REVIEW.",
  "HI ALL — family check-in on shared Minion board. GOR_GOR_REVIEW.",
  "Creative status — Senti / Creative Room: what is ready vs still GOR_GOR_REVIEW?",
  "Records ask — Agent R: what beauty/intelligence records path is live for Desk?",
  "Brand design pulse — Kura: Desk Minion Chat Box look/feel for founder platform requests.",
  "Gatekeeper note — Simpee: protect DNA; no fake creators; Banuba TINT ≠ DeepSeek.",
  "Studio vs Beauty ports reminder — platform request goes through Desk Minion Chat on :3005.",
  "Family HALO style ask: each seat one short honest update only. GOR_GOR_REVIEW.",
];

async function runPersistCase(message) {
  const res = await postChat({ message, persistOnly: true });
  if (!res.ok || !res.data?.relay_root_id) {
    return {
      ok: false,
      http_status: res.http_status,
      ms: res.ms,
      error: res.error || "post_failed",
      relay_root_id: res.data?.relay_root_id || "",
      review_status: res.data?.review_status || "",
      verbatim: false,
      co_visible: false,
      seats_ok: false,
      live_dispatch: false,
    };
  }
  const reload = await getThread(res.data.relay_root_id);
  return evalPersistChat(message, res, reload);
}

async function runPresetOnce(i) {
  const spec = PRESET_CASES[i % PRESET_CASES.length];
  if (spec.kind === "ready") {
    const res = await getReady();
    const ready = Boolean(res.data?.ready?.minion);
    const ok = res.ok && res.http_status === 200 && ready;
    return recordRow("preset", i + 1, spec.id, {
      ok,
      http_status: res.http_status,
      ms: res.ms,
      error: ok ? "" : res.error || "not_ready",
      review_status: "GOR_GOR_REVIEW",
      live_dispatch: false,
      details: { ready: res.data?.ready || null },
    });
  }
  if (spec.kind === "sdk") {
    const msg = `${spec.message} [#${i + 1}]`;
    const r = await sdkVerbatimCheck(msg);
    return recordRow("preset", i + 1, spec.id, r);
  }
  // persist
  const msg = `${spec.message} [#${i + 1}]`;
  const r = await runPersistCase(msg);
  if (spec.id === "hi_persist_no_dispatch" && r.ok && r.live_dispatch) {
    r.ok = false;
    r.error = (r.error ? r.error + "|" : "") + "unexpected_live_dispatch";
  }
  return recordRow("preset", i + 1, spec.id, r);
}

async function runDemoPersistOnce(i) {
  const prompt = DEMO_PROMPTS[i % DEMO_PROMPTS.length];
  const msg = `${prompt} [demo #${i + 1}]`;
  const r = await runPersistCase(msg);
  return recordRow("demo", i + 1, `demo_persist_${(i % DEMO_PROMPTS.length) + 1}`, r);
}

async function runLiveOnce(i) {
  const prompt = DEMO_PROMPTS[i % DEMO_PROMPTS.length];
  const msg = `${prompt} [live #${i + 1}]`;
  // Live council: fewer seats to reduce rate pressure while still proving family path.
  const seats =
    i % 2 === 0
      ? ["gorgor"]
      : ["kura", "gorgor"];
  const res = await postChat({ message: msg, persistOnly: false, seats });
  if (res.http_status === 429) {
    return recordRow("live", i + 1, `live_${seats.join("+")}`, {
      ok: false,
      http_status: 429,
      ms: res.ms,
      error: "rate_limited",
      live_dispatch: false,
    });
  }
  if (!res.ok || !res.data?.relay_root_id) {
    return recordRow("live", i + 1, `live_${seats.join("+")}`, {
      ok: false,
      http_status: res.http_status,
      ms: res.ms,
      error: res.error || "post_failed",
      relay_root_id: res.data?.relay_root_id || "",
      review_status: res.data?.review_status || "",
      live_dispatch: false,
      details: { warnings: res.data?.warnings || [] },
    });
  }
  const reload = await getThread(res.data.relay_root_id);
  const evaluated = evalLiveChat(msg, res, reload);
  return recordRow("live", i + 1, `live_${seats.join("+")}`, evaluated);
}

function summarize(rows) {
  const total = rows.length;
  const pass = rows.filter((r) => r.ok).length;
  const fail = total - pass;
  const byError = {};
  for (const r of rows.filter((x) => !x.ok)) {
    const key = r.error || "unknown";
    byError[key] = (byError[key] || 0) + 1;
  }
  return {
    total,
    pass,
    fail,
    success_rate:
      total === 0 ? null : `${((pass / total) * 100).toFixed(1)}%`,
    failures_by_error: byError,
  };
}

console.log("Minion Chat Box bench");
console.log("bookmark=", BOOKMARK);
console.log("base=", base);
console.log(
  `config preset=${PRESET_N} demo=${DEMO_N} live=${LIVE_N} delay=${DELAY_MS}ms liveDelay=${LIVE_DELAY_MS}ms`,
);

// Warm readiness
{
  const warm = await getReady();
  if (!warm.ok) {
    console.error("FAIL: Beauty :3005 Minion Chat not reachable.");
    console.error("Start with: npm run dev");
    console.error(warm.error);
    process.exit(1);
  }
  console.log(
    "ready=",
    JSON.stringify(warm.data?.ready || {}),
    "http=",
    warm.http_status,
  );
}

console.log("\n=== Preset Q&A ===");
for (let i = 0; i < PRESET_N; i++) {
  const row = await runPresetOnce(i);
  const mark = row.ok ? "PASS" : "FAIL";
  console.log(
    `[preset ${i + 1}/${PRESET_N}] ${mark} ${row.id} ${row.ms}ms ${row.error || ""}`.trim(),
  );
  if (DELAY_MS) await sleep(DELAY_MS);
}

console.log("\n=== Demo suite (persist path) ===");
for (let i = 0; i < DEMO_N; i++) {
  const row = await runDemoPersistOnce(i);
  const mark = row.ok ? "PASS" : "FAIL";
  console.log(
    `[demo ${i + 1}/${DEMO_N}] ${mark} ${row.id} ${row.ms}ms ${row.error || ""}`.trim(),
  );
  if (DELAY_MS) await sleep(DELAY_MS);
}

console.log("\n=== Live family council (rate-limit aware) ===");
let liveStopReason = "";
let consecutiveFail = 0;
for (let i = 0; i < LIVE_N; i++) {
  const row = await runLiveOnce(i);
  const mark = row.ok ? "PASS" : "FAIL";
  console.log(
    `[live ${i + 1}/${LIVE_N}] ${mark} ${row.id} ${row.ms}ms ${row.error || ""}`.trim(),
  );
  if (row.ok) consecutiveFail = 0;
  else consecutiveFail += 1;
  if (row.http_status === 429 || /rate|429|Too many/i.test(row.error || "")) {
    liveStopReason = "rate_limited";
    console.log("Stopping live suite early: rate limited.");
    break;
  }
  if (consecutiveFail >= 5) {
    liveStopReason = "consecutive_failures";
    console.log("Stopping live suite early: 5 consecutive failures.");
    break;
  }
  if (LIVE_DELAY_MS) await sleep(LIVE_DELAY_MS);
}

report.finished_at = new Date().toISOString();
report.live_stop_reason = liveStopReason || null;
report.summary = {
  bookmark: BOOKMARK,
  preset: summarize(report.suites.preset),
  demo: summarize(report.suites.demo),
  live: {
    ...summarize(report.suites.live),
    targeted: LIVE_N,
    attempted: report.suites.live.length,
    stop_reason: liveStopReason || null,
  },
};

writeFileSync(summaryPath, JSON.stringify(report.summary, null, 2));
writeFileSync(jsonPath, JSON.stringify(report, null, 2));

console.log("\n=== SUMMARY ===");
console.log("bookmark=", BOOKMARK);
console.log("preset=", JSON.stringify(report.summary.preset));
console.log("demo=", JSON.stringify(report.summary.demo));
console.log("live=", JSON.stringify(report.summary.live));
console.log("json=", jsonPath);
console.log("csv=", csvPath);
console.log("summary=", summaryPath);

const presetOk = report.summary.preset.fail === 0;
const demoOk = report.summary.demo.fail === 0;
process.exit(presetOk && demoOk ? 0 : 2);
