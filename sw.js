// sw.js — Service Worker for 台股技術分析報表產生器 PWA
// 快取「App Shell」（外殼介面本身），不快取後端 Gradio 的動態內容/資料，
// 因為股價與報表資料必須即時抓取。

const CACHE_VERSION = "tw-stock-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./offline.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-72.png",
  "./icons/icon-96.png",
  "./icons/icon-128.png",
  "./icons/icon-144.png",
  "./icons/icon-152.png",
  "./icons/icon-192.png",
  "./icons/icon-384.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/favicon-16.png",
];

// ── Install: 預先快取 App Shell ──────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: 清除舊版快取 ────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch strategy ───────────────────────────────────────
// - App Shell 自身的檔案（同源）：cache-first，並在背景更新快取
// - 導覽請求（HTML）失敗時：回退到 offline.html
// - 跨網域（後端 Gradio 服務／股價 API）：一律不經過 SW，直接放行網路請求
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 只處理同源的 GET 請求；後端 API / iframe 內容一律直接走網路
  if (url.origin !== self.location.origin || req.method !== "GET") {
    return;
  }

  const isAppShellFile = APP_SHELL.some((p) => {
    try {
      return new URL(p, self.location.href).pathname === url.pathname;
    } catch {
      return false;
    }
  });

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./offline.html"))
    );
    return;
  }

  if (isAppShellFile) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const networkFetch = fetch(req)
          .then((res) => {
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, res.clone()));
            return res;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
});
