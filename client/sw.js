
const cacheName = "cache-v1";
const dynamicCache = "cache-dynamic-v1";
const assets = [
  "/api/get-all",
  "/",
  "/styles.css",
  "/script.js",
  "/index.html",
  "/src/layout/app-footer/index.jsx",
  "/src/layout/app-header/index.jsx",
  "/src/pages/add-item-modal/index.jsx",
  "/src/pages/barcode-view/index.jsx",
  "/src/pages/dashboard/index.jsx",
  "/src/pages/find-item/index.jsx",
  "/src/pages/item-view/index.jsx",
  "/src/pages/items-list/index.jsx",
  "/src/pages/read-barcode/read/index.jsx",
  "/src/pages/read-barcode/result/index.jsx",
  "/src/pages/read-barcode/index.jsx",
  "/src/pages/read-item/index.jsx",
  "/src/pages/report-view/index.jsx",
  "/src/pages/store/index.jsx",
  "/src/routes/index.jsx",
  "/src/assets/images/store.png",
  "/src/assets/images/collection.png",
  "/src/assets/images/report.png",
  "/src/assets/images/add-item.png",
  "/src/assets/images/barcode.png",
  "/src/assets/images/create-barcode.png",
  "/src/assets/images/read-barcode.png",
  "/src/assets/images/settings.png",
];


const limitCacheSize = async (name, size) => {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  while (keys.length > size) {
    await cache.delete(keys[0]);
    keys.shift();
  }
};

self.addEventListener("install", (evt) => {
  console.log('[Service Worker] Install event');
  evt.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(assets);
    }).catch(err => {
      console.error('[Service Worker] Caching static assets failed', err);
    })
  );
});

self.addEventListener("activate", (evt) => {
  console.log('[Service Worker] Activate event');
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName && key !== dynamicCache).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (evt) => {
  const url = new URL(evt.request.url);

  if (url.pathname.startsWith("/api/")) {
    // Handle API requests
    console.log('[Service Worker] Fetching API request from network:', evt.request.url);
    evt.respondWith(
      fetch(evt.request).then((fetchRes) => {
        return caches.open(dynamicCache).then((cache) => {
          cache.put(evt.request.url, fetchRes.clone());
          limitCacheSize(dynamicCache, 10);
          return fetchRes;
        });
      }).catch(err => {
        console.error('[Service Worker] Fetch API request failed', err);
        // Serve from cache if network fails
        return caches.match(evt.request).then((cacheRes) => {
          if (cacheRes) {
            return cacheRes;
          } else {
            // Provide a fallback response if not in cache
            return new Response(JSON.stringify({ error: "Network error and no cached data available" }), {
              status: 503,
              statusText: "Service Unavailable",
              headers: new Headers({ "Content-Type": "application/json" })
            });
          }
        });
      })
    );
  } else {
    // Handle requests for static assets
    evt.respondWith(
      caches.match(evt.request).then((cacheRes) => {
        if (cacheRes) {
          console.log('[Service Worker] Serving from static cache:', evt.request.url);
          return cacheRes;
        }

        console.log('[Service Worker] Fetching from network:', evt.request.url);
        return fetch(evt.request).then((fetchRes) => {
          return caches.open(dynamicCache).then((cache) => {
            cache.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCache, 10);
            return fetchRes;
          });
        });
      }).catch(err => {
        console.error('[Service Worker] Fetch failed', err);
        if (evt.request.url.endsWith('.html')) {
          return caches.match('/index.html');
        }
      })
    );
  }
});
