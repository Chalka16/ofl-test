// sw.js
const CACHE_NAME = 'ofl-app-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/abeceda.html',
  '/radio.html',
  '/cisla.html',
  '/poradi.html',
  '/frazeologie.html',
  '/tisnova.html',
  '/spojeni.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];

// Instalace Service Workeru a cachování souborů
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Smazání staré cache při aktivaci
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Strategie Cache First, fallback na Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
