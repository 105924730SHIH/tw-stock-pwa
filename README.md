# 台股技術分析報表產生器（PWA 版）

原本的 Gradio 工具邏輯完全保留，這次加上一層 **PWA（Progressive Web App）外殼**，
讓它可以「加入主畫面」、離線開啟外殼、像原生 App 一樣使用。

## 檔案結構

```
tw-stock-pwa/
├── app.py            # 後端（Gradio 邏輯不變）+ FastAPI 掛載 PWA 靜態檔
├── index.html         # PWA 外殼首頁（含安裝按鈕、連線狀態、內嵌 Gradio 介面）
├── manifest.json       # PWA 應用程式清單（名稱、圖示、顏色、捷徑）
├── sw.js              # Service Worker（App Shell 快取 + 離線提示）
├── gen_icons.py         # 產生 icons/ 內所有尺寸圖示的腳本
└── icons/             # 已產生好的 App 圖示（72~512px、maskable、favicon）
```

## 安裝與執行

```bash
pip install gradio yfinance openpyxl pandas numpy requests lxml resend fastapi uvicorn
python app.py
```

啟動後：

| 網址 | 說明 |
|---|---|
| `http://127.0.0.1:7860/` | **PWA 外殼**（安裝、離線提示、內嵌下方介面） |
| `http://127.0.0.1:7860/app` | 純 Gradio 介面（原本的操作畫面） |
| `http://127.0.0.1:7860/manifest.json` | PWA 清單 |
| `http://127.0.0.1:7860/sw.js` | Service Worker |
| `http://127.0.0.1:7860/icons/*` | App 圖示 |

首次開啟 `/` 時，若曾經修改過部署位置，可點右上角「⚙️ 設定」，
或直接按「使用目前網域（同源部署）」讓外殼自動連到 `/app`。

## 重新產生圖示

若想更換配色或設計，編輯 `gen_icons.py` 內的顏色常數後重新執行：

```bash
pip install pillow
python gen_icons.py
```

會覆寫 `icons/` 內所有 PNG 與 `favicon.ico`。

## 安裝為 App

- **Android / Chrome（桌面或行動版）**：開啟 `/` 後，網址列或選單會出現「安裝」，
  也會跳出頁面底部的安裝提示列。
- **iOS Safari**：開啟 `/`，點分享 → 「加入主畫面」（iOS 不支援 `beforeinstallprompt`，
  需手動加入）。
- **桌機 Chrome/Edge**：網址列右側會出現安裝圖示。

## 部署到雲端（非本機）時

1. 部署 `app.py`（例如 Render、Railway、Hugging Face Spaces 之 Docker SDK、或自架 VM）。
   由於已改用 `uvicorn` 執行整個 FastAPI（含 Gradio），一般 PaaS 的 `Procfile` 可寫：
   ```
   web: python app.py
   ```
2. 確認服務對外的網址是 **HTTPS**（PWA 安裝與 Service Worker 皆要求 HTTPS，
   `localhost` 例外可用 HTTP 測試）。
3. 前往 `https://你的網域/`，即為可安裝的 PWA。

## 離線行為

- `index.html`、`manifest.json`、圖示等「外殼」會被 Service Worker 快取，離線也能開啟外殼頁面。
- 股價下載、Excel 產生、Email 寄送都需要即時連線（Gradio 佇列、Google Sheet CSV、
  yfinance、Resend），離線時外殼會顯示提示，恢復連線即可繼續使用。

## 安全性備註

- `Resend API Key` 目前透過 Gradio 表單於前端輸入、於後端記憶體中使用，並未寫入磁碟或快取。
  若要長期部署給多人使用，建議改為伺服器端環境變數，避免每次都在前端輸入金鑰。
- 本工具產出之技術指標與買賣建議僅供參考，不構成投資建議。
