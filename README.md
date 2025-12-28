# Life Gardener Canvas

一頁式互動圖卡，陪你找到當下適合的園丁視角。手機優先、純 HTML/CSS/Vanilla JS，無需額外安裝。

## 如何啟動本地預覽

### VS Code Live Server
1. 在 VS Code 開啟此資料夾。
2. 右鍵 `index.html` 選擇 **Open with Live Server**。
3. 預設會啟動在 http://localhost:5500 ，手機可透過同網域 IP 連線。

### Python 簡易伺服器
1. 在終端機進入專案資料夾：
   ```bash
   cd /path/to/project
   ```
2. 執行：
   ```bash
   python -m http.server 8000
   ```
3. 瀏覽器開啟 http://localhost:8000 即可看到頁面。

## 功能
- 單頁流程：封面 → 四題互動 → 結果卡 → 收尾卡/重新開始。
- 深綠與米白手繪風格，純前端無框架。
- 答案與進度會保存至 `localStorage`，重新整理不會遺失。
- 結果卡可複製連結或結果文字，並可重新開始清除紀錄。

