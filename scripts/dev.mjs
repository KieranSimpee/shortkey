/**
 * Shortkey local dev — always starts from this repo (not the locked shell cwd).
 *
 * App Control blocks @next/swc-win32-x64-msvc here, so we force wasm SWC.
 * WASM can wedge later (TCP accept, 0 bytes → ERR_CONNECTION_RESET).
 * Watchdog only auto-restarts AFTER the first successful health check
 * (never during cold boot).
 *
 * Surfaces:
 *   npm run dev         → ShortKey public Coming Soon on :3001 (default)
 *   npm run family:dev  → Family Table workbench on :3002 (SHORTKEY_SURFACE=family)
 *   npm run studio:dev  → DNA Control Room on :3003 (SHORTKEY_SURFACE=studio)
 *   npm run social:dev  → Creator Early Access on :3004 (SHORTKEY_SURFACE=social)
 *
 * Never bind 3000 — that port belongs to other apps.
 */

import { spawn, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const isFamily =
  process.argv.includes("--family") ||
  process.env.SHORTKEY_SURFACE === "family";

const isStudio =
  process.argv.includes("--studio") ||
  process.env.SHORTKEY_SURFACE === "studio";

const isSocial =
  process.argv.includes("--social") ||
  process.env.SHORTKEY_SURFACE === "social";

const surface = isSocial
  ? "social"
  : isStudio
    ? "studio"
    : isFamily
      ? "family"
      : "shortkey";

// ShortKey :3001 · Family Table :3002 · Studio :3003 · Social :3004
const port =
  Number(process.env.PORT) ||
  (isSocial ? 3004 : isStudio ? 3003 : isFamily ? 3002 : 3001);

const wasmDir = path.join(root, "node_modules", "@next", "swc-wasm-nodejs");

const HEALTH_MS = 25_000;
const HEALTH_TIMEOUT_MS = 8_000;
const FAIL_BEFORE_RESTART = 2;

const healthPath = isSocial
  ? "/social"
  : isStudio
    ? "/internal/studio"
    : isFamily
      ? "/internal/family-table"
      : "/";

function freePort(p) {
  try {
    const out = execSync(`netstat -ano | findstr :${p}`, { encoding: "utf8" });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!line.includes("LISTENING")) continue;
      const listenPid = line.trim().split(/\s+/).pop();
      if (listenPid && /^\d+$/.test(listenPid) && listenPid !== "0") {
        pids.add(listenPid);
      }
    }
    for (const listenPid of pids) {
      try {
        execSync(`taskkill /PID ${listenPid} /T /F`, { stdio: "ignore" });
        console.log(`Freed :${p} (killed PID ${listenPid})`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* nothing listening */
  }
}

function probeHealth() {
  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: "127.0.0.1",
        port,
        path: healthPath,
        timeout: HEALTH_TIMEOUT_MS,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode != null && res.statusCode < 500);
      },
    );
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
    req.on("error", () => resolve(false));
  });
}

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

function startServer() {
  freePort(port);
  fails = 0;
  everHealthy = false;
  intentionalRestart = false;

  console.log(
    existsSync(wasmDir)
      ? "SWC: wasm (native blocked by App Control on this machine)"
      : "SWC: default Next resolver",
  );

  if (isSocial) {
    console.log(
      `Starting Creator Early Access (SHORTKEY_SURFACE=social) at http://localhost:${port}/ → /social …`,
    );
  } else if (isStudio) {
    console.log(
      `Starting Studio DNA Control Room (SHORTKEY_SURFACE=studio) at http://localhost:${port}/ → /internal/studio …`,
    );
  } else if (isFamily) {
    console.log(
      `Starting Family Table (SHORTKEY_SURFACE=family) at http://localhost:${port}/ → /internal/family-table …`,
    );
  } else {
    console.log(`Starting Shortkey at http://localhost:${port} …`);
  }

  child = spawn(`npx next dev -p ${port}`, {
    cwd: root,
    env: buildEnv(),
    stdio: "inherit",
    shell: true,
  });

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
      `\n[dev] Next.js exited (code=${code}, signal=${signal}). Restarting in 2s…\n`,
    );
    setTimeout(startServer, 2000);
  });
}

async function healthTick() {
  if (!child || shuttingDown) return;
  const ok = await probeHealth();
  if (ok) {
    if (!everHealthy) console.log("[dev] health ok — hang watchdog armed");
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

  console.warn("[dev] restarting hung Next.js…");
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
