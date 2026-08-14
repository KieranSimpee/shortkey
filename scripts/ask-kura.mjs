/**
 * Ask Kura — thin wrapper around unified family agent CLI.
 * LIVE only · fail-closed · no ghost answers.
 *
 *   npm run ask:kura -- "your question"
 */

import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const message = process.argv.slice(2).join(" ").trim();
const script = join(root, "scripts", "ask-family-agent.mjs");

const result = spawnSync(
  process.execPath,
  [script, "kura", ...(message ? [message] : [])],
  { stdio: "inherit", cwd: root, env: process.env },
);

process.exit(result.status ?? 1);
