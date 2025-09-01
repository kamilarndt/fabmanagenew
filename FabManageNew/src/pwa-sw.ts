self.addEventListener('install', (event: any) => {
    event.waitUntil(caches.open('fabmanage-cache-v1').then(cache => cache.addAll(['/'])));
})

self.addEventListener('fetch', (event: any) => {
    event.respondWith(
        caches.match(event.request).then(resp => resp || fetch(event.request).catch(() => caches.match('/')))
    )
})

