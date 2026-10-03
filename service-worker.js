// Leaf Aid — service worker
// Caches the app shell so it opens even with a weak/no connection.
// Note: pages that need live data (dashboard scan history, chatbot) still
// require a connection — this just makes the app itself load offline.

const CACHE_NAME = 'leafaid-v3';
const APP_SHELL = [
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/dashboard.html',
  '/assets/style.css',
  '/assets/script.js',
  '/assets/dashboard.js',
  '/assets/auth.js',
  '/assets/i18n.js',
  '/assets/supabase-config.js',
  '/assets/logo.svg',
  '/assets/leaf-base.svg',
  '/assets/leaf-analysis.svg',
  '/assets/thumb-blight.svg',
  '/assets/thumb-mildew.svg',
  '/assets/thumb-rust.svg',
  '/assets/thumb-insect.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Never touch API calls (Supabase, chat) — those must always be live.
  if (url.includes('supabase.co') || url.includes('/api/') || url.includes('/.netlify/functions/')) {
    return;
  }
  if (event.request.method !== 'GET') return;

  // Network-first: always try for the freshest page/script, and fall back
  // to the cache only when offline. This stops stale HTML/JS from sticking.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
