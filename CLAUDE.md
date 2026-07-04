# 薪水小偷 / On The Clock - 專案筆記

## 專案概念
一款針對上班族的計時 app，讓使用者輸入薪資，在摸魚/上廁所時開始計時，停止後告訴他們「偷了多少薪水」，並換算成實物。

核心精神：自嘲好玩、適合社群分享。同時作為 Rowan 的作品集項目。

---

## 基本資料

| | 台灣版 | 英文版（UK）|
|---|---|---|
| 名稱 | 薪水小偷 | On The Clock |
| 語言 | 繁體中文 | 英文 |
| 幣別 | NT$ / £ / $ | NT$ / £ / $ |

**同一個網站，切換語言 + 幣別**（展示 Localization 設計思考）

---

## 功能規格（已確認）

### 設定頁
- 薪資模式：**時薪 / 月薪 / 年薪**（順序固定）
- **時薪**：只填時薪，不顯示工時區塊
- **月薪**：每月天數 + 每天工時（預設 22 天、8 小時）
- **年薪**：每週工時 + 每年工作週數（預設 40 小時、52 週）
- 自動換算每分鐘薪資（標籤在上、紅色大數字在下）
- 使用者輸入數字：**紅色** `#e63946`

### 計時器
- 開始 / 停止（`StopwatchDial` 紅色碼錶，260px）
- 從設定／結果進場時 **自動開始計時**
- 停止後顯示偷了多少錢（紅色 64px）

### 分享功能
- 結果頁有分享按鈕

### 歷史紀錄（簡單版）
- 只記錄今天的計時次數 + 累積金額
- 午夜自動歸零
- 用 localStorage 儲存

### 導覽
- Header 右側：**EN／中文／☰ 漢堡選單**
- 選單內四頁：設定、計時、結果、紀錄（已移除頂部四格導覽列）

---

## 設計風格（已確認）

**白底手繪馬克筆風** + 簡化色盤（參考 Lobb's Padel 易讀性）：
- 白色背景 + 22px 方格紙
- 黑色粗馬克筆線條（rough.js，`roughness: 2.8`）
- **灰標籤** `#666` + **紅數字** `#e63946`（全站 stat 統一）
- 正文系統無襯線；App 標題 Noto Serif 700
- v1 **不使用**頁面裝飾插圖（`StickFigure` 保留未掛載）
- 詳細規格見 `on-the-clock/DESIGN.md` v1.7

---

## 技術架構

**專案位置**：`/Users/linyuxian/Desktop/薪水小偷/on-the-clock/`

**Tech Stack**：
- React + Vite + TypeScript
- rough.js 4.6.6（手繪邊框）
- react-router-dom 7（路由）
- 字體：Noto Serif SC / Noto Serif（僅 App 標題粗體）
- localStorage（歷史紀錄，不需後端）
- 部署：Vercel（免費）

**路由結構**：
- `/setup` — 設定頁
- `/timer` — 計時頁
- `/result` — 結果頁
- `/history` — 歷史紀錄頁

**重要元件**：
- `RoughBox` / `RoughButton` / `RoughInput` / `RoughFrame` — rough.js 手繪元件
- `StickFigure` — 火柴人 SVG
- `LanguageContext` — 語言切換（EN/中）
- `AppStateContext` — 全局狀態（薪資設定、計時）
- `src/lib/salary.ts` — 薪資換算邏輯
- `src/lib/storage.ts` — localStorage 歷史紀錄
- `BossKeyButton` / `FakeInboxOverlay` — 老闆來了緊急鍵
- `NavMenu` — Header 漢堡選單（設定／計時／結果／紀錄）
- `src/i18n/translations.ts` — 中英文字串
- `DESIGN.md` — 輕量 design system（`on-the-clock/DESIGN.md`）

---

## 畫面進度

- [x] 專案架構建立
- [x] Setup Page（設定頁）— 分組表單、四步驟說明、`setupTitle` 紅標題
- [x] Timer Page（計時頁）— `StopwatchDial` 碼錶、▶／暫停、結束摸魚、進場自動計時
- [x] Result Page（結果頁）— 戰績、分享、inline 今日紀錄、空狀態並排按鈕
- [x] History Page（紀錄頁）— 今日戰績（黃底無框）+ 紀錄列表
- [x] 老闆來了 — 底部灰橫幅 `#333` + 紅緊急鍵 + 假郵件收件匣
- [x] **DESIGN.md** design system（**v1.7**，四頁對齊現況）
- [x] 薪資三模式（時薪／月薪／年薪）+ localStorage 持久化
- [x] **漢堡選單導覽** — 四頁收進 Header（語言切換右側）
- [x] 全站色彩統一 — 灰標籤 `#666`、紅數字 `#e63946`、無襯線正文
- [x] 按鈕 affordance — 16px 圓角按鈕、直角輸入、黑邊、active 黃底紅字
- [x] 四頁 `.page-card` padding 統一；Header ≤520px 標題上／nav 下
- [ ] 幣值選擇功能（NT$ / £ / $）
- [ ] Vercel 部署 + OG 圖

---

## 工作流程

```
1. Claude → 功能規格確認（完成）
2. 設計工具 → 跳過（Stitch 做不出手繪風格）
3. Cursor → 開發（進行中）
4. Vercel → 免費部署
```

開發者：Rowan Lin（不寫 code，由 Claude + Cursor 協作完成）

---

## Cursor 使用方式（舊流程）
- 在 Chat 輸入框用中文或英文描述要做什麼
- Cursor 寫 code，確認後 Accept
- 不確定的地方截圖給 Claude 問

---

## Claude Code + Cursor 協作工作模式（2026-06-29 確定）

### 角色分工

| 角色 | 責任 | 工作內容 |
|------|------|---------|
| **Claude Code**（我） | 設計決策 + 系統規劃 | <ul><li>讀取當前截圖 + DESIGN.md + 代碼狀態</li><li>分析問題，提出 3–5 個方案</li><li>給出「最推薦方案」+ 實作細節</li><li>撰寫或更新 DESIGN.md</li><li>寫 Cursor Prompt（含具體改動指示）</li><li>**不改代碼**，等確認後再交給 Cursor</li></ul> |
| **Cursor**（你） | 代碼實作 + 測試 | <ul><li>接收最終確認的 Prompt</li><li>實作代碼改動</li><li>本機測試（npm run dev）</li><li>反饋效果或問題</li></ul> |

### 協作流程

1. **你提出想法 / 看到問題**
   - 簡短說明（例如「按鈕倒圓角」「顏色不搭」）
   - 貼截圖路徑（當前狀態）
   - 說明背景或感受

2. **我做分析 + 提方案**
   - 讀截圖 + DESIGN.md + 代碼現況
   - 分析問題根源
   - 提出多個方案 + 推薦方向
   - 給出 DESIGN.md 改動 + Cursor Prompt

3. **你確認方向**
   - 選擇最滿意的方案
   - 或提出調整

4. **我更新文檔**
   - 改 DESIGN.md
   - 寫最終 Cursor Prompt

5. **Cursor 實作 + 測試**
   - 按 Prompt 改代碼
   - 本機測試
   - 截圖回報效果

### 優點

✅ **決策在 Claude Code** — 有全局視角 + 設計系統背景  
✅ **實作在 Cursor** — 專注編碼，不走冤枉路  
✅ **DESIGN.md 始終最新** — 單一真相來源，下次參考  
✅ **不重複改** — 先規劃好再改，避免改了又改  

---

## 最新 recap（2026-06-30）— 下次開 chat 可說「recap」

### 今日進度（2026-06-30）

**完成項目：**
1. ✅ 移除實物換算功能（translations.ts 清理）
2. ✅ 設計幣值選擇功能（NT$ / £ / $，獨立於語言）
3. ✅ Cursor 實作幣值選擇完成（CurrencyContext + CurrencySelectorButton）
4. ✅ 用戶確認幣值選擇效果可以
5. ✅ 更新 DESIGN.md — 加入幣別選擇規範（D1 已實作）

**設計中（待實作）：**
1. 🔄 按鈕 Hover 效果統一（所有按鈕 hover 時黃底 #fef08a + 紅字 #b91c1c）
   - 老闆鍵 hover 改成「動一動」效果
   - 統一所有按鈕 hover 樣式

**新工作流程確認：**
- 不再創建額外的 CURSOR_PROMPT_*.md 檔案
- 設計方案 → 用戶確認 → 改動清單在對話中給 → Cursor 實作 → 確認後更新 DESIGN.md

**用戶感受：**
- 看到 Museum of Money 設計風格，想套用到專案（深色科技感 + 黃色 + 霓虹綠）
- 但這是重大設計決策，暫緩討論（用戶已疲勞）

### 下一步
1. 給 Cursor 按鈕 hover 改動清單
2. 實作完後確認
3. 更新 DESIGN.md
4. 決定是否改整體風格（Museum of Money 風格？）或保持現有手繪風
5. Vercel 部署

---

## 上個 recap（2026-06-29）— 已歸檔

### 設計升級（參考 Lobb's Padel）

**按鈕 & 輸入框視覺區隔**（方案 B）
- 按鈕圓角：8px → **16px**（圓潤感 affordance）
- 輸入框邊框：藍 #457b9d → **黑 #111**（統一邊框色，用形狀差異區隔）
- 輸入框圓角：保持 0px（銳角）
- 已寫入 DESIGN.md v1.3

**老闆鍵改版**
- 移除底部紅色大橫幅背景（`.boss-key-bar` → `transparent`）
- 按鈕本身：紅背景 #e63946 + 白文字 #fff + 8px 圓角
- Hover / Active：深紅 #b91c1c（緊急鍵視覺語言）
- 已寫入 DESIGN.md v1.3

**排版 & 字體升級**（參考 Lobb's Padel 策略）
- 字體：Serif `Noto Serif SC` → **系統無襯線**（-apple-system 堆棧）；App 標題除外
- 字重：加 **700 bold** 強調金額、標題、核心數字
- 行距：**1.5–1.6**（寬鬆掃讀）
- 段落寬度：**max-width 75ch**（減少認知負荷）
- 已寫入 Cursor Prompt

**色彩簡化**
- 移除：橘 #f4a261（primary 按鈕）、紫 #8338ec（分享按鈕）
- 保留核心 5 色：紅、藍、綠、黑、灰 + 黃（active）
- 分享按鈕文字改紅（統一按鈕 active 語言）
- 已寫入 Cursor Prompt + DESIGN.md v1.3

### 協作方式確認
- Claude Code = 設計決策、DESIGN.md 更新、Cursor Prompt 撰寫
- Cursor = 代碼實作、本機測試、截圖反饋
- 所有規範先在 DESIGN.md 寫定，再推給 Cursor（避免重複改）

### 待實作清單（Cursor）
1. **P0**：按鈕 16px 圓角 + 輸入框黑邊
2. **P0**：老闆鍵樣式改版
3. **P0**：字體改無襯線、字重 700、行距 1.5、段落寬度 75ch
4. **P0**：色彩簡化（移除橘紫）
5. **P1（現在）**：幣值選擇（NT$ / £ / $）
   - 幣值獨立選擇（不綁語言）
   - 支援：NT$ / £ / $（美金）
   - 位置待定：設定頁 或 Header 右側

### DESIGN.md 狀態
- v1.3 已完成（§0–§5.6 包含所有改動；§11 差異清單已更新）

---

## 最新 recap（2026-06-26）— 下次開 chat 可說「recap」

### 今日 Cursor 進度（版面統一 + Design System）

**參考 Lobb's Padel 簡化視覺**：正文改系統無襯線；金額／標題字重 **700**；行距 1.5–1.6、段落 `max-width: 75ch`；移除橘／紫按鈕色。

**全站色彩（Result-led）**
- 標籤／欄位名 → **灰** `#666`
- 所有 stat 數字（金額、時間、輸入值）→ **紅** `#e63946` + 700
- 已淘汰：計時頁 live 金額綠 `#2a9d8f`、stat 標籤藍

**四頁版面**
- **Setup**：頁首 `setupTitle`（`result-big-title` 紅 42px）；說明 + how-to 在表單外；每分鐘薪資用 `result-stat-hero`
- **Timer**：無頁內標題；`StopwatchDial` 260px 紅環；偷到金額 64px 紅；▶ 與結束摸魚同寬同高；**從設定／結果進場自動計時**；薪資未設時 ▶ disabled + hint（不導回設定）
- **Result**：灰標籤紅數字；今日戰績黃底無框；紀錄 inline；空狀態無 speech、**前往計時｜前往設定** 等寬並排
- **History**：無頁標；黃底今日戰績；返回（藍）｜清空（紅）
- 四頁 `.page-card` padding 統一；Header **≤520px** 標題上列、nav 下列靠右

**老闆鍵**
- 灰橫幅 `#333` + 右下紅緊急鍵；hover／按下：黑底 + 紅字 + **紅邊**

**DESIGN.md**
- 更新至 **v1.7**（App Shell、四頁區塊、按鈕文字色分表、§11 差異清單）

### 程式變更摘要（今日）
| 檔案 | 重點 |
|------|------|
| `src/index.css` | 全站色彩、padding、Header 斷點、按鈕／輸入 affordance、老闆鍵 hover |
| `src/pages/SetupPage.tsx` | `setupTitle`、`result-stat` 每分鐘薪資 |
| `src/pages/TimerPage.tsx` | 自動計時、`result-stat`、▶ disabled 修正 |
| `src/pages/ResultPage.tsx` | 空狀態、繼續摸魚 `startTimer()` |
| `src/pages/HistoryPage.tsx` | `result-total-plain` 取代 RoughFrame 黃框 |
| `src/context/AppStateContext.tsx` | 薪資持久化 |
| `src/lib/storage.ts` | `loadSalaryConfig` / `saveSalaryConfig` |
| `src/i18n/translations.ts` | `setupTitle`、導覽色簡化 |
| `on-the-clock/DESIGN.md` | v1.7 |

### 下次待辦（優先）
1. 幣值選擇功能（NT$ / £ / $）
2. Vercel 部署 + OG 圖
3. `RoughInput` `:focus-visible` 光暈（P2）
4. CSS design tokens 擴充（`:root`）

### 本機測試
```bash
cd on-the-clock && npm run dev
# http://localhost:5173/
```
- 改 code 後 **Cmd + Shift + R**
- 尚未部署 Vercel

---

## 上次對話 recap（2026-06-27）

### 版面與文案
- **結果頁**：本次戰績置中；時間／金額改上下排列；「今天戰績」取代今日合計；移除「賺到了賺到了」
- **紀錄頁**：接上今日戰績資料；移除多餘標題；「返回上一步」與「清空紀錄」並排
- **設定頁**：插圖裁切（去掉「我今天就是個廢物」）；表單依格式塔分組；黑字標籤（請先輸入薪資、工時）
- **計時頁**：▶／暫停改圖示；結束摸魚按鈕修正（老闆列 pointer-events 穿透）
- **語言**：EN 旁「中」→「中文」；英文幣別改 **$**

### 老闆來了
- 固定底部紅色麥克筆條 + RoughButton「老闆來了／老闆走了」
- 假 Outlook 郵件全屏；計時背景繼續；Esc 返回
- 與頁面按鈕加大安全間距，防誤觸

### 設計與測試
- 新增 **`on-the-clock/DESIGN.md`** 輕量 design system
- **Impeccable 設定頁審查**（22/40）：主要問題 = 按鈕不像按鈕、how-to 順序與表單脫節 → **尚未實作修復**
- 使用者回饋：一進來不知道怎用 → 已加四步驟說明 +「開始計時」文案 + 計時頁提示（待 Impeccable 建議重排）

### 本機測試提醒
- 需終端機跑 `npm run dev -- --host`；網址貼**瀏覽器**（注意 5173 / 5174 埠號）
- 改 code 後 **Cmd + Shift + R** 強制重新整理
- 尚未部署 Vercel；同 Wi‑Fi 用 Network 網址給朋友測

### 下次可優先做
1. ~~薪資三模式~~（已完成 2026-06-26）
2. **Design System 正式規劃**
3. **RoughButton primary variant**（填色主按鈕，解「不像按鈕」）
4. **設定頁 layout 重排**（表單上移、how-to 精簡）
5. 依 Impeccable 審查：1A + 2B + 3A 或跟 Rowan 確認優先順序

---

## 上次對話 recap（2026-05-08）

### 裝好了 Designer Skills
Rowan 在 `/Users/linyuxian/designer-skills/` 安裝了一套 UX 設計工具包，涵蓋 7 個 plugin、共 60+ 個 skills，可以在這個專案的設計決策上派上用場。

**重要設定：**
- 不需要記 skill 名稱，直接描述需求，Claude 自動偵測並執行對應 skill
- 每次執行 skill 前會先通知你在用哪個工具
- 設定檔在 `design-research/CLAUDE.md` 和 memory 檔裡

### Stingray Model
Rowan 採用 Stingray Model（Board of Innovation, 2024）作為設計框架，取代傳統 Double Diamond：
- **Train** → 快速建立基礎，不花幾週做 empathy research
- **Develop** → 問題與方案同時並行探索
- **Iterate** → 同步驗證 desirability + feasibility + viability

完整 Stingray × Skills 對照表在：`/Users/linyuxian/designer-skills/STINGRAY-WORKFLOW.md`

### 下一步建議
薪水小偷目前 Setup Page 完成，Timer / Result / History 待開發。
可以考慮用 designer skills 幫這個專案做：
- `user-persona` — 確認目標用戶是誰
- `jobs-to-be-done` — 為什麼人們會想用這個 app
- `usability-test-plan` — 上線前測試核心流程
