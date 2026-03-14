const cacheName = "smartqr-v2";
const basePath = self.location.pathname.replace(/sw\.js$/, "");
const filesToCache = [
  basePath,
  basePath + "index.html",
  basePath + "view.html",
  basePath + "style.css",
  basePath + "script.js",
  basePath + "manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache)),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== cacheName).map((k) => caches.delete(k)),
      ),
    ),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
