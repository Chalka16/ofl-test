// =========================================================
// OFL Radiotelefonie
// Service Worker
// Verze 1.0
// =========================================================

const CACHE_NAME = "ofl-v1.1.2";

const ASSETS = [

    "./",
    "./index.html",

    "./abeceda.html",
    "./radio.html",
    "./cisla.html",
    "./poradi.html",
    "./frazeologie.html",
    "./tisnova.html",
    "./spojeni.html",
    "./testy.html",

    "./styles.css",
    "./app.js",
    "./manifest.json",

    "./icon.png"

];

// =========================================================
// Instalace
// =========================================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(ASSETS);

            })

            .then(() => self.skipWaiting())

    );

});

// =========================================================
// Aktivace
// =========================================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(keys =>

                Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            return caches.delete(key);

                        }

                    })

                )

            )

            .then(() => self.clients.claim())

    );

});

// =========================================================
// Fetch
// =========================================================

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

            .then(cached => {

                if (cached) {

                    return cached;

                }

                return fetch(event.request)

                    .then(response => {

                        if (!response || response.status !== 200) {

                            return response;

                        }

                        const responseClone = response.clone();

                        caches.open(CACHE_NAME)

                            .then(cache => {

                                cache.put(event.request, responseClone);

                            });

                        return response;

                    })

                    .catch(() => {

                        return caches.match("./index.html");

                    });

            })

    );

});