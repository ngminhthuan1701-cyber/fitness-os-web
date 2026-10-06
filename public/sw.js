// Fitness OS Service Worker - Offline Cache & PWA Support
const CACHE_NAME = 'fitness-os-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/icon.svg'
];

// Cài đặt Service Worker và lưu trước tài nguyên tĩnh
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Kích hoạt Service Worker và dọn dẹp các phiên bản cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Chiến lược Stale-While-Revalidate: Trả về từ Cache trước để mở app tức thì, đồng thời cập nhật bản mới từ mạng
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bỏ qua các API bên ngoài, AI Gemini, Supabase, hoặc video stream
  if (
    url.origin !== location.origin ||
    url.pathname.startsWith('/api') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('youtube.com')
  ) {
    return;
  }

  // Đối với điều hướng trang HTML (Navigation request)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Đối với các assets tĩnh (CSS, JS, Hình ảnh, Font)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Khi offline, nếu đã có trong cache thì trả về, nếu không thì trả về cachedResponse
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
