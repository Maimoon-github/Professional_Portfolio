// Simple development service worker placeholder to silence 404s.
// Replace with real offline/PWA logic when ready.
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  // cleanup logic
});
self.addEventListener('fetch', event => {
  // Passthrough for now
});
