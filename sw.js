const cacheName = "smartqr-v7";
const basePath = self.location.pathname.replace(/sw\.js$/, "");

const localFiles = [
  basePath,
  basePath + "index.html",
  basePath + "view.html",
  basePath + "style.css",
  basePath + "script.js",
  basePath + "view.js",
  basePath + "theme.js",
  basePath + "i18n.js",
  basePath + "manifest.json",
  basePath + "favicon-32.png",
  basePath + "apple-touch-icon.png",
  basePath + "icon-192.png",
  basePath + "icon-512.png",
  basePath + "mrone-badge.png",
];

const cdnFiles = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/qr-code-styling@1.5.0/lib/qr-code-styling.js",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      await cache.addAll(localFiles);
      await Promise.all(
        cdnFiles.map((url) =>
          fetch(url, { mode: "no-cors" })
            .then((res) => cache.put(url, res))
            .catch(() => {})
        )
      );
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== cacheName).map((k) => caches.delete(k))
      )
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (r) =>
        r ||
        fetch(e.request).then((res) => {
          if (res.ok && e.request.method === "GET") {
            const clone = res.clone();
            caches.open(cacheName).then((cache) => cache.put(e.request, clone));
          }
          return res;
        })
    )
  );
});
