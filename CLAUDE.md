# 薪水小偷 / On The Clock - 專案筆記

> **與 Grok 的協作模式**（分工、節奏、prompt 規則）→ 見專案根目錄 **[`GROK.md`](./GROK.md)**。  
> 本檔專注專案進度與規格；合作怎麼跑以 `GROK.md` 為準。

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

1. **討論 + 定案**（Claude + Rowan）
   - 分析問題、提方案、確認方向
   - 產品 / 設計決策確認後可立即寫進 CLAUDE.md

2. **我生產 Cursor Prompt**
   - 寫清楚改哪些檔案、改什麼
   - 不改 code，不先更新 CLAUDE.md（code 類）

3. **你貼進 Cursor 測試**
   - Cursor 實作
   - 本機測試或 Vercel 確認

4. **截圖給我確認**
   - 我確認測試是否成功
   - 若有問題 → 回步驟 2 修 Prompt

5. **確認成功 → 我才更新 CLAUDE.md**
   - 只有 code 改動確認成功後才更新進度
   - 設計規格同步更新 DESIGN.md

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

---

## 🎯 現在的任務（2026-07-06 晚上更新）

**狀態：Phase 2a-Step 1 實作中 — 單機排名系統（個人成就）**

### 用戶背景確認（重要！）
- **開發者**：Rowan（設計師背景，第一次寫程式）
- **工具**：Cursor（代碼實作）+ Claude Code（架構決策）
- **項目目的**：作品集項目
- **決策**：維持網頁版，未來再根據反饋改 React Native App

### 今日進度（2026-07-06）

**✅ 完成的設計決策：**
1. 後端技術選擇：**Firebase**（初學者友好、React Native 可複用）
2. 開發策略：**Wireframe 先驗證邏輯**，再用 v0 精細設計
3. 頁面架構：優化為**三頁面**（Result → History → Achievement）
4. 命名統一：全站統一用「**戰績**」和「**紀錄**」詞彙
5. Tab 樣式：統一使用 **Result 頁風格**（result-tab-bar / result-tab）

**✅ 架構優化過程：**
1. 初版：4 個頁面（Result / History / AllRecords / Milestones）
   → 改進：3 個頁面（Result / History / Achievement）
2. AllRecords 從獨立頁面 → 合併進 History 的 Tab
3. History Tab 從雙層 → 簡化為單層（2 個 Tab）
4. History Tab 2「全時間紀錄」優化：按月份分組，倒序排列

**✅ 給 Cursor 的改動清單：**
- [ ] History 頁：改成 2 個 Tab（本日 + 全時間按月份分組）
- [ ] Milestones 改名為 Achievement
- [ ] 路由：/milestones → /achievement
- [ ] Nav 菜單：「里程碑」→ 「成就」，「紀錄」保持
- [ ] Tab 樣式統一：用 result-tab-bar / result-tab
- [ ] 翻譯字串：統一「戰績」和「紀錄」

---

## 📊 Phase 2a：單機排名系統（進行中）

**時間線**：5–8 天（分兩個 Step）  
**目標**：完成個人里程碑頁面，展示用戶成績統計

### 設計方案（優化版 + 全紀錄頁面）

**三頁面職責分工（2026-07-06 最終確定）：**
- **Result 頁** → 「我最後摸了多少」（本次金額 + 今日累計 + 前 3 筆今日記錄）
- **History 頁（我的紀錄）** → 「紀錄」
  - Tab 1「本日紀錄」→ 今日所有詳細記錄
  - Tab 2「全時間紀錄」→ 全部詳細記錄，按月份分組（最新月份在上）
- **Achievement 頁（我的戰績）** → 「戰績」（改名：不用 Milestones）
  - Tab 1「本月戰績」→ 本月最佳單次 + 本月累計
  - Tab 2「累計戰績」→ 全時間最高 + 累計總額

**命名統一（全站）：**
- 計時工具用「計時」（Timer）
- 結果頁面用「結果」（Result）— 包含「重新設定薪資」按鈕
- 記錄頁面用「紀錄」（History）
- 統計頁面用「戰績」（Achievement）
- **Nav 菜單簡化為 4 項**：計時 → 結果 → 紀錄 → 戰績（移除「設定」，改用 Result 頁的「重新設定薪資」按鈕）

**導航流程：**
```
Result 頁
  ├─ 按「查看更多」 → History 頁（本日紀錄 Tab）
  └─ 按「里程碑」 → Milestones 頁（統計）

History 頁（改進，有 Tab）
  ├─ Tab 1「本日紀錄」（今日詳細列表）
  ├─ Tab 2「全紀錄」（本月 + 全時間詳細列表）
  └─ 按「返回」 → Result 頁

Milestones 頁（統計數字）
  ├─ 按「查看詳細紀錄」 → History 頁（全紀錄 Tab）
  └─ 按「返回」 → Result 頁

Nav 導航（簡化）：設定 → 計時 → 結果 → 歷史 → 里程碑
```

**頁面內容示例：**

**AllRecords 頁（新增）：**
```
【本月記錄 Tab】
第 1 次  0:05  NT$150  (2026-07-03)
第 2 次  0:04  NT$120  (2026-07-02)
...

【全時間記錄 Tab】
第 1 次  0:06  NT$180  (2026-06-15)
第 2 次  0:05  NT$150  (2026-07-03)
...

[返回]
```

**Milestones 頁（統計數字）：**
```
🏆 你的里程碑

【本月成績】
最佳單次：NT$150 (0:05) - 2026-07-03
本月累計：NT$2,450

【累計成績】
全時間最高：NT$180 (0:06) - 2026-06-15
累計總金額：NT$8,920

[返回] [查看詳細紀錄]
```

**設計優勢：**
- ✅ 四個頁面各司其職，不重複
- ✅ 邏輯清晰（統計 vs 詳細列表分開）
- ✅ 用戶場景完整（想看統計、想看記錄都能滿足）
- ✅ 對作品集有利（展示「信息架構設計」能力）

### 技術改動清單（Phase 2a）

#### **Step 1：Wireframe 驗證邏輯（3–5 天）**

**前端改動：**
- [ ] 改動 `src/pages/HistoryPage.tsx`（加入 Tab）
  - 保持現有的「本日紀錄」內容
  - 新增 Tab 結構（本日紀錄 / 全紀錄 Tab）
  - Tab 1「本日紀錄」：顯示今日詳細列表（保持原樣）
  - Tab 2「全紀錄」：顯示本月 + 全時間詳細列表（新增）
    - 內部再分為「本月記錄」和「全時間記錄」（子 Tab 或按鈕切換）
  - 簡單樣式即可（無需涂鴉）

- [ ] 新增 `src/pages/MilestonesPage.tsx`（統計數字）
  - 簡單 HTML 結構（無需涂鴉風格、貓圖）
  - 基本 Tailwind CSS（灰白樣式即可）
  - Tab 1：本月成績（最佳單次 + 累計）
  - Tab 2：累計成績（全時間最高 + 累計）
  - 按鈕：[返回] [查看詳細紀錄]

- [ ] 新增 `src/lib/milestones.ts`
  - `getCurrentMonthSessions()` — 讀取當月所有記錄
  - `getCurrentMonthStats(sessions)` → { bestSingle, totalStolen }
  - `getAllTimeSessions()` — 讀取所有月份
  - `getAllTimeStats(sessions)` → { bestSingle, totalStolen }

- [ ] 擴展 `src/lib/storage.ts`
  - 新增 `loadMonthlyHistory(yearMonth)` — 讀取 'on-the-clock/monthly-history-{YYYY-MM}'
  - 新增 `saveMonthlyHistory(yearMonth, records)` — 保存月份歷史
  - 修改 `saveTodaySessions()` — 同時追加到當月的 monthly-history

- [ ] 更新路由（src/main.tsx）
  - 新增 `/milestones` 路由 → MilestonesPage

- [ ] 更新導航（src/components/NavMenu.tsx）
  - 漢堡菜單加入「里程碑」選項
  - 導航順序：設定 → 計時 → 結果 → 歷史 → 里程碑

**邏輯測試（重點）：**
- ✅ 本月最高 / 累計計算正確
- ✅ 全時間最高 / 累計計算正確
- ✅ 日期格式正確（中英文各異）
- ✅ 無數據時顯示「暫無數據」
- ✅ Tab 切換無誤
- ✅ 按鈕導航可用

#### **Step 2：v0 精細調整（2–3 天，邏輯確認後）**

**設計改動（邏輯代碼不動）：**
- [ ] 參考 Result 頁風格
- [ ] 加入涂鴉元素（RoughBox、DoodleMarks）
- [ ] 加入貓插圖 + 對話泡泡
- [ ] 調整字體、顏色、間距
- [ ] 確保響應式設計（≤520px）

### 路由結構（新增）
```
/setup    — 設定頁（現有）
/timer    — 計時頁（現有）
/result   — 結果頁（現有）
/history  — 今日歷史（現有）
/milestones 或 /leaderboard — 個人里程碑（新增）
```

### 導航更新
- Header 漢堡菜單：「設定」→「計時」→「結果」→「歷史」→「里程碑」
- 或者單獨在 Header 右側加「里程碑」圖示

---

## 🔥 Phase 2b：Firebase + Google 登入（3 周後）

**時間線**：2–3 周  
**技術方案**：✅ Firebase + Google OAuth2（確定）
- 認證方式：**Google 登入**（一鍵登入，無需密碼）
- 後端：Firebase Authentication + Firestore
- 理由：
  - 初學者友好（Firebase 內建認證）
  - Cursor 支持好（Firebase SDK 文檔完善）
  - 作品集加分（展示 OAuth2 + 認證系統）
  - React Native 可完全複用

### Phase 2b 架構規劃

**用戶認證流程：**
```
首次進入
  → 「Google 登入」按鈕（新頁面：LoginPage）
  → Firebase Authentication（一鍵登入）
  → 自動建立用戶檔案 + 初始化數據
  → 進入主應用（Result 頁）

已登入用戶
  → 直接進入主應用
  → Header 右側顯示用戶名 + 登出按鈕
```

**Firebase 資料結構：**
```
users/
  ├─ {userId}
  │  ├─ email
  │  ├─ displayName
  │  ├─ photoURL
  │  ├─ currency
  │  ├─ createdAt
  │  └─ monthlyStats
  │     └─ {YYYY-MM}
  │        ├─ totalStolen
  │        ├─ sessionsCount
  │        └─ bestSession

sessions/
  ├─ {userId}
  │  └─ {sessionId}
  │     ├─ startAt
  │     ├─ endAt
  │     ├─ elapsedMs
  │     ├─ stolenAmount
  │     └─ timestamp

leaderboards/
  ├─ {monthId} (e.g., "2026-07")
  │  ├─ {userId}: stolenAmount
  │  └─ ...

friends/
  ├─ {userId}
  │  └─ {friendUserId}: true （朋友列表）
```

### Phase 2b 功能清單（待實作）
- [ ] LoginPage：Google 登入按鈕
- [ ] Firebase Authentication 設置
- [ ] 用戶檔案頁面（顯示用戶名、登出按鈕）
- [ ] 當月 / 當週排名表（多人競賽）
- [ ] 朋友邀請系統
- [ ] 實時排名更新（Firestore listeners）

---

## ✅ 已完成

| Phase | 項目 | 狀態 | 日期 |
|-------|------|------|------|
| 1 | UI v0（黑白涂鴉）| ✅ | 2026-07-05 |
| 1 | Timer 核心功能 | ✅ | 2026-07-05 |
| 1 | 薪資三模式 + 幣別 | ✅ | 2026-06-30 |
| 1 | 今日歷史 + localStorage | ✅ | 2026-06-27 |
| 2a | 里程碑頁面設計 | 🔄 | - |
| 2a | 單機排名實作 | ⏳ | - |
| 2b | Firebase 架構設計 | 📅 | - |

---

## 🛠️ 下次 Cursor 開檔時

### 說什麼
"Phase 2a Step 1：Milestones Wireframe（邏輪碼 Prompt 已準備好，複製粘貼下面的內容）"

### 準備物品
1. 本檔案的「Phase 2a-Step 1 改進版 Cursor Prompt」（見下方）
2. 測試清單（邏輯驗證）

### 開發順序
**Step 1（現在）** → 邏輯驗證（3–5 天）
**Step 2（邏輯確認後）** → 精細設計（2–3 天，用 v0）

### 不會重複討論的項目
✅ 為什麼 Wireframe 先驗證  
✅ 為什麼不用記錄列表  
✅ 三頁面的職責分工  

---

## 📋 Phase 2a-Step 1 改進版 Cursor Prompt

複製以下全文，貼進 Cursor Chat：

\`\`\`
【Phase 2a-Step 1：Milestones Wireframe】

任務：快速實現「里程碑」頁面邏輯，驗證功能正確。UI 設計暫不考慮（Step 2 再做）。

背景：
- 應用是「摸魚計時器」，localStorage 存 SessionRecord
- 現在要加「里程碑」頁面，展示本月 / 全時間的統計數字（不顯示記錄列表）
- 三頁面分工：Result（本次+今日）→ History（今日列表）→ Milestones（統計）

目標：
✅ HTML 結構清晰
✅ 邏輯 100% 正確
✅ 所有按鈕、Tab 都能用
✅ 日期、幣別、語言都支援

不用考慮（Phase 2a-Step 2 再做）：
❌ 涂鴉風格（RoughBox、DoodleMarks）
❌ 貓插圖、對話泡泡
❌ 精細字體、顏色、間距
❌ 與 Result 頁完全匹配的設計

【技術要求】

1. 擴展 src/lib/storage.ts
   - loadMonthlyHistory(yearMonth: string) → SessionRecord[]
     讀取 'on-the-clock/monthly-history-{YYYY-MM}' 的歷史
   - saveMonthlyHistory(yearMonth: string, records: SessionRecord[]) → void
     保存到 'on-the-clock/monthly-history-{YYYY-MM}'
   - 修改 saveTodaySessions(records)：
     同時追加最新記錄到當月的 monthly-history（例如 2026-07-06 → 'on-the-clock/monthly-history-2026-07'）

2. 新增 src/lib/milestones.ts
   - getCurrentMonthSessions() → SessionRecord[]
     讀取當前月份（new Date().toISOString().slice(0, 7)）的所有記錄
   
   - getCurrentMonthStats(sessions) → { 
       bestSingle: SessionRecord | null, 
       totalStolen: number 
     }
     計算本月最佳單次（最高 stolenAmount）和本月累計
   
   - getAllTimeSessions() → SessionRecord[]
     讀取 localStorage 所有 'on-the-clock/monthly-history-*' 的鍵，合併所有月份記錄
   
   - getAllTimeStats(sessions) → {
       bestSingle: SessionRecord | null,
       totalStolen: number
     }
     計算全時間最高和累計

3. 新增 src/pages/MilestonesPage.tsx
   - 簡單版本即可（無需涂鴉風格）
   - 結構：
     ├─ 標題「里程碑」
     ├─ Tab 1「本月成績」
     │  ├─ 最佳單次：NT$150 (0:05) - 2026-07-03
     │  └─ 本月累計：NT$2,450
     ├─ Tab 2「累計成績」
     │  ├─ 全時間最高：NT$180 (0:06) - 2026-06-15
     │  └─ 累計總金額：NT$8,920
     └─ 按鈕：[返回] [查看詳細紀錄]
   
   - 使用 useCurrency() 取幣別
   - 使用 useLanguage() 取語言
   - 如果無數據顯示 "--" 或「暫無數據」
   - Tab 切換正常工作

4. 更新路由
   - src/main.tsx：新增 `<Route path="/milestones" element={<MilestonesPage />} />`

5. 更新導航
   - src/components/NavMenu.tsx：漢堡菜單加入「里程碑」選項

【日期格式】
- 中文：M月D日（e.g., 7月3日）
- 英文：MMM DD, YYYY（e.g., Jul 03, 2026）

【測試清單（邏輯驗證）】
- ✅ 本月最高、累計計算正確
- ✅ 全時間最高、累計計算正確
- ✅ Tab 切換無誤
- ✅ 日期格式正確（中英各異）
- ✅ 無數據時顯示正確
- ✅ 「返回」按鈕 → /result
- ✅ 「查看詳細紀錄」按鈕 → /history
- ✅ 幣別符號正確
- ✅ 語言切換正常
\`\`\`

---

## 本機測試指令

```bash
cd on-the-clock && npm run dev
# http://localhost:5173/
# 改 code 後按 Cmd + Shift + R
```

## GitHub 推送

```bash
git add .
git commit -m "描述改動"
git push
```

---

## 📝 最新 Recap（2026-07-06 晚上）— 下次開 chat 可說「recap」

### 今日完成項目（設計決策）

**後端技術確認：**
- ✅ 選擇 Firebase（理由：初學者友好、Cursor 支持好、React Native 完全可複用）
- ✅ 排除 Supabase（SQL 曲線太陡）和自建後端（維護複雜）

**開發策略確認：**
- ✅ Wireframe 先驗證邏輯（3–5 天）
- ✅ 再用 v0 精細設計（2–3 天）
- ✅ 避免「設計無限調整」的陷阱

**頁面架構最佳化（經歷 3 次迭代）：**

迭代 1（初版）：
- Result → History → AllRecords → Milestones（4 個頁面）
- 問題：Nav 太複雜，功能有重複

迭代 2（改進版 1）：
- Result → History（含雙層 Tab：本日 / 全紀錄）→ Milestones
- 改善：AllRecords 併入 History
- 問題：雙層 Tab 用戶體驗差，「好亂」

迭代 3（最終版 ✅）：
- Result → History（2 個 Tab：本日 + 全時間按月份分組）→ Achievement
- 改善：
  - 單層 Tab，清晰簡潔
  - 全時間按月份分組（最新月份在上）
  - 命名統一，邏輯清晰

**命名統一（全站）：**
- ✅ 統計頁面：Milestones → **Achievement**（「我的戰績」）
- ✅ 記錄頁面：History（「我的紀錄」）
- ✅ 詞彙統一：「戰績」and「紀錄」（不混用「里程碑」、「戰利品清單」等）
- ✅ Nav 菜單：「設定」→「計時」→「結果」→「紀錄」→「成就」

**UI 統一：**
- ✅ 所有 Tab 使用 Result 頁風格（result-tab-bar / result-tab）
- ✅ 黑白涂鴉風格保持一致

### 給 Cursor 的最終改動清單

**檔案改名：**
- [ ] MilestonesPage.tsx → AchievementPage.tsx

**HistoryPage 改動：**
- [ ] 標題：「我的紀錄」
- [ ] Tab 改成 2 個（result-tab-bar 樣式）
  - Tab 1：本日紀錄（保持原樣）
  - Tab 2：全時間紀錄（按月份分組、倒序排列）

**AchievementPage 改動：**
- [ ] 標題：「我的戰績」
- [ ] Tab 1：「本月戰績」
- [ ] Tab 2：「累計戰績」
- [ ] Tab 樣式統一（result-tab-bar）

**路由和導航：**
- [ ] /milestones → /achievement
- [ ] Nav：「里程碑」→「成就」
- [ ] 菜單順序：設定 → 計時 → 結果 → 紀錄 → 成就

**翻譯字串：**
- [ ] historyTitle：「我的紀錄」/ "My Records"
- [ ] achievementTitle：「我的戰績」/ "My Achievements"

### 當前狀態

**Phase 2a-Step 1 進度：60% ✅**
- ✅ Timer 功能驗證完成
- ✅ Wireframe 架構設計（經 3 次迭代優化）
- 🔄 Cursor 實作中（Wireframe 已做，待修改為最終設計）
- ⏳ 待做：改動清單實施 → 邏輯驗證 → Step 2（v0 精細設計）

### 下次 Cursor 打開前

**說什麼：**
"Phase 2a 最終改動清單（命名統一 + 單層 Tab）。Prompt 已在 CLAUDE.md 最下方。"

**Cursor 會看：**
1. 三頁面職責分工（最終確定）
2. 完整改動清單（HistoryPage / AchievementPage / 路由 / 翻譯）

**不會重複討論：**
✅ 為什麼用 Firebase  
✅ 為什麼 Wireframe 先驗證  
✅ 為什麼簡化為 3 頁面  
✅ 命名統一的原因

### 本機測試指令

```bash
cd on-the-clock && npm run dev
# http://localhost:5173/
# 改 code 後按 Cmd + Shift + R
```

---

## 📝 最新 Recap（2026-07-07 晚上）— 下次開 chat 可說「recap」

### 完成內容（Phase 3 登入系統 + Firebase 完整設定）

**✅ Firebase Setup 100% 完成：**
1. 建立 Firebase 項目：on-the-clock-production
2. 啟用 Google OAuth2 登入 ✓
3. 啟用 Email 驗證碼登入（無密碼方式）✓
4. 建立 Firestore Database
   - 位置：asia-east1 (Taiwan)（考慮用戶主要在台灣，英國次要）
   - 模式：測試模式（30 天內改生產規則）
5. 取得 Firebase Config（給 Cursor 用）✓

**✅ 設計決策確認：**
- 登入流程 1：Google → OAuth → /setup-profile
- 登入流程 2：Email → 發驗證碼 → 輸入 6 位碼 → /setup-profile
- 驗證碼方式：Firebase Email Link（無密碼）
- 多人競賽架構：**朋友排行榜**（邀請制，非全球排行榜）
- 用戶名顯示：先用 Google displayName，後續讓用戶改
- 郵箱驗證方案：發送 6 位驗證碼到郵箱
- UI 風格：**Apple Kit 簡約風格 Wireframe**（現在）→ 手繪涂鴉升級（Phase 3b）

**✅ 文檔已建立：**
- `FIREBASE_SETUP_GUIDE.md` — 完整的 Firebase 手動設定步驟（9 步）
- `CURSOR_PROMPT_PHASE3_LOGIN.md` — Phase 3-Step 1 完整 Prompt（給 Cursor 用）

**✅ Firestore 結構設計：**
```
users/{userId}
  - email, displayName, photoURL, currency, language
  - stats: { monthlyStats, allTimeStats }

sessions/{userId}/{sessionId}
  - startAt, elapsedMs, stolenAmount, currency, timestamp

friends/{userId}/{friendUserId} (Phase 3b)
leaderboards/"friends-{userId}-{monthId}" (Phase 3b)
```

### Firebase 配置信息（已驗證）

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxGz7oVzfdm5hQIk5n4AoPAoi3u7kfRKs",
  authDomain: "on-the-clock-production.firebaseapp.com",
  projectId: "on-the-clock-production",
  storageBucket: "on-the-clock-production.firebasestorage.app",
  messagingSenderId: "138828683769",
  appId: "1:138828683769:web:c077b2dd22fcfca4980528"
};
```

### 下次行動清單

**Phase 3-Step 1：Cursor 實作**
1. 複製 CURSOR_PROMPT_PHASE3_LOGIN 的 Prompt 內容
2. 貼進 Cursor Chat
3. 預估 5-7 天完成：
   - ✓ LoginPage（Google + Email）
   - ✓ VerifyEmailPage（6 位碼輸入）
   - ✓ SetupProfilePage（設定昵稱）
   - ✓ UserProfilePage（用戶檔案）
   - ✓ AuthContext（全局認證狀態）
   - ✓ Firestore 集合建立
   - ✓ Protected Route 守衛

**Phase 3-Step 2：朋友邀請機制**（邏輯驗證完成後）
- 邀請碼生成 + 分享
- 朋友關係建立
- 月度排行榜（本月 vs 累計）

### 重要決策記錄

**為什麼選台灣作為 Firestore 位置？**
- 用戶主要在台灣 → asia-east1 (Taiwan) 最近
- 英國用戶次要 → 延遲 200-400ms（可接受）
- 未來支持多地域複製時可升級
- MVP 階段先驗證功能，後期根據用戶分布優化

**為什麼用 Apple Kit 簡約風格做 Wireframe？**
- 快速驗證登入邏輯（5-7 天）
- Phase 3b 再升級手繪涂鴉風格
- 避免設計完美主義卡住開發進度
- Wireframe 重點：邏輯 100% 正確 > 美觀

**為什麼選朋友排行榜而非全球排行榜？**
- 初期開發複雜度低
- 用戶黏著度高（和朋友競賽）
- Firestore 查詢成本低（局部排行 vs 全球排行）
- 不影響多人競賽的核心價值

### 本機測試（Cursor 實作完成後）

```bash
cd on-the-clock && npm run dev
# http://localhost:5173/

# 測試流程：
# 1. Google 登入 → /setup-profile → /result
# 2. Email 登入 → 輸入 6 位碼 → /setup-profile → /result
# 3. 刷新頁面 → 保持登入狀態
# 4. 點登出 → /login
```

### 資源連結

- **FIREBASE_SETUP_GUIDE.md**：Firebase 手動設定步驟（9 步 + 常見問題）
- **CURSOR_PROMPT_PHASE3_LOGIN.md**：Phase 3-Step 1 完整 Prompt + 11 項技術需求
- Firebase 文檔：https://firebase.google.com/docs
- React Router：https://reactrouter.com/

---

## 📝 最新 Recap（2026-07-07 夜間）— 下次開 chat 說「我要檢查登錄流程頁面」

### 完成內容（Phase 3-Step 2：Sign In / Sign Up 分頁）

**✅ Phase 3-Step 2 完成：**
1. ✅ LoginPage.tsx → SignInPage.tsx（重新命名）
2. ✅ 新增 SignUpPage.tsx（結構複製自 SignInPage）
3. ✅ 路由更新：/login → /signin，新增 /signup
4. ✅ 添加翻譯字串（中英文）：
   - signInTitle / signUpTitle
   - noAccount / haveAccount / signUpLink / signInLink
   - termsText（Terms of Service 條款）
5. ✅ SignIn 頁底部加「沒有帳戶？註冊」連結 → /signup
6. ✅ SignUp 頁底部加「已有帳戶？登入」連結 → /signin
7. ✅ SignUp 頁在按鈕上方顯示 Terms of Service 文案

**Cursor 實作完成狀況：**
- 文件改名：LoginPage → SignInPage ✓
- 新增 SignUpPage（Google + Email 登入邏輯完全相同）✓
- 路由更新（/signin / /signup）✓
- 翻譯字串（中英文 Terms）✓
- 頁面底部連結（Sign In ← → Sign Up）✓

### Phase 3 整體進度

| Step | 項目 | 狀態 | 日期 |
|------|------|------|------|
| 3-1 | LoginPage + Email/Google 認證 | ✅ 完成 | 2026-07-07 |
| 3-2 | Sign In / Sign Up 分頁 | ✅ 完成 | 2026-07-07 |
| 3-3 | **待做：檢查登錄流程頁面** | 🔄 下次 | - |
| 3-4 | 朋友邀請機制 | 📅 之後 | - |

### 本機測試準備

**要檢查的項目（下次開 chat 做）：**
```bash
cd on-the-clock && npm run dev
# http://localhost:5173/
```

**測試清單：**
- [ ] /signin 頁面：Sign In 標題 + Google / Email 登入 ✓
- [ ] /signin 底部：「沒有帳戶？註冊」連結正常 → /signup
- [ ] /signup 頁面：Get Started 標題 + 同上登入選項
- [ ] /signup 頁面：顯示 Terms of Service 文案
- [ ] /signup 底部：「已有帳戶？登入」連結正常 → /signin
- [ ] 中文 / 英文切換：文字正確顯示
- [ ] Google 登入流程：/signin → OAuth → /verify-email → /setup-profile → /result
- [ ] Email 登入流程：/signin → 輸入郵箱 → /verify-email (6位碼) → /setup-profile → /result
- [ ] Sign Up 流程：/signup → Google/Email → 同上流程
- [ ] 已登入用戶訪問 /signin 或 /signup：自動重導 → /result（GuestRoute）

### 檔案清單（Phase 3 已建立）

**認證相關：**
- ✅ src/lib/firebase.ts — Firebase 初始化 + Config
- ✅ src/lib/emailVerification.ts — 6位碼驗證邏輯 + Firestore emailVerifications 集合
- ✅ src/lib/userProfile.ts — 用戶檔案 CRUD + users Firestore 集合
- ✅ src/context/AuthContext.tsx — 全局認證狀態管理
- ✅ src/components/ProtectedRoute.tsx — 路由守衛（GuestRoute + ProtectedRoute）

**頁面（Phase 3）：**
- ✅ src/pages/SignInPage.tsx — 登入頁（Google + Email）
- ✅ src/pages/SignUpPage.tsx — 註冊頁（Google + Email + Terms）
- ✅ src/pages/VerifyEmailPage.tsx — 郵箱驗證頁（6位碼輸入 + 倒數計時）
- ✅ src/pages/SetupProfilePage.tsx — 初始檔案設置（昵稱輸入）
- ✅ src/pages/UserProfilePage.tsx — 用戶檔案頁（編輯昵稱 + 登出）

**路由：**
- ✅ src/App.tsx — 更新路由（/signin / /signup / /verify-email / /setup-profile / /user-profile）
- ✅ src/main.tsx — 應用入口

**翻譯（Phase 3 新增）：**
- ✅ signInTitle, signInSubtitle
- ✅ signUpTitle, signUpSubtitle
- ✅ noAccount, haveAccount, signUpLink, signInLink
- ✅ termsText（Terms of Service）
- ✅ loginSubtitle, loginWithGoogle, loginOr, loginEmailLabel, loginSendCode
- ✅ authGoogleError, authEmailError
- ✅ verifyEmailTitle, verifyEmailSent, verifyCodeDigit, verifySubmit, verifyResend, verifyResendWait
- ✅ authCodeIncomplete, authCodeInvalid
- ✅ setupProfileTitle, setupProfileSubtitle, setupProfileNameLabel, profileNameRequired, profileSaveError
- ✅ userProfileTitle, profileEditName, profileSave, profileSignOut

### 下次行動（優先）

**立即做（下次 chat）：**
1. ✅ 執行 `npm run dev`
2. ✅ 檢查上述「測試清單」的 9 項
3. ✅ 截圖 Sign In / Sign Up 頁面給 Claude 確認
4. ✅ 反饋是否有樣式問題或流程問題

**後續（邏輯驗證完成後）：**
1. Phase 3-Step 3：朋友邀請機制
2. Phase 3-Step 4：月度排行榜
3. 樣式升級（Apple Kit → 手繪涂鴉）

### 重要提醒

- **登出後重導路由**：LoginPage 改成 SignInPage，檢查所有導出登出的地方（如 ProtectedRoute）
- **Terms of Service**：目前是簡單文案，未來可改成彈窗或獨立頁面
- **本機測試很重要**：確保 Sign In ↔ Sign Up 連結、認證流程、重導都正常

---

## 📝 最新 Recap（2026-07-08）— Nav Bar 精簡 + 右滑抽屜 ✅

### 完成狀態：全部實作完成

**Nav Bar 改版完成：**
```
改前：[Logo] · [EN][中文] · [頭像 + 名字] · [☰下拉]
改後：[Logo] · [EN][中文] · [頭像]        · [☰右滑抽屜]
```

**抽屜結構（已實作）：**
```
選單 / Menu                          [X]
────────────────────────────────────────
[頭像]  用戶名字（點擊 → /user-profile）
────────────────────────────────────────
計時                                  ›
結果                                  ›
紀錄                                  ›
成就                                  ›
```

### 技術實作細節

**新增文件：**
- `src/components/NavDrawer.tsx` — Drawer 組件，`createPortal` 渲染到 body，Esc 關閉，body overflow hidden

**改動文件：**
- `src/components/NavMenu.tsx` — 重寫，import useAuth 取用戶資料，用 NavDrawer 替代 RoughFrame 下拉
- `src/index.css` — 新增 nav-drawer-* 系列樣式；`.user-menu-name / .app-user-name` 設為 `display: none`
- `src/i18n/translations.ts` — 新增 `navDrawerTitle`（EN: "Menu" / 中: "選單"）

**抽屜 RWD 寬度：**
- 桌機：420px
- 平板（≤768px）：85vw
- 手機（≤480px）：92vw

### 已知修正（告訴 Cursor）

頭像 fallback 背景色是藍色 `#0066ff`，需改成黑色 `#111111`：
```css
/* src/index.css → .nav-drawer-avatar-fallback */
background: #111111;
```

### 下次開檔案說什麼

「Nav Bar 抽屜已完成，只剩 avatar fallback 顏色要改（藍→黑），其他可以繼續下一個功能。」

---

## 📋 Nav Bar Drawer Cursor Prompt

貼進 Cursor Chat：

```
【Nav Bar 精簡 + 右滑抽屜菜單】

目標：Nav Bar 移除用戶名字文字，漢堡菜單改成從右邊滑出的 Drawer（參考 Hims 設計）。

改動 1：隱藏 UserMenu 名字文字
在 src/index.css 找到 .user-menu-name 或 .app-user-name，加上 display: none

改動 2：新建 src/components/NavDrawer.tsx
Props: isOpen / onClose / children
功能：
- 渲染半透明黑色背景遮罩（點擊觸發 onClose），position: fixed, inset: 0, rgba(0,0,0,0.45), z-index: 200
- 渲染白色抽屜，position: fixed, right: 0, top/bottom: 0, border-left: 2px solid #111, z-index: 210
- 動畫：transform: translateX(100%) → translateX(0)，transition 0.3s cubic-bezier(0.4,0,0.2,1)
- isOpen 時監聽 Escape 鍵觸發 onClose
- isOpen 時 document.body.style.overflow = 'hidden'，關閉時還原

改動 3：重寫 src/components/NavMenu.tsx
- import useAuth 取得 user + profile
- 漢堡按鈕點擊 setOpen(true)（icon 永遠是三條線，不切換）
- 用 NavDrawer 替代 RoughFrame 下拉菜單
- Drawer header 結構（左右各一區）：
  左側：<span class="nav-drawer-title">選單</span>（語言是中文時）/ "Menu"（英文時）
  右側：X 關閉按鈕
- 用戶區塊（只在 user 存在時顯示）：圓形頭像 44px + 用戶名字
- 水平分隔線
- 導航菜單 ul，每個 NavLink 內容：左側文字 + 右側 <span aria-hidden="true">›</span>
- 菜單項點擊後 setOpen(false)
- useEffect 監聽 location.pathname 變化時自動 setOpen(false)

改動 4：CSS（src/index.css）

/* 抽屜寬度 - RWD */
.nav-drawer { width: 420px; }
@media (max-width: 768px) { .nav-drawer { width: 85vw; } }
@media (max-width: 480px) { .nav-drawer { width: 92vw; } }

/* overlay */
.nav-drawer-overlay：fixed, inset:0, rgba(0,0,0,0.45), z-index:200, opacity:0, pointer-events:none, transition opacity 0.28s
.nav-drawer-overlay.is-open：opacity:1, pointer-events:auto

/* 抽屜本體 */
.nav-drawer：fixed, right:0, top/bottom:0, bg:#fff, border-left:2px solid #111, z-index:210, translateX(100%) transition 0.3s, flex column, overflow-y:auto

/* header：左右對齊 */
.nav-drawer-header：display:flex, justify-content:space-between, align-items:center, padding:16px 24px, border-bottom:1px solid #e5e5e5
.nav-drawer-title：font-size:20px, font-weight:700
.nav-drawer-close：bg:none, border:none, cursor:pointer, font-size:24px, padding:4px, color:#111, hover:bg #f0f0f0, border-radius:4px

/* 用戶區塊 */
.nav-drawer-user：flex, align-items:center, gap:14px, padding:20px 24px
.nav-drawer-avatar：44px 圓形, border:2px solid #111, object-fit:cover
.nav-drawer-avatar-fallback：bg:#111, color:#fff, flex 置中, font-weight:700
.nav-drawer-username：font-size:16px, font-weight:600, overflow:ellipsis

/* 分隔線 */
.nav-drawer-divider：height:1px, bg:#e5e5e5, margin:0

/* 菜單項目 */
.nav-drawer .nav-menu-link：
  display:flex, justify-content:space-between, align-items:center
  padding:20px 24px
  font-size:18px, font-weight:500
  border-bottom:1px solid #e5e5e5
  border-left:none（移除之前的 left border 設計）
  color:#111
  text-decoration:none
.nav-drawer .nav-menu-list li:last-child .nav-menu-link：border-bottom:none
.nav-drawer .nav-menu-link:hover：bg:#f8f8f8
.nav-drawer .nav-menu-link.is-active：bg:#f0f0f0, font-weight:700

/* 右箭頭 */
.nav-drawer .nav-menu-link span[aria-hidden]：font-size:20px, color:#999

測試清單：
- 點 ☰ → 抽屜從右邊滑進，背景遮罩出現
- 點遮罩 → 關閉；按 Esc → 關閉
- 點菜單項 → 正確導航 + 抽屜關閉，右側有 › 箭頭
- 已登入：抽屜頂部顯示頭像 + 用戶名字
- Nav Bar：只剩圓形頭像（無名字文字）
- 語言切換 EN/中：title 和菜單項名稱正確
- RWD：手機 92vw、平板 85vw、桌機 420px
```

---

## 📝 最新 Recap（2026-07-08 晚）— 排行榜設計決策

### 下一個功能：排行榜（領獎台）

**設計決策（全部確認）：**

| 項目 | 決定 | 原因 |
|------|------|------|
| 競賽指標 | 總摸魚**時間**（不用金額） | 薪資是隱私，時間公平公開 |
| 排名規則 | 本月總時長最長 = 第一名 | 簡單直覺 |
| 時間範圍 | **本月制**，不做累計切換 | 像段考，每月重置，新人也有機會 |
| 版面結構 | 領獎台台階（前3名）+ 列表（第4名起） | 視覺衝擊 + 完整排名 |
| 頁面入口 | Nav 抽屜加第 5 項「排行榜」 | 與其他頁面一致 |
| 實作策略 | 先用**假資料** Wireframe，邏輯確認後再接 Firebase | 省事，先驗證 UX |

**頁面結構草圖：**
```
排行榜 / Leaderboard
2026年7月

        🥈         🥇         🥉
      小明         你         阿花
      1h 12m    1h 48m     0h 55m

  ──────────────────────────────
  4   大雄     0h 43m
  5   靜香     0h 31m
```

**UI 結構參考（兩張截圖合併）：**

台階區（參考截圖 2）：
- 三個實體台階，1st 置中且最高，2nd 左、3rd 右
- 圓形頭像**浮在台階上方**（不是嵌在裡面）
- 台階本體內有大大的數字 1 / 2 / 3
- 頭像下方：名字 + 時間

列表區（參考截圖 1）：
- 第4名起：排名數字 + 圓形頭像 + 名字 + 時間
- **自己那一行高亮顯示**（背景色不同），一眼找到自己

注意：只抄**結構**，不抄顏色——App 是黑白手繪風，顏色等 v0 階段再處理

**未來可加（不是現在）：**
- 名人堂：每月結束後記錄當月冠軍

### 下次開檔案說什麼

「上次討論完排行榜設計，所有決策已定，下一步是寫 Cursor Prompt 實作 Wireframe。」

---

## 🗺️ User Flow 定案（2026-07-09）

> 產品一句話：先讓人偷到第一筆薪水，再讓他為了跟朋友比而登入。

### 三個拍板決策

| # | 問題 | 決定 |
|---|------|------|
| 1 | 訪客能否完整摸一次魚？ | **可以。** 設薪資 → 計時 → 看結果，不必先登入 |
| 2 | 何時強制登入？ | **社交才登。** 只有排行榜 / 朋友 / 跨裝置才擋；核心摸魚不擋 |
| 3 | 登入成功後去哪？ | **智能導向。** 依暱稱 / 薪資 / 來源頁決定 |

---

### 完整 Flow

**A. 訪客主流程**
```
打開 App
  ├─ 無薪資 → redirect /setup → /timer → /result
  └─ 有薪資 → /timer（直接計時）→ 停止 → /result
                                              │
                                              └─ 點排行榜 → 登入閘門 → /signin
```

**B. 社交登入**
```
點 /leaderboard（未登入）
  → /signin?from=/leaderboard
  → 登入成功 → 智能導向
```

**C. 回訪**
```
已登入       → onAuthStateChanged 保持狀態 → 智能導向
訪客有本機資料 → 直接 /timer 或 /result（讀 localStorage）
```

---

### 路由權限表

| 頁面 | 路由 | 定案 | P0 需改？ |
|------|------|------|-----------|
| 設定薪資 | /setup | ✅ 訪客可 | 不用改 |
| 計時 | /timer | ✅ 訪客可 | **P0 改** |
| 結果 | /result | ✅ 訪客可 | **P0 改** |
| 紀錄 | /history | ✅ 訪客可 | **P0 改** |
| 戰績 | /achievement | ✅ 訪客可 | **P0 改** |
| 排行榜 | /leaderboard | ❌ 需登入 | 維持（登入閘門） |
| /signin /signup | — | ✅ 訪客可 | 不用改 |
| /verify-email | — | ✅ 訪客可 | 不用改 |
| /setup-profile | — | ❌ 需登入 | 不用改 |
| /user-profile | — | ❌ 需登入 | 不用改 |

---

### 登入後智能導向（4 條件，依序判斷）

| 優先 | 條件 | 去哪 |
|------|------|------|
| 1 | `displayName` 為空（新用戶） | `/setup-profile` |
| 2 | 有暱稱，localStorage 無薪資 | `/setup` |
| 3 | 有暱稱、有薪資、URL 帶 `?from=` | `from` 指定頁面 |
| 4 | 其餘 | `/result` |

---

### 結果頁空狀態 CTA

| 狀態 | 條件 | CTA |
|------|------|-----|
| 無薪資 | localStorage 無薪資 config | redirect `/setup`（不顯示空頁） |
| 有薪資，今日無記錄 | sessions 為空 | 「開始計時」→ `/timer` |
| 有薪資、有記錄 | 正常顯示 | — |

---

### Nav 抽屜（訪客狀態）

- 頭像區**完全隱藏**，只顯示選單列表
- 不顯示登入按鈕（排行榜本身就是登入閘門，不需要額外入口）

---

### P0 / P1 / P2

**P0（下輪 Cursor 執行）**
- 移除 /timer、/result、/history、/achievement 的 ProtectedRoute
- 保留 /leaderboard 的 ProtectedRoute
- 登入後智能導向（4 條件）
- 結果頁空狀態 CTA（2 種情況）
- Nav 抽屜訪客狀態隱藏頭像區

**P1（之後）**
- /signin 與 /signup 合併成單一入口
- 訪客 Nav 抽屜加「登入」入口（若之後覺得需要）

**P2（真排行榜上線時一起做）**
- ⚠️ **提醒**：訪客本機紀錄 → 登入後合併到 Firebase（現在先跳過，P2 做真排行榜時再一起處理）
- 排行榜接 Firebase 真實資料
- 朋友邀請系統
- Email 發信 PROD 確認

---

## 📝 最新 Recap（2026-07-09）— Vercel 部署 + 電郵驗證修復進行中

### Vercel 部署（✅ 完成）

**兩個 GitHub Remote：**
- `origin` → `git@github.com:rowanlin801229/salary-thief.git`（主開發 repo）
- `v0-ui` → `https://github.com/rowanlin801229/salary-thief-ui.git`（Vercel 連接的 repo）

**Vercel 設定：**
- 項目連到 `salary-thief-ui.git`，監控 `main` branch
- Root Directory：`on-the-clock`（必填，否則 404）
- 部署網址：`salary-thief-ui.vercel.app`（主要） + `on-the-clock-app.vercel.app`（別名）

**已部署的 commit：**
- `baae4ca`（nav drawer）
- `4ea2ec6`（leaderboard wireframe）

**推送 Vercel 指令：**
```bash
cd /Users/linyuxian/Desktop/薪水小偷/on-the-clock
git push v0-ui main
# 若 push 失敗（HTTP 400 大檔案）先設：
git config http.postBuffer 524288000
```

### Firebase 更新（✅）

- **升級 Blaze 計費方案**（Cloud Functions 必須，每月 $0 起跑）
- **新增授權網域**：`on-the-clock-app.vercel.app` 加入 Firebase 授權網域
  - 路徑：Firebase Console → Authentication → Settings → Authorized domains

### Email 驗證問題（🔄 修復進行中）

**根本問題：**
`emailVerification.ts` 的 `createEmailVerification()` 只寫 Firestore，沒有任何發信邏輯。
- DEV 模式：驗證碼存 sessionStorage（可以看到）
- PROD 模式：驗證碼存進 Firestore 然後就消失了，**用戶永遠收不到信**

**解決方案：Firebase "Trigger Email from Firestore" Extension**
- 監聽 `mail` collection，自動透過 SMTP 發信
- Extension 已安裝（有錯誤，見下方）

**SMTP 設定：**
- 發信帳號：`rowanlin1124@gmail.com`
- SMTP URI：`smtps://rowanlin1124%40gmail.com@smtp.gmail.com:465`
- App Password 名稱：`on-the-clock`（用戶自行保管密碼）
- Firestore 位置：`asia-east1`（台灣）
- Cloud Functions 位置：`us-central1`

**Extension 安裝狀態：⚠️ 有錯誤**
- 錯誤訊息：「安裝擴充功能時發生錯誤。請注意，參數設定錯誤可能會導致部分擴充功能資源無法順利部署。」
- 疑似原因：Default FROM address 驗證問題
- 待辦：點「查看詳細資料」確認錯誤原因，或重新設定 Extension

**Extension 修好後，需要改 emailVerification.ts：**

在 `createEmailVerification()` 的 `setPendingEmail(normalized)` 之前，加入寫入 `mail` collection 的程式碼：

```typescript
// 寫進 mail collection，觸發 Firebase Extension 發信
await setDoc(doc(db, 'mail', `${docId}-${Date.now()}`), {
  to: normalized,
  message: {
    subject: '薪水小偷驗證碼 / On The Clock Verification Code',
    text: `您的驗證碼是：${code}，10 分鐘內有效。\nYour verification code is: ${code}, valid for 10 minutes.`,
  },
})
```

**Cursor Prompt（Extension 修好後使用）：**
```
在 src/lib/emailVerification.ts 的 createEmailVerification() 函數裡，
在 setPendingEmail(normalized) 之前，加入以下程式碼，觸發 Firebase Trigger Email Extension 發信：

await setDoc(doc(db, 'mail', `${docId}-${Date.now()}`), {
  to: normalized,
  message: {
    subject: '薪水小偷驗證碼 / On The Clock Verification Code',
    text: `您的驗證碼是：${code}，10 分鐘內有效。\nYour verification code is: ${code}, valid for 10 minutes.`,
  },
})

確認 import 有加上 setDoc 和 doc（已有就不用重複）。
```

### ✅ 今日完成進度（2026-07-09）

| 項目 | 狀態 | 說明 |
|------|------|------|
| Firebase Extension 安裝 | ✅ | "Trigger Email from Firestore" 安裝成功（重試後 Eventarc 權限自動通過）|
| emailVerification.ts 加發信 | ✅ | `createEmailVerification()` 寫入 `mail` collection，觸發 Extension 發信 |
| 推上 Vercel | ✅ | commit `3aebc1d`，Production 狀態 Ready |
| User Flow 定案 | ✅ | 訪客主路徑 + 登入閘門 + 智能導向全部定案（見下方 User Flow 定案章節）|
| P0 實作完成 | ✅ | App.tsx、ProtectedRoute、SignIn/Up/VerifyEmail/SetupProfile/ResultPage 全改好 |

### ❌ 尚未完成的功能（2026-07-09 現況）

| 功能 | 狀態 | 說明 |
|------|------|------|
| P0 測試 | ⏳ 待測試 | 程式碼已改好，還沒實際跑過測試清單 |
| 推上 Vercel | ⏳ 待推 | P0 改動還沒 push 到 v0-ui remote |
| Email 驗證信實測 | ⏳ 待測試 | 程式碼已推，還沒手機實測收信 |
| AuthContext bug fix | ⏳ 待做 | 用戶從 Firebase 刪除後重登會失敗（見對話記錄，Cursor Prompt 已準備好）|
| 排行榜 | ❌ 只有假資料 | Wireframe 已做，沒接 Firebase 真實資料 |
| 朋友邀請系統 | ❌ 完全沒開始 | P2 |
| 本機紀錄合併 Firebase | ❌ 刻意跳過 | P2，做真排行榜時一起處理 |

### 下次開 chat 做什麼（依優先順序）

1. **手機測試 Email 驗證**（最優先）
   - 打開 `salary-thief-ui.vercel.app` 或 `on-the-clock-app.vercel.app`
   - 用 email 登入，輸入任一信箱
   - 確認有沒有收到驗證碼信
   - 若沒收到 → 去 Firebase Console → Firestore → `mail` collection 看有沒有資料進來

2. **排行榜接 Firebase 真實資料**
   - 目前是假資料，要換成 Firestore 真實的用戶摸魚時間
   - 需要設計 Firestore 資料結構：每次 session 要存 `elapsedMs` 到 `sessions/{userId}/` collection

3. **朋友邀請系統**（最後做）
   - 邀請碼生成
   - 朋友關係建立（`friends/{userId}/{friendUserId}`）
   - 朋友排行榜（只顯示朋友的排名）

