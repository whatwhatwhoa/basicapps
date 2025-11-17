const CACHE_NAME = 'calculator-pwa-v3';
const BASE_PATH = self.location.pathname.replace(/service-worker\.js$/, '');
const OFFLINE_URLS = ['', 'index.html', 'manifest.json'].map((path) =>
  new URL(path, self.location.origin + BASE_PATH).toString()
);
const CACHE_NAME = 'calculator-pwa-v2';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/styles.css',
  '/src/components/Calculator.tsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin || !requestUrl.pathname.startsWith(BASE_PATH)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(async () => {
          if (event.request.mode === 'navigate') {
            return caches.match(new URL('index.html', self.location.origin + BASE_PATH).toString());
          }

          return caches.match(new URL('', self.location.origin + BASE_PATH).toString());
        });
        .catch(() => caches.match('/index.html'));
    })
  );
});
