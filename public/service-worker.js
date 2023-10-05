const cacheName = "AWP_Chache";

const precachedResources = [
  "/",
  "index.html",
  "manifest.json",
  "./css/index.css",
  "./css/responsive.css",
  "./css/style.css",
  "./js/index.js",
  "./js/js-include-html.js",
  "./js/latln-converter.js",
  "./js/load-canvas.js",
  "./js/project-selection-menu.js",
  "./js/render-panels-templates.js",
  "./js/canvas-clicker.js",
  "./js/disk-colors.js",
  "./js/fleet-manager.js",
  "./js/gltf-loader.js",
  "./js/mono-manager.js",
  "./js/outline-material-manager.js",
  "./js/shader-fetcher.js",
  "./js/snapper.js",
  "./js/stepper.js",
  "./js/svg-loader.js",
];

async function precache() {
  const cache = await caches.open(cacheName);
  return cache.addAll(precachedResources);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.match(/^\/inbox/)) {
    event.respondWith(networkFirst(event.request));
  }
});

self.addEventListener("activate", (event) => {
  // const cacheAllowlist = ["v2"];

  event.waitUntil(
    (caches || []).forEach((cache, cacheName) => {
      // if (!cacheAllowlist.includes(cacheName)) {
      return caches.delete(cacheName);
      // }
    })
  );
});
