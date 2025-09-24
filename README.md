2026 SHS Taiwan Trip - Next.js & TypeScript Project
這是一個使用 Next.js (App Router), TypeScript, 和 Tailwind CSS 建置的「2026 SHS 台灣新年之旅」互動式旅遊介紹網站專案。

專案設定步驟
1. 建立 Next.js 專案

開啟您的終端機 (Terminal) 並執行以下指令來建立一個新的 Next.js 專案。

npx create-next-app@latest

在設定過程中，請根據以下建議回答問題：

What is your project named? 2026-shs-taiwan-trip (或任何您喜歡的名稱)

Would you like to use TypeScript? Yes

Would you like to use ESLint? Yes

Would you like to use Tailwind CSS? Yes

Would you like your code inside a src/ directory? No

Would you like to use App Router? (recommended) Yes

Would you like to customize the import alias? No (保持預設的 @/*)

2. 複製專案檔案

將我提供的所有檔案和資料夾，複製並覆蓋到您剛剛建立的 2026-shs-taiwan-trip 專案資料夾中。

您的專案結構應該如下：

/
|-- app/
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- EmergencyModal.tsx
|   |-- Faq.tsx
|   |-- Features.tsx
|   |-- Footer.tsx
|   |-- Gallery.tsx
|   |-- Header.tsx
|   |-- Hero.tsx
|   |-- Itinerary.tsx
|   |-- ItineraryModal.tsx
|   `-- LanguageSwitcher.tsx
|-- lib/
|   `-- content.ts
|-- types/
|   `-- index.ts
|-- .gitignore
|-- next.config.mjs (由 Next.js 自動生成)
|-- package.json
|-- postcss.config.js
|-- README.md
|-- tailwind.config.ts
`-- tsconfig.json

3. 安裝額外套件

本專案使用了一些額外的套件來增強功能與視覺效果。請在終端機中，進入您的專案目錄，並執行以下指令來安裝它們：

cd 2026-shs-taiwan-trip
npm install lucide-react framer-motion

lucide-react: 提供簡潔好看的圖示。

framer-motion: 用於製作流暢的動畫效果。

4. 啟動開發伺服器

一切就緒！執行以下指令來啟動網站：

npm run dev

現在，您可以在瀏覽器中開啟 http://localhost:3000 來查看網站的運行效果。

內容管理
本專案為「無資料庫」設計。所有網站的文字內容（中英文）都集中在 lib/content.ts 這個檔案中。

若要修改行程、FAQ、或任何頁面上的文字，請直接編輯此檔案。修改儲存後，開發伺服器會自動重新整理頁面，讓您即時看到變更。

圖片目前使用 placehold.co 作為佔位符。若要更換為真實圖片，請將圖片上傳到任何圖床服務 (例如 Imgur, Cloudinary) 或您自己的伺服器，然後將 lib/content.ts 中的圖片 URL 替換為您的圖片連結即可。