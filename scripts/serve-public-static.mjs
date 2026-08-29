/**
 * Static public/ server for magazine demo + control panel.
 * Binds 0.0.0.0 so LAN phones can reach :3005.
 * Usage: node scripts/serve-public-static.mjs
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public"
);
const port = Number(process.env.PORT) || 3005;
const host = process.env.HOST || "0.0.0.0";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

function resolveFile(urlPath) {
  let u = decodeURIComponent((urlPath || "/").split("?")[0].split("#")[0]);
  if (!u.startsWith("/")) u = "/" + u;
  if (u === "/control") u = "/control/";
  if (u === "/magazine-demo") u = "/magazine-demo/";
  if (u === "/shortkey-assets") u = "/shortkey-assets/";
  if (u === "/control-center/magazine-demo") u = "/control-center/magazine-demo/";
  if (u.endsWith("/")) u += "index.html";

  const fp = path.normalize(path.join(root, u.replace(/^\//, "")));
  if (!fp.startsWith(root)) return null;
  return fp;
}

const server = http.createServer((req, res) => {
  try {
    const fp = resolveFile(req.url || "/");
    if (!fp) {
      res.writeHead(403);
      return res.end("forbidden");
    }
    if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("not found: " + (req.url || "/"));
    }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    });
    fs.createReadStream(fp).pipe(res);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
});

function lanIPv4() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return null;
}

server.listen(port, host, () => {
  const ip = lanIPv4();
  console.log(`STATIC_PUBLIC root=${root}`);
  console.log(`STATIC_PUBLIC http://127.0.0.1:${port}/magazine-demo/#/cover`);
  console.log(`STATIC_PUBLIC http://127.0.0.1:${port}/shortkey-assets/`);
  console.log(`STATIC_PUBLIC http://127.0.0.1:${port}/control/`);
  if (ip) {
    console.log(`STATIC_PUBLIC_PHONE http://${ip}:${port}/magazine-demo/#/cover`);
    console.log(`STATIC_PUBLIC_PHONE_CONTROL http://${ip}:${port}/control/`);
  }
});
