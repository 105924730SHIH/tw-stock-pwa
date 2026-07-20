# 台股技術分析報表產生器 — PWA 版

這個資料夾把原本的 Gradio 應用（`app.py`）包裝成一個**可安裝的 PWA**（Progressive Web App）：
可加到手機/電腦桌面、有獨立圖示、離線時會顯示提示畫面。

因為股價抓取、技術指標計算、Excel 產生與寄信都需要在伺服器端（Python）執行，
PWA 本身不改動這段邏輯，而是提供一個**外殼（App Shell）**，以 iframe 方式嵌入
你原本執行的 `app.py`（Gradio）介面，並加上：

- `manifest.json`：讓瀏覽器/系統知道如何「安裝」這個 App（名稱、圖示、顏色、啟動網址）
- `sw.js`：Service Worker，快取外殼介面本身，離線時顯示 `offline.html`
- `icons/`：各尺寸 App 圖示（含 maskable 版本），由 `gen_icons.py` 產生
- `index.html` + `app.js` + `style.css`：外殼介面（連線設定、狀態列、安裝提示）

## 檔案結構

```
tw-stock-pwa/
├── app.py              # 原本的 Gradio 後端（分析邏輯完全未變更）
├── requirements.txt    # 後端 Python 套件
├── gen_icons.py         # 產生 icons/ 內所有圖示（已預先執行過一次）
├── manifest.json        # PWA 安裝設定
├── sw.js                 # Service Worker（離線快取）
├── index.html            # PWA 外殼首頁
├── app.js                 # 外殼邏輯（連線、安裝提示、狀態偵測）
├── style.css              # 外殼樣式
├── offline.html            # 離線提示頁
└── icons/                   # 各尺寸 PNG 圖示
```

## 使用方式

### 1. 啟動原本的分析後端

```bash
pip install -r requirements.txt
python app.py
```

預設會在 `http://localhost:7860` 啟動 Gradio 服務（介面與原本完全相同）。

### 2. 提供 PWA 外殼

`index.html` 等外殼檔案需要透過**網頁伺服器**開啟（不能用 `file://` 直接雙擊開啟，
否則 Service Worker 與 manifest 無法運作）。最簡單的方式：

```bash
# 在 tw-stock-pwa 資料夾內
python -m http.server 8080
```

接著在瀏覽器開啟 `http://localhost:8080`。

> 若要正式部署，把整個資料夾（`index.html`、`app.js`、`style.css`、`manifest.json`、
> `sw.js`、`offline.html`、`icons/`）放到任何靜態網頁空間（Netlify、GitHub Pages、
> Nginx 等）即可，`app.py` 則另外部署在你的伺服器或雲端主機上（記得開放對外連線）。

### 3. 連線設定 & 安裝

- 第一次開啟外殼會出現「連接後端服務」畫面，輸入 `app.py` 服務的網址
  （例如 `http://localhost:7860`，或雲端部署後的網域）。
- 連線成功後即可在瀏覽器網址列或選單看到「安裝」提示，
  也可在手機瀏覽器選擇「加入主畫面」。
- 右上角齒輪圖示可隨時重新設定後端網址；圓點顯示連線狀態
  （綠＝連線中、黃＝連線中、紅＝離線）。

### 4. 重新產生圖示（選用）

若想更換圖示樣式，編輯 `gen_icons.py` 後重新執行：

```bash
pip install pillow
python gen_icons.py
```

會覆寫 `icons/` 內的所有 PNG 檔案。

## 注意事項

- 本 PWA 外殼**不會快取**股價資料或 Excel 報表本身，只快取外殼介面（HTML/CSS/JS/圖示），
  確保每次產生的報表都是最新資料。
- 若後端 `app.py` 與 PWA 外殼部署在不同網域，請確認後端伺服器的網路環境允許
  跨網域被 iframe 嵌入（大部分 Gradio 預設設定即可正常運作）。
- 本工具產出內容僅供技術參考，不構成任何投資建議。
