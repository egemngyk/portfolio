/*
  ┌─────────────────────────────────────────────────────┐
  │  sw.js — Service Worker                             │
  │  Statik kaynakları önbelleğe alır.                  │
  │  Strateji: Network-First (Panel için).              │
  │  Panel yönetici sayfasıdır, güncel veri önemlidir.  │
  └─────────────────────────────────────────────────────┘
*/

const CACHE_NAME = "portfolio-panel-v1";

// Önbelleğe alınacak statik dosyalar 
const PRECACHE_ASSETS = [
  "/panel.html",
  "/shared/panel-loader.js",
  "/shared/modules/main.js",
  "/shared/modules/utils.js",
  "/shared/modules/meta.js",
  "/shared/modules/stats.js",
  "/shared/modules/contact.js",
  "/shared/modules/languages.js",
  "/shared/modules/projects.js",
  "/shared/modules/messages.js",
  "/shared/modules/themes.js",
  "/shared/components/project-card.js",
  "/shared/components/message-card.js",
  "/shared/css/panel-core.css",
];

// ── INSTALL: Statik dosyaları önceden önbelleğe al ──
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: Eski cache sürümlerini temizle ──
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── FETCH: Network-First stratejisi ──
// Panel için: önce ağı dene, ağ yoksa cache'den sun.
// Firebase, Vercel CDN ve dış API istekleri bypass edilir.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Dış kaynaklara yapılan istekleri bypass et
  if (url.origin !== self.location.origin) return;

  // POST/PUT/DELETE isteklerini bypass et
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Başarılı ağ yanıtını cache'e de kaydet
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Ağ başarısız olursa cache'den sun
        return caches.match(event.request);
      })
  );
});
