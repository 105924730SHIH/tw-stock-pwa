// app.js — 台股技術分析報表產生器 PWA Shell
// 這個檔案負責：安裝提示、連線狀態偵測、後端網址設定、
// 以及把既有的 Gradio 應用（app.py）包進一個可安裝的 App Shell 中。

const STORAGE_KEY = "tw-stock-pwa:backend-url";
const DEFAULT_PRESETS = [
  { label: "本機 (localhost:7860)", url: "http://localhost:7860" },
  { label: "本機 (127.0.0.1:7860)", url: "http://127.0.0.1:7860" },
];

const els = {
  frame: document.getElementById("app-frame"),
  main: document.getElementById("main"),
  settingsScreen: document.getElementById("settings-screen"),
  loadingScreen: document.getElementById("loading-screen"),
  offlineScreen: document.getElementById("offline-screen"),
  statusDot: document.getElementById("status-dot"),
  settingsBtn: document.getElementById("settings-btn"),
  reloadBtn: document.getElementById("reload-btn"),
  urlInput: document.getElementById("backend-url-input"),
  connectBtn: document.getElementById("connect-btn"),
  cancelSettingsBtn: document.getElementById("cancel-settings-btn"),
  presetsWrap: document.getElementById("presets-wrap"),
  retryOfflineBtn: document.getElementById("retry-offline-btn"),
  openSettingsFromOffline: document.getElementById("open-settings-from-offline"),
  installToast: document.getElementById("install-toast"),
  installBtn: document.getElementById("install-btn"),
  dismissInstallBtn: document.getElementById("dismiss-install-btn"),
};

let deferredInstallPrompt = null;
let currentBackendUrl = localStorage.getItem(STORAGE_KEY) || "";

// ── Screen helpers ─────────────────────────────────────────
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function showOnlyScreen(name) {
  hide(els.settingsScreen);
  hide(els.loadingScreen);
  hide(els.offlineScreen);
  if (name === "settings") show(els.settingsScreen);
  if (name === "loading") show(els.loadingScreen);
  if (name === "offline") show(els.offlineScreen);
}

function setStatus(state) {
  els.statusDot.classList.remove("online", "offline", "connecting");
  if (state) els.statusDot.classList.add(state);
}

// ── Presets ────────────────────────────────────────────────
function renderPresets() {
  els.presetsWrap.innerHTML = "";
  DEFAULT_PRESETS.forEach((p) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = p.label;
    b.addEventListener("click", () => { els.urlInput.value = p.url; });
    els.presetsWrap.appendChild(b);
  });
}

// ── Connect to backend (Gradio app.py) ────────────────────
async function testBackend(url) {
  try {
    const res = await fetch(url, { method: "GET", mode: "no-cors" });
    // no-cors 模式下無法讀取狀態碼，只要沒有丟出例外就視為可連線
    return true;
  } catch (e) {
    return false;
  }
}

async function connectTo(url) {
  url = (url || "").trim().replace(/\/+$/, "");
  if (!url) return;

  showOnlyScreen("loading");
  setStatus("connecting");

  const ok = await testBackend(url);

  if (!ok) {
    showOnlyScreen("offline");
    setStatus("offline");
    return;
  }

  currentBackendUrl = url;
  localStorage.setItem(STORAGE_KEY, url);
  els.frame.src = url;
  showOnlyScreen(null);
  setStatus("online");
}

els.frame.addEventListener("load", () => {
  // iframe 成功載入內容，代表後端連線正常
  if (currentBackendUrl) setStatus("online");
});
els.frame.addEventListener("error", () => {
  setStatus("offline");
  showOnlyScreen("offline");
});

// ── Settings screen events ────────────────────────────────
els.settingsBtn.addEventListener("click", () => {
  els.urlInput.value = currentBackendUrl;
  showOnlyScreen("settings");
});

els.cancelSettingsBtn.addEventListener("click", () => {
  if (currentBackendUrl) {
    showOnlyScreen(null);
  } else {
    // 尚未設定過網址，不能取消
    els.urlInput.focus();
  }
});

els.connectBtn.addEventListener("click", () => connectTo(els.urlInput.value));
els.urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") connectTo(els.urlInput.value);
});

els.reloadBtn.addEventListener("click", () => {
  if (!currentBackendUrl) {
    showOnlyScreen("settings");
    return;
  }
  showOnlyScreen("loading");
  els.frame.src = currentBackendUrl + (currentBackendUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
});

els.retryOfflineBtn.addEventListener("click", () => connectTo(currentBackendUrl));
els.openSettingsFromOffline.addEventListener("click", () => showOnlyScreen("settings"));

// ── Boot ───────────────────────────────────────────────────
renderPresets();

if (currentBackendUrl) {
  els.urlInput.value = currentBackendUrl;
  connectTo(currentBackendUrl);
} else {
  showOnlyScreen("settings");
}

// ── Online / offline network events ───────────────────────
window.addEventListener("online", () => {
  if (currentBackendUrl) connectTo(currentBackendUrl);
});
window.addEventListener("offline", () => {
  setStatus("offline");
});

// ── Install prompt (Android/Desktop Chrome) ───────────────
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  show(els.installToast);
  requestAnimationFrame(() => els.installToast.classList.add("show"));
});

els.installBtn.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  els.installToast.classList.remove("show");
  setTimeout(() => hide(els.installToast), 250);
});

els.dismissInstallBtn.addEventListener("click", () => {
  els.installToast.classList.remove("show");
  setTimeout(() => hide(els.installToast), 250);
});

window.addEventListener("appinstalled", () => {
  els.installToast.classList.remove("show");
  setTimeout(() => hide(els.installToast), 250);
});

// ── Service worker registration ───────────────────────────
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("Service worker 註冊失敗：", err);
    });
  });
}
