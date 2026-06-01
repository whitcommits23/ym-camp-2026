const CACHE = 'camp2026-v1';

// Pre-cache the page on first install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.add('/young-mens-camp-2026'))
      .then(() => self.skipWaiting())
  );
});

// Remove old caches when a new version activates
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: serve from cache instantly, update in background
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const networkFetch = fetch(e.request).then(response => {
        if (response.ok || response.type === 'opaque') {
          caches.open(CACHE).then(cache => cache.put(e.request, response.clone()));
        }
        return response;
      }).catch(() => cached);

      return cached || networkFetch;
    })
  );
});
