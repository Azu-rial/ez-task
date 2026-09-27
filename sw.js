// Cache name version
const CACHE_NAME = 'eztask-cache-v1';

// Files to cache (add all the important files here)
const filesToCache = [
    '/',
    '/index.html',         // Main HTML file
    '/css/styles.css',      // Your main CSS file
    '/js/script.js',        // Your main JS file
    '/icons/icon-192x192.png',  // Add your app icon (192x192)
    '/icons/icon-512x512.png',  // Add your app icon (512x512)
    '/offline.html'         // Optional offline page
];

// Install event - cache the essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching important files');
            return cache.addAll(filesToCache);  // Cache all the files
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);  // Delete old caches
                    }
                })
            );
        })
    );
});

// Fetch event - serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached file or fetch from network
            return response || fetch(event.request);
        })
    );
});

// Optional: Cache new requests that were not cached earlier
self.addEventListener('fetch', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return fetch(event.request).then((response) => {
                // Cache only successful responses
                if (response && response.status === 200) {
                    cache.put(event.request, response.clone());
                }
                return response;
            });
        })
    );
});
