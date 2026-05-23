self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
  // Force o service worker a se tornar o ativo imediatamente
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker ativado");
  // O service worker assume o controle imediato dos clientes (abas abertas)
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Estratégia de cache básica "Network First, falling back to cache" (Apenas requisições GET)
  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se a rede retornar sucesso, guardamos no cache dinâmico para uso offline
          const responseClone = response.clone();
          caches.open("pwa-cache-v1").then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Se a rede falhar (offline), tentamos recuperar do cache
          return caches.match(event.request);
        })
    );
  }
});
