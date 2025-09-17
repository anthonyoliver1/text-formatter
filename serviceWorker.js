const CACHE_NAME = 'text-formatter-cache-v1';

const BASE_PATH = location.pathname.startsWith('/text-formatter')
    ? '/text-formatter/'
    : '/';

const urlsToCache = [
    `${BASE_PATH}`,
    `${BASE_PATH}index.html`,
    `${BASE_PATH}css/reset.css`,
    `${BASE_PATH}css/style.css`,
    `${BASE_PATH}js/main.js`
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});