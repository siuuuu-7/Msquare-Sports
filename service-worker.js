const CACHE_NAME = "msquare-cache-v1";
const urlsToCache = [
  "/Msquare-Sports/",
  "/Msquare-Sports/index.html",
  "/Msquare-Sports/style.css",
  "/Msquare-Sports/script.js",
  "/Msquare-Sports/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
