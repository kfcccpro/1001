const CACHE='chunilmun-pfal-t1-v070';
const ASSETS=['./','./index.html','./styles.css','./learning.css','./growth-v06.css','./compare-v07.css','./app.js','./growth-v06.js','./compare-v07.js','./manifest.webmanifest','./data/unit01.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
