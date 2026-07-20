/**
 * sw.js — 台股技術分析報表產生器 PWA Service Worker
 *
 * 策略：
 *  - App Shell（index.html, manifest, icons）採 cache-first，離線也能開啟外殼與說明頁。
 *  - 對 Gradio 後端（/, /run, /queue/*, /file=* 等 API/資料請求）一律 network-only，
 *    因為報表資料需要即時股價，不應被快取，離線時顯示提示訊息。
 *  - 版本號改變時自動清除舊快取。
 */

const CACHE_VERSION = "tw-stock-pwa-v1";
const SHELL_CACHE = `${CACHE_VERSION}-shell`;

const SHELL_ASSETS = [
  "./index.html",
  "./manifest.json",
  "./icons/icon-72.png",
  "./icons/icon-96.png",
  "./icons/icon-128.png",
  "./icons/icon-144.png",
  "./icons/icon-152.png",
  "./icons/icon-192.png",
  "./icons/icon-384.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
];

// 這些路徑一律不快取，直接打後端（Gradio API / 動態資料 / WebSocket 佇列）
const NETWORK_ONLY_PATTERNS = [
  /\/queue\//,
  /\/api\//,
  /\/run\//,
  /\/upload/,
  /\/file=/,
  /\.xlsx($|\?)/,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("tw-stock-pwa-") && key !== SHELL_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function isNetworkOnly(url) {
  return NETWORK_ONLY_PATTERNS.some((re) => re.test(url));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // POST（跑報表、上傳）永遠直接放行

  const url = new URL(request.url);

  // 跨網域（例如 Google Sheet CSV、Resend）不攔截
  if (url.origin !== self.location.origin) return;

  if (isNetworkOnly(request.url)) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(
            JSON.stringify({ error: "目前離線，無法連線至報表伺服器" }),
            { headers: { "Content-Type": "application/json" }, status: 503 }
          )
      )
    );
    return;
  }

  // App Shell：cache-first，背景更新
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});

// 讓頁面可以主動通知 SW 立即更新（index.html 內的「有新版本」按鈕會用到）
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
