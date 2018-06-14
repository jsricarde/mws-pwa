var cacheName = 'weatherPWA-data-final';
var dataCacheName = 'weatherPWA-step-final-1';
var weatherAPIUrlBase = 'https://publicdata-weather.firebaseio.com/';

var filesToCache = [
  '/',
  '/scripts/app.js',
  '/scripts/localforage.js',
  '/styles/ud811.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

self.addEventListener('install', (e) => {
  console.log('[Service worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[Service worker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
})

self.addEventListener('activate', (e) => {
  console.log('[Service worker] Activate');
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[Service worker] removing old cache', key);
          return caches.delete(key);
        }
      }))
    })
  );
})

self.addEventListener('fetch', (e) => {
  console.log('[Service worker] Fetch', e.request.url);
  if (e.request.url.startsWith(weatherAPIUrlBase)) {
    e.respondWith(
      fetch(e.request).then(response => {
        return caches.open(dataCacheName).then(cache => {
          cache.put(e.request.url, response.clone());
          console.log('[Service worker] Fetched&Cached');
          return response;
        })
      })
    )
  } else {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    )
  }

})