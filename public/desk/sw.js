/* ShortKey Minion Desk — minimal SW for installability.
   Chat / API still need network. Offline = stub shell only. */
const CACHE = "minion-desk-shell-v1";
const SHELL = ["/desk/", "/desk/index.html", "/desk/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Never cache API / chat — always network
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(req));
    return;
  }
  if (!url.pathname.startsWith("/desk")) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        if (res.ok && (url.pathname === "/desk/" || url.pathname.endsWith(".html") || url.pathname.endsWith(".webmanifest") || url.pathname.endsWith(".json"))) {
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("/desk/index.html")))
  );
});
