self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        self.registration.unregister().then(function() {
            return self.clients.matchAll({ type: 'window' });
        }).then(function(clients) {
            for (let client of clients) {
                if (client.url && 'navigate' in client) {
                    client.navigate(client.url);
                }
            }
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(fetch(event.request));
});
