/// <reference lib="webworker" />

export {};

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'small-tasks-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.css',
  '/app.ts'
];

self.addEventListener('install', ((event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
}) as EventListener);

self.addEventListener('fetch', ((event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}) as EventListener);

self.addEventListener('activate', ((event: ExtendableEvent) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}) as EventListener);