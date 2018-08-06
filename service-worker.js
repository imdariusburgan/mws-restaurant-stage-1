const cacheName = "v1";
const cacheFiles = [
  "/",
  "/index.html",
  "/restaurant.html",
  "/js/dbhelper.js",
  "/js/main.js",
  "/js/restaurant_info.js",
  "/img/1.jpg",
  "/img/2.jpg",
  "/img/3.jpg",
  "/img/4.jpg",
  "/img/5.jpg",
  "/img/6.jpg",
  "/img/7.jpg",
  "/img/8.jpg",
  "/img/9.jpg",
  "/img/10.jpg",
  "/css/styles.css",
  "/css/media-queries.css"
];

self.addEventListener("install", function(e) {
  // Store files in cache
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener("activate", function(e) {
  console.log("[service worker] is activated correctly");

  // Remove old caches
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(thisCacheName) {
          if (thisCacheName !== cacheName) {
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response;
      }
      const fetchRequest = e.request.clone();

      return fetch(fetchRequest).then(function(response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();

        caches.open(cacheName).then(function(cache) {
          cache.put(e.request, responseToCache);
        });

        return response;
      });
    })
  );
});
