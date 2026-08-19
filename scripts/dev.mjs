/**
 * Shortkey local dev — always starts from this repo (not the locked shell cwd).
 *
 * App Control blocks @next/swc-win32-x64-msvc here, so we force wasm SWC.
 * WASM can wedge later (TCP accept, 0 bytes / ERR_CONNECTION_RESET).
 * Watchdog only auto-restarts AFTER the first successful health check
 * (never during cold boot). Restart only kills THIS surface's child —
 * never siblings on other ports.
 *
 * Surfaces (LOCKED — Aug 2026 + Maya 3008):
 *   npm run locals:dev  — Beauty/Family/Studio/Social (scripts/boot-locals.mjs) — does NOT boot Maya
 *   npm run dev         — Beauty public on :3005 (default)
 *   npm run family:dev  — Family Table on :3002 (SHORTKEY_SURFACE=family)
 *   npm run studio:dev  — DNA Control Room on :3003 (SHORTKEY_SURFACE=studio)
 *   npm run social:dev  — Creator Early Access on :3004 (SHORTKEY_SURFACE=social)
 *   npm run maya:dev    — Maya Editorial Lab on :3008 (SHORTKEY_SURFACE=maya) — isolated
 *   npm run editorial:workbench — Editorial translate console on :3009 (static · not Next)
 *   npm run dev:direction-a — Compare Direction A on :3006 (static)
 *   npm run dev:direction-b — Compare Direction B on :3007 (static)
 *
 * Never bind 3000 — that port belongs to other apps (Sky).
 * :3001 is NOT Beauty — often stale / avoid. Beauty = :3005.
 * :3008 = Maya magazine / editorial isolation (stability) — separate from Beauty.
 * Host: -H :: so both 127.0.0.1 and localhost work on this Windows machine.
 * distDir: per-surface via next.config.ts (.next-beauty / .next-family / … / .next-maya).
 */

import { spawn, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  killShortkeySurface,
  probeHttp,
  resolveNodeExecutable,
} from "./dev-runtime.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const nodeBin = resolveNodeExecutable();

/** Dual-stack bind — same as boot-locals / boot-social. */
const HOST_FLAG = "::";

const isFamily =
  process.argv.includes("--family") ||
  process.env.SHORTKEY_SURFACE === "family";

const isStudio =
  process.argv.includes("--studio") ||
  process.env.SHORTKEY_SURFACE === "studio";

const isSocial =
  process.argv.includes("--social") ||
  process.env.SHORTKEY_SURFACE === "social";

const isMaya =
  process.argv.includes("--maya") ||
  process.env.SHORTKEY_SURFACE === "maya";

const surface = isMaya
  ? "maya"
  : isSocial
    ? "social"
    : isStudio
      ? "studio"
      : isFamily
        ? "family"
        : "beauty";

// Beauty :3005 · Family :3002 · Studio :3003 · Social :3004 · Maya :3008
const port =
  Number(process.env.PORT) ||
  (isMaya
    ? 3008
    : isSocial
      ? 3004
      : isStudio
        ? 3003
        : isFamily
          ? 3002
          : 3005);

const wasmDir = path.join(root, "node_modules", "@next", "swc-wasm-nodejs");

const HEALTH_MS = 25_000;
const HEALTH_TIMEOUT_MS = 10_000;
const FAIL_BEFORE_RESTART = 2;

const healthPath = isMaya
  ? "/internal/maya"
  : isSocial
    ? "/social"
    : isStudio
      ? "/internal/studio"
      : isFamily
        ? "/internal/family-table"
        : "/";

const surfaceArg = isFamily
  ? "--family"
  : isStudio
    ? "--studio"
    : isSocial
      ? "--social"
      : isMaya
        ? "--maya"
        : null;

let child = null;
let fails = 0;
let everHealthy = false;
let intentionalRestart = false;
let shuttingDown = false;
let healthTimer = null;

function buildEnv() {
  const env = {
    ...process.env,
    PORT: String(port),
    SHORTKEY_SURFACE: surface,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, "--use-system-ca"]
      .filter(Boolean)
      .join(" "),
  };
  if (existsSync(wasmDir)) {
    env.NEXT_TEST_WASM_DIR = wasmDir;
  }
  return env;
}

function cleanupBeforeStart() {
  killShortkeySurface(port, surfaceArg, (msg) => console.log(`[dev] ${msg}`));
}

function startServer() {
  cleanupBeforeStart();
  fails = 0;
  everHealthy = false;
  intentionalRestart = false;

  console.log(`[dev] Node: ${nodeBin}`);
  console.log(
    existsSync(wasmDir)
      ? "SWC: wasm (native blocked by App Control on this machine)"
      : "SWC: default Next resolver",
  );
  if (existsSync(wasmDir)) {
    console.log(
      "[dev] wasm cold boot — expect ~2 min before Ready. Wait for HTTP 200 before opening browser.",
    );
  }

  if (isMaya) {
    console.log(
      `Starting Maya Editorial Lab (SHORTKEY_SURFACE=maya) at http://127.0.0.1:${port}/internal/maya`,
    );
  } else if (isSocial) {
    console.log(
      `Starting Creator Early Access (SHORTKEY_SURFACE=social) at http://127.0.0.1:${port}/social`,
    );
  } else if (isStudio) {
    console.log(
      `Starting Studio DNA Control Room (SHORTKEY_SURFACE=studio) at http://127.0.0.1:${port}/internal/studio`,
    );
  } else if (isFamily) {
    console.log(
      `Starting Family Table (SHORTKEY_SURFACE=family) at http://127.0.0.1:${port}/internal/family-table`,
    );
  } else {
    console.log(
      `Starting Beauty (SHORTKEY_SURFACE=beauty) at http://127.0.0.1:${port}/`,
    );
  }

  child = spawn(
    nodeBin,
    [nextBin, "dev", "-p", String(port), "-H", HOST_FLAG],
    {
      cwd: root,
      env: buildEnv(),
      stdio: "inherit",
      windowsHide: true,
    },
  );

  child.on("exit", (code, signal) => {
    const wasIntentional = intentionalRestart;
    child = null;
    intentionalRestart = false;

    if (shuttingDown) {
      process.exit(code ?? 0);
      return;
    }
    if (wasIntentional) {
      return;
    }

    console.warn(
      `\n[dev] Next.js exited (code=${code}, signal=${signal}). Restarting in 2s...\n`,
    );
    setTimeout(startServer, 2000);
  });
}

async function healthTick() {
  if (!child || shuttingDown) return;
  const ok = await probeHttp(port, healthPath, HEALTH_TIMEOUT_MS);
  if (ok) {
    if (!everHealthy) console.log("[dev] health ok (HTTP 200) — hang watchdog armed");
    else if (fails > 0) console.log("[dev] health recovered");
    everHealthy = true;
    fails = 0;
    return;
  }

  if (!everHealthy) return;

  fails += 1;
  console.warn(
    `[dev] health check failed (${fails}/${FAIL_BEFORE_RESTART}) — server hung`,
  );
  if (fails < FAIL_BEFORE_RESTART) return;

  console.warn("[dev] restarting hung Next.js (this port only)...");
  fails = 0;
  everHealthy = false;
  intentionalRestart = true;
  const proc = child;
  child = null;
  if (proc?.pid) {
    try {
      execSync(`taskkill /PID ${proc.pid} /T /F`, { stdio: "ignore" });
    } catch {
      /* ignore */
    }
  }
  setTimeout(startServer, 1000);
}

function shutdown() {
  shuttingDown = true;
  if (healthTimer) clearInterval(healthTimer);
  if (child?.pid) {
    try {
      execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: "ignore" });
    } catch {
      /* ignore */
    }
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
healthTimer = setInterval(healthTick, HEALTH_MS);
