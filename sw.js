const CACHE_NAME = 'rando-offline-v2'; // Change le nom de version ici pour forcer le rafraîchissement
const urlsToCache = [
    './',
    './index.html',
    './config.json',
    './manifest.json',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://i49.servimg.com/u/f49/11/31/89/70/17941710.jpg'
];

// Installation : met en cache les fichiers de base
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force l'activation immédiate du nouveau service worker
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Activation : nettoie les anciens caches obsolètes
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName); // Supprime l'ancien cache
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interception des requêtes : sert le cache si hors-ligne, sinon met à jour
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
