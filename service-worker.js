const CACHE_NAME = 'finance-tracker-v1';

const urlsToCache = [

  './',

  './index.html',

  './css/app.css',
  './css/dashboard.css',
  './css/analytics.css',
  './css/modal.css',

  './js/app.js',
  './js/categories.js',
  './js/storage.js',
  './js/transactions.js',
  './js/analytics.js',
  './js/charts.js',

  './manifest.json'
];

self.addEventListener('install', (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then((cache) => {

        return cache.addAll(urlsToCache);

      })

  );

});

self.addEventListener('fetch', (event) => {

  event.respondWith(

    caches.match(event.request)
      .then((response) => {

        return response || fetch(event.request);

      })

  );

});