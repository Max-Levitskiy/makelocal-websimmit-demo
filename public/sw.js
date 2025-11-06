// Service Worker for MakeLocal Web Summit Demo
// Cache version for future cache invalidation
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `makelocal-cache-${CACHE_VERSION}`;

// Install event handler
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', CACHE_VERSION);
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  // Pre-caching can be added in Story 1.2
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cache opened:', CACHE_NAME);
      // Cache will be populated in Story 1.2
      return cache;
    })
  );
});

// Activate event handler for cache cleanup
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...', CACHE_VERSION);
  
  // Claim clients immediately
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches that don't match current version
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event handler (minimal for Story 1.1, full caching logic deferred to Story 1.2)
self.addEventListener('fetch', (event) => {
  // Basic fetch handler - network-first strategy
  // Full offline caching strategy will be implemented in Story 1.2
  event.respondWith(
    fetch(event.request).catch(() => {
      // Fallback handling will be added in Story 1.2
      console.log('[Service Worker] Fetch failed for:', event.request.url);
    })
  );
});

