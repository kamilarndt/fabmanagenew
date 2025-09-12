self.addEventListener('install', (event: Event) => {
    const installEvent = event as any
    installEvent.waitUntil(caches.open('fabmanage-cache-v1').then(cache => cache.addAll(['/'])));
})

self.addEventListener('fetch', (event: Event) => {
    const fetchEvent = event as any
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(resp => resp || fetch(fetchEvent.request).catch(() => caches.match('/')))
    )
})

