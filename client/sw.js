// const cacheName = "cache-v1";
// const dynamicCache = "cache-dynamic-v1";
// const assets = [
//   "/api/get-all",
//   "/",
//   "/styles.css",
//   "/script.js",
//   "/index.html",
//   "/src/layout/app-footer/index.jsx",
//   "/src/layout/app-header/index.jsx",
//   "/src/pages/add-item-modal/index.jsx",
//   "/src/pages/barcode-view/index.jsx",
//   "/src/pages/dashboard/index.jsx",
//   "/src/pages/find-item/index.jsx",
//   "/src/pages/item-view/index.jsx",
//   "/src/pages/items-list/index.jsx",
//   "/src/pages/read-barcode/read/index.jsx",
//   "/src/pages/read-barcode/result/index.jsx",
//   "/src/pages/read-barcode/index.jsx",
//   "/src/pages/read-item/index.jsx",
//   "/src/pages/report-view/index.jsx",
//   "/src/pages/store/index.jsx",
//   "/src/routes/index.jsx",
//   "/src/assets/images/store.png",
//   "/src/assets/images/collection.png",
//   "/src/assets/images/report.png",
//   "/src/assets/images/add-item.png",
//   "/src/assets/images/barcode.png",
//   "/src/assets/images/create-barcode.png",
//   "/src/assets/images/read-barcode.png",
//   "/src/assets/images/settings.png",
// ];

// self.addEventListener("install", (evt) => {
//   // console.log('serviceworker installed',evt)
//   evt.waitUntil(
//     caches.open(cacheName).then((cache) => {
//       // console.log("caching shell assets");
//       cache.addAll(assets);
//     })
//   );
// });
// self.addEventListener("activate", (evt) => {
//   // console.log('serviceworker has been activated',evt)
//   evt.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys.filter((key) => key != cacheName).map((key) => caches.delete(key))
//       );
//     })
//   );
// });
// self.addEventListener("fetch", (evt) => {
//   // console.log('fetch event',evt)
//   evt.respondWith(
//     caches.match(evt.request).then((cacheRes) => {
//       return (
//         cacheRes ||
//         fetch(evt.request).then((fetchRes) => {
//           return caches.open(dynamicCache).then((cache) => {
//             cache.put(evt.request.url, fetchRes.clone());
//             return fetchRes;
//           });
//         })
//       );
//     })
//   );
// });

const cacheName = "cache-v1";
const dynamicCache = "cache-dynamic-v1";
const assets = [
  "/api/get-all",
  "/",
  //   "/styles.css",
//   "/script.js",
//   "/index.html",
//   "/src/layout/app-footer/index.jsx",
//   "/src/layout/app-header/index.jsx",
//   "/src/pages/add-item-modal/index.jsx",
//   "/src/pages/barcode-view/index.jsx",
//   "/src/pages/dashboard/index.jsx",
//   "/src/pages/find-item/index.jsx",
//   "/src/pages/item-view/index.jsx",
//   "/src/pages/items-list/index.jsx",
//   "/src/pages/read-barcode/read/index.jsx",
//   "/src/pages/read-barcode/result/index.jsx",
//   "/src/pages/read-barcode/index.jsx",
//   "/src/pages/read-item/index.jsx",
//   "/src/pages/report-view/index.jsx",
//   "/src/pages/store/index.jsx",
//   "/src/routes/index.jsx",
//   "/src/assets/images/store.png",
//   "/src/assets/images/collection.png",
//   "/src/assets/images/report.png",
//   "/src/assets/images/add-item.png",
//   "/src/assets/images/barcode.png",
//   "/src/assets/images/create-barcode.png",
//   "/src/assets/images/read-barcode.png",
//   "/src/assets/images/settings.png",
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(cacheName).then((cache) => {
      return Promise.all(
        assets.map((asset) => {
          return fetch(asset).then((response) => {
            if (!response.ok) {
              throw new TypeError('Bad response status');
            }
            return cache.put(asset, response);
          }).catch((error) => {
            console.error('Failed to cache', asset, error);
          });
        })
      );
    })
  );
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName && key !== dynamicCache).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (evt) => {
  if (evt.request.url.includes('/api/')) {
    evt.respondWith(
      fetch(evt.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(dynamicCache).then((cache) => {
            cache.put(evt.request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(evt.request))
    );
  } else {
    evt.respondWith(
      caches.match(evt.request).then((cacheRes) => {
        return cacheRes || fetch(evt.request)
          .then((fetchRes) => {
            return caches.open(dynamicCache).then((cache) => {
              cache.put(evt.request.url, fetchRes.clone());
              return fetchRes;
            });
          });
      })
    );
  }
});
