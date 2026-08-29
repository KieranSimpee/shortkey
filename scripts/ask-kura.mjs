/**

 * Ask Kura (Base44 Superagent) — Research + Hub · Brand Design Manager.

 * Shared key: KURA_API_KEY or BASE44_API_KEY. Agent ID: KURA_AGENT_ID (fallback locked ID).

 *

 * Usage:

 *   npm run ask:kura -- "How does our dual-hero compare to Aesop homepage?"

 *   node scripts/ask-kura.mjs "your message"

 */



import { spawn } from "node:child_process";

import { join, dirname } from "node:path";

import { fileURLToPath } from "node:url";



const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const message = process.argv.slice(2).join(" ").trim();



if (!message) {

  console.error('Usage: npm run ask:kura -- "your question for Kura"');

  process.exit(1);

}



const child = spawn(

  process.execPath,

  [join(root, "scripts", "ask-base44.mjs"), "--agent=kura", message],

  { stdio: "inherit", cwd: root },

);



child.on("exit", (code) => process.exit(code ?? 1));


