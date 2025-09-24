# 2026 SHS Taiwan Trip｜互動式旅遊介紹網站需求（純前端版）v3.1

> 本版為 **無資料庫／無伺服器** 的前端靜態網站 PRD。僅使用靜態檔（HTML/CSS/JS/JSON/影像）與第三方嵌入（如地圖連結），**不含**：會員登入、表單送出、任務提交、留言/排行、照片上傳、後台審核、伺服器 API、資料庫。

---

## 0. 摘要（Executive Summary）
- **目標**：為 15–18 歲美國高中生的「台灣 9 天文化沉浸之旅」打造 **行動優先** 的旅遊介紹網站，著重行前/行中資訊瀏覽與安全資訊可及。
- **範圍（本版）**：行程介紹（Day 0–Day 8）、靜態相片集、FAQ、緊急聯絡卡、公告版位、雙語（中/英）、地圖/交通資訊、PWA 離線瀏覽與基礎可及性。
- **不納入（待後續有後端/DB 再開啟）**：任務/積分/排行、相片上傳與審核、留言/投票、登入與權限、互動數據分析。
- **交付形式**：可直接部署於任何靜態主機（GitHub Pages、Netlify、Vercel 靜態、S3+CloudFront、Nginx/Apache）。

---

## 1. 目標使用者與成功指標
### 1.1 使用者
- **學生**：手機使用為主；快速找到每日亮點、集合點與注意事項。
- **教師/領隊**：可在行動裝置快速查閱行程與緊急資訊、公告。
- **家長**：快速了解行程概況、每日主題與安全聯絡資訊。

### 1.2 成功指標（KPI）
- **效能**：行動 4G 首屏 LCP < 3s；互動延遲 < 100ms。
- **可用性**：行動端任務（非提交）操作成功率 ≥ 95%；WCAG 2.1 AA。
- **可維護**：非工程人員在 10 分鐘內可完成內容 JSON 的替換與重新發布（透過文件化流程）。

---

## 2. 資訊架構（IA）與導覽
- **首頁**：英雄區（9 天旅程敘事）、行程快速入口、最新公告（靜態區塊）、FAQ/緊急資訊入口。
- **行程**：Day 0–Day 8 時間軸；每一日包含主題、地點、路線/交通、餐宿、注意事項、相片精選、地圖連結。
- **相片集（靜態）**：依天數/地點/主題標籤篩選；圖片以預先壓縮之檔案提供，不支援上傳。
- **FAQ**：可搜尋（前端即時篩選）、分類（安全、醫療、保險、通訊、文化禮儀）。
- **緊急資訊**：一鍵撥號（tel:）、集合點地圖連結、保險與學校聯絡方式。
- **公告**：靜態區塊（以 JSON 控制是否置頂/有效期限，純前端過期隱藏）。

---

## 3. 功能需求（FRD）
### 3.1 多語與本地化（i18n）
- **中/英雙語**：URL 前綴 `/en`、`/zh`；語言偏好記憶（localStorage）。
- **字典管理**：集中於 `/content/i18n/*.json`；支援頁面級覆寫；日期/時間/數字格式化（以 Intl API）。

### 3.2 行程（9 天）
- 結構：`Trip → Day → Stops → Activities → Media/Notes` 以 **靜態 JSON** 表示。
- **Day 0/8**：顯示航班代碼、起降機場、通關與行李提醒（非即時追蹤）。
- **地圖**：使用 Google Maps / Apple Maps / OpenStreetMap 的 **超連結或嵌入 iframe**（不需 API Key）。
- **時間軸與卡片**：支援依「天數/主題/地點」的前端篩選與捲動定位。

### 3.3 相片集（靜態）
- 來源：`/assets/gallery/<day>/<slug>.jpg`（另供 WebP 版本）。
- 顯示：瀑布流 + Lightbox；前端標籤篩選（主題/地點/天數）。
- 無上傳、無留言，僅瀏覽與分享（可選擇分享連結）。

### 3.4 FAQ 與緊急支援
- FAQ：前端搜尋（tokenize + 前端模糊比對），分類展開；支援多語。
- 緊急卡：tel: 連結、Email 連結；可顯示預設集合點地圖連結。

### 3.5 公告（靜態）
- 以 `/content/announcements.json` 控制卡片列表（title/desc/lang/validFrom/validTo/pinned）。
- 純前端依時間篩選顯示（以使用者裝置時間；並於卡片上標示「以當地時間為準」）。

### 3.6 PWA 與離線
- 安裝提示（Add to Home Screen），透過 Service Worker 快取 **HTML/CSS/JS/JSON/影像**。
- **離線模式**：行程與 FAQ 在無網路時可讀；圖片使用漸進式載入與失敗替代圖。

### 3.7 可及性與相容性
- WCAG 2.1 AA；鍵盤可導航、替代文字、語意化結構、對比度通過。
- 瀏覽器：Chromium/Firefox/Safari（近兩年主要版本），行動裝置優先。

---

## 4. 非功能性需求（NFR）
- **效能**：圖片懶載、原生瀏覽器快取、HTTP/2/3、CDN；Lighthouse Performance ≥ 90（行動）。
- **安全**：HTTPS、HSTS、Content-Security-Policy（無外部動態腳本時可嚴格）；不收集個資。
- **穩定**：Service Worker 更新策略（skipWaiting + 嚴謹版號）；資產以 hash 命名避免快取汙染。

---

## 5. 前端與內容架構
### 5.1 技術選型（任擇其一）
- **Option A：Vite + React**（SPA + client fetch 靜態 JSON）。
- **Option B：Next.js（SSG）** 產出靜態頁（無伺服器），改善 SEO/首屏；仍不使用 API/DB。
- **Option C：Astro**（內容為中心，島嶼架構；多框架相容）。

> 無論選項，**輸出皆為純靜態檔**；內容來源為專案內的 JSON/Markdown。

### 5.2 檔案結構（建議）
```
/public
  /assets
    /images/hero/*
    /gallery/day-0/*
    /gallery/day-1/*
  /icons/*
/content
  /i18n/
    site.zh.json
    site.en.json
  /itinerary/
    day-0.zh.json  day-0.en.json
    ...
  faq.zh.json  faq.en.json
  announcements.json
/src
  /components  /pages  /styles  /pwa
```

### 5.3 內容 JSON（節錄 Schema）
```json
{
  "day": 0,
  "date": "2026-06-15",
  "title": {"zh": "出發日", "en": "Departure"},
  "theme": ["航班", "集合"],
  "stops": [
    {"time": "23:40", "place": {"zh": "SFO", "en": "SFO"}, "notes": {"zh": "提前3小時報到", "en": "Check-in 3h earlier"}},
    {"time": "—", "place": {"zh": "機上", "en": "In-flight"}, "notes": {"zh": "保暖與補水", "en": "Stay warm & hydrated"}}
  ],
  "mapLinks": [{"label":"SFO","url":"https://maps.google.com/?q=SFO"}],
  "media": ["/assets/gallery/day-0/hero.jpg"],
  "tips": {"zh": ["護照、簽證"], "en": ["Passport, visa"]}
}
```

---

## 6. 驗收標準（UAT / DoD）
- **雙語切換**：全站可切換；重整後語言偏好保留（localStorage）。
- **9 天行程**：Day 0–8 皆有卡片版面、地圖連結、相片/提示區塊。
- **相片集**：可依「天數/主題/地點」前端即時篩選；Lightbox 正常。
- **FAQ 搜尋**：200ms 內回傳結果（前端篩選）；展開/收合可及性良好。
- **公告**：超過有效期自動隱藏；Pinned 置頂呈現。
- **PWA/離線**：在離線時仍能閱讀行程與 FAQ；回到線上自動同步新版本（顯示「更新可用」提示）。
- **可及性**：axe 自動化檢測無高/中等嚴重度問題；鍵盤 TAB 流暢。
- **效能**：Lighthouse（行動）Performance ≥ 90、Best Practices ≥ 90、Accessibility ≥ 95、SEO ≥ 95。

---

## 7. 編輯作業流程（無後端）
1. 於 `/content` 修改或新增 JSON／圖片（遵守命名規則）。
2. 以 `npm run build` 產出靜態檔案。
3. 發布到靜態主機（Git push / CLI / 管理介面上傳）。
4. 版本標記（如 `v3.1-frontend-only`）並於 `CHANGELOG.md` 紀錄。

> 可附「內容維護手冊」：欄位說明、圖片尺寸規範、常見錯誤排查。

---

## 8. 風險與緩解
- **內容更新需要重新發布**：以 CI/CD 自動化、撰寫簡易教學降低門檻。
- **地圖服務變更/連結失效**：以 Link Checker 定期檢查；提供替代（Apple/OSM）。
- **離線資產容量**：圖片以多尺寸與 WebP；僅快取關鍵頁與縮圖。
- **時區/時間顯示混淆**：前端以 Intl 依使用者語系顯示，並標註「以當地時間為準」。

---

## 9. 路線圖（Front‑end First → 可擴充）
- **Now（本版）**：純前端內容瀏覽、PWA、雙語、相片集、FAQ、公告與緊急聯絡。
- **Next（需要後端/DB 時解鎖）**：
  - 任務/積分/排行、相片上傳與審核、留言與互動。
  - 權限與登入（Admin/Teacher/Student/Guest）。
  - 分析儀表板與通知（Web Push）。

---

**版本**：v3.1（純前端版，無資料庫）｜2025-09-08

