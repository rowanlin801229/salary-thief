# 薪水小偷 / On The Clock — Design System **v1.7**

可執行的設計規格，供開發與迭代對照。**以目前 Setup / Timer / Result / History 四頁程式碼實作為準**（2026-06-26）。  
風格：**白底方格紙 + rough.js 手繪馬克筆線** — 自嘲好玩，**不要** SaaS 乾淨風、全灰階企業感。

### App Shell（全頁共用骨架）

```
app-shell（max 560px、padding 16px、方格紙底）
├── app-header — App 名稱（Serif 42px 紅）｜EN／中文／☰
├── app-main — 當前路由頁面（`<Outlet />`）
├── BossKeyButton — 底部灰橫幅 + 紅緊急鍵（fixed）
└── FakeInboxOverlay — 老闆鍵開啟時的假郵件（刻意非手繪風）

每頁內容 = RoughBox.page-card > .rough-content > 頁面區塊
```

| 路由 | 頁面卡片 class | 頁內大標題 |
|------|----------------|------------|
| `/setup` | `page-card setup-doodle-card` | ✅ `result-big-title`（`setupTitle`） |
| `/timer` | `page-card timer-page` | ❌ 無（直接進碼錶） |
| `/result` | `page-card result-doodle-card` | ✅ `result-big-title`（`resultTitle`） |
| `/history` | `page-card history-page` | ❌ 無（直接進今日戰績） |

`/` 自動導向 `/setup`。

---

## 0. 產品氣質（不變）

| | |
|---|---|
| **一句話** | 上班族摸魚時，把偷到的薪水換算成看得見的「戰績」 |
| **語氣** | 自嘲、好玩、適合截圖分享 |
| **受眾** | 台灣／英文；同一網站切換語言（Localization 展示） |
| **不要做** | 過度動效、像真公司內部系統（老闆來了假郵件除外） |

### 手繪感規則

- 邊框：**rough.js**，`roughness: 2.8`、`bowing: 2.5`、線寬 3px、描邊 `#111`
- 標題／數字可微幅 `rotate(-0.5deg ~ -2.5deg)`，勿每個元素都歪
- **字重**：App 標題 **700**（Serif）；金額／核心數字／頁面標題 **700**；標籤與正文 **400**
- SVG 邊框層 `.rough-border` 必須 `pointer-events: none`

### 格式塔（全頁共用）

- **相近性**：標籤緊鄰輸入（6–10px）；同一任務欄位在同一 `*-group`
- **共同區域**：任務組之間 = 大間距 + 虛線分隔（見 §3）
- **相似性**：互動框線一律 `RoughFrame` 系；數字展示一律 StatDisplay pattern（§6）

---

## 1. 頁面區塊順序與層級

層級定義：

| 層級 | 意義 | 視覺手段 |
|------|------|----------|
| **L1 主角** | 使用者最在意的那一個數字／狀態 | 最大字級、置中、**紅** `#e63946` |
| **L2 次要** | 說明、輸入、輔助數據 | 中字級、**灰標籤** `#666`、黑正文 |
| **L3 操作** | 可點擊的下一步 | 按鈕列；hint 在按鈕下方 |

組間一律：`margin-top: 28px` + `padding-top: 24px` + 虛線（§3）。**主行動組**（`*-group-action`）取消頂部分隔線。

---

### 1.1 Setup `/setup`

**區塊順序（由上而下）**

> A–C 在 `RoughBox` 內、**`setup-form` 外**（說明在前、表單在後）；`setup-form` 僅含 D1–D4。

| # | 區塊 | class | 層級 |
|---|------|-------|------|
| A | 頁首標語 | `result-big-title` | display-page |
| B | 簡介 | `setup-intro` | L2 |
| C | 四步驟說明 | `setup-howto` | L2 |
| D | **表單** `setup-form`（`margin-top: 8px`） | | |
| D1 | 薪資：模式切換 + 金額輸入 | `setup-group` | L2 |
| D2 | 工時（時薪模式隱藏） | `setup-group` | L2 |
| D3 | 每分鐘薪資 + 備註 | `setup-group setup-group-result` | **L1** |
| D4 | 開始計時 + 驗證 hint | `setup-group setup-group-action` | L3 |

**層級重點**

- **display-page**：`setupTitle`（`result-big-title`，42px 紅 700）— zh「先算算摸魚價值！」
- **L1**：`result-stat-hero` + `rate-value`（每分鐘薪資，48px 紅）；下方 `setup-note purple-note`（**灰** `#666`，legacy class 名）
- **L2**：`setup-intro`（24px 黑、75ch、lh 1.6）；`setup-howto`（淡黃底 22%、虛線框、ol 四步）；薪資／工時欄位（`field-label` **灰**）
- **L3**：`start-button`（`t('startTimer')`：zh「開始摸魚」）→ `startTimer()` + `navigate('/timer')`（**計時頁進場即跑表**）+ `setup-start-hint`（驗證失敗時，22px 黑）

**D1 詳細規範 — 薪資 + 幣別** ✅ 已實作

| 模式 | 工時區塊 |
|------|----------|
| 時薪 | 整段隱藏 |
| 月薪 | 天／月 + 時／天 |
| 年薪 | 時／週 + 週／年 |

**輸入框 + 幣別選擇並排：** ✅ 已實作
```
┌──────────────────────────────┐
│ [薪資輸入框  ] [幣別選單▼]   │
│  flex: 1      min-w: 110px   │
│  gap: 8px                     │
└──────────────────────────────┘
```

- **輸入框**：RoughInput，黑邊、銳角、紅文字、60–80% 寬度
- **幣別按鈕**：RoughButton，黑邊、銳角、紅文字 700、110px、56px 高
  - 顯示當前幣別（NT$ / $ / £）+ 下箭頭 ▼（14px）
  - 點擊展開三個選項下拉選單
  - 選擇後更新按鈕文字 + 保存到 localStorage
- **下拉選單**：絕對定位、按鈕下方、手繪風格、三個並排或垂直選項
  - 選項：[NT$] [$] [£]
  - 預設：根據 localStorage 或用戶上次選擇
  - 點選後閉合、焦點返回按鈕

---

### 1.2 Timer `/timer`

**區塊順序**（`timer-form` 內，**無頁內大標題**）

| # | 區塊 | class | 層級 |
|---|------|-------|------|
| 1 | 碼錶盤 + 開始／暫停 + hint | `timer-group timer-group-control` | L2 |
| 2 | 偷到金額 | `timer-group timer-group-stats` | **L1** |
| 3 | 結束摸魚 + hint | `timer-group timer-group-action` | L3 |

**層級重點**

- **L1**：僅 **偷到金額** — `result-stat-hero` + `timer-stat-money` **64px 紅** `#e63946`（無每分鐘／時間 stat 列）
- **L2**：`StopwatchDial`（260px 圓環、中心 **MM:SS 紅字**）+ `stopwatch-toggle-button`（▶／‖ 紅）+ 條件 hint
- **L3**：`timer-end-button`「結束摸魚」+ `timer-page-hint` / `timer-page-hint-end`

**StopwatchDial 規格（已實作）**

- 尺寸：260×260px
- 進度環：紅 `#e63946`，透明 track，每 **60 秒** 跑滿一圈（長計時循環；中心時間仍累加）
- 中心：**僅**紅色時間 `stopwatch-dial-time` **36px**（無「已過時間」藍標籤）
- 計時中底圓微暖白 `#fffef8`

> 已過時間只出現在碼錶盤中心數字，不再另開 StatDisplay 列，也不再顯示文字標籤。

**計時啟動規則**

| 進入方式 | 行為 |
|----------|------|
| 設定頁「開始摸魚」、結果頁「繼續摸魚」／空狀態「前往計時」 | 先 `startTimer()` → 進 `/timer` 後 **已自動計時**（`timerStartAt` 同步初始化 `activeSince`） |
| 漢堡選單直接進計時 | 未按開始前為暫停；按 ▶ 手動開始 |
| 薪資未設定（`!canStart`） | ▶ **disabled**；顯示 `startFromSetup` hint；**不**導回設定頁 |

**計時頁按鈕尺寸**

- `stopwatch-toggle-button-frame` 與 `timer-end-button-frame` 同寬 `min(100%, 250px)`、同高 `min-height: 56px`
- ▶／‖ 圖示 **紅** `#e63946`（36px）

---

### 1.3 Result `/result`

**區塊順序（有 session）**

| # | 區塊 | class | 層級 |
|---|------|-------|------|
| 1 | 頁面標題 | `result-group result-group-hero` | L2 |
| 2 | 本次戰績：金額 + 時間 | `result-group result-group-session` | L2 |
| 3 | 今日戰績 + 紀錄列表 | `result-group result-group-today` | L2 |
| 4 | 操作列 | `result-group result-group-action` | L3 |

**層級重點**

- **L2 標題**：`result-big-title`（42px 紅）
- **L2 本次戰績**：標籤 `#666`；金額 `result-stat-money` **56px**、時間 `result-stat-time` **36px** — **數字皆紅** `#e63946`
- **L2 今日戰績**：`result-total-plain` 黃底 **無黑框**；標籤 `#666`；累計金額 **58px 紅**
- **L2 紀錄**：`result-today-records` 直接列在今日戰績下方（第 N 次｜時間｜金額，數字紅、序號灰）；下方 **`result-clear-button`** 清空（紅 22px，非操作列）
- **L3**：`result-actions-row` 兩欄 grid（max 320px，gap 12px）— **繼續摸魚**（primary 紅 28px）｜**分享**（紅 28px，`result-share-button`）

**空狀態**（無 session）

| # | 區塊 | class | 層級 |
|---|------|-------|------|
| 1 | 頁面標題 | `result-group-hero` | L2 |
| 2 | 說明 + 操作 | `result-group-empty` | L2 + L3 |

| 元素 | 規格 |
|------|------|
| 說明 | `result-empty-text` — **24px 灰** `#666`，`max-width: 75ch`，`line-height: 1.6` |
| 按鈕列 | `result-empty-actions result-actions-row` — 兩欄 **等寬** grid，與有 session 時操作列同版型 |
| 左（主） | **前往計時** — `primary` + `result-continue-button`（紅 28px） |
| 右（次） | **前往設定** — `result-empty-secondary-button`（藍 28px） |

> **已移除**：「查看今日紀錄」modal；右下角 `result-speech`（「還沒開偷呢」）裝飾。

---

### 1.4 History `/history`

**區塊順序**（**無頁內大標題**，直接從今日戰績開始）

| # | 區塊 | class | 層級 |
|---|------|-------|------|
| 1 | 今日戰績摘要 | `result-total-plain history-total-plain` | L2 |
| 2 | 紀錄列表或空狀態 | `result-records-list history-records-list` / `history-empty` | L2 |
| 3 | 返回 + 清空 | `history-actions` | L3 |

- 今日戰績：與結果頁相同 — 黃底 `#fef08a`、**無黑框**；`result-total-label` 灰、金額 **58px 紅**
- 紀錄列：複用 `result-record-item`（序號灰、時間／金額紅）；zh 序號倒序「第 N 次」
- 空狀態：`history-empty` — 24px 灰 `#666`、lh 1.6
- **操作列** `history-actions`：兩欄 grid gap 10px；**返回上一步**（`result-secondary-button` 藍 22px）｜**清空紀錄**（`result-clear-button` 紅 22px，僅有紀錄時顯示）
- 無紀錄時：`history-actions-single` — 單欄、max-width 220px 置中，只顯示返回
- 資料：`loadTodaySessions()`；路由切換與 `visibilitychange` 時刷新

---

## 2. 字級 Scale（Typography Tokens）

**正文**：系統無襯線 `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif`（親切、易讀）。  
**特例**：Header App 名稱保留 **Noto Serif SC** + **700**。  
**行距**：`body` 1.5；正文段落（intro / note / hint）1.6，`max-width: 75ch`。  
命名：`display` > `stat` > `label` > `hint`。

| Token | 大小 | 字重 | 色 | 用途 |
|-------|------|------|-----|------|
| `display-app` | 42px | **700** | 紅 `#e63946` | Header App 名稱（Serif） |
| `display-page` | 42px | **700** | 紅 `#e63946` | `setupTitle`／`resultTitle` 頁首標語 |
| `stat-hero` | **64px** | **700** | **紅** | 計時頁偷到金額 |
| `stat-lg` | **56–58px** | **700** | 紅 | 結果本次金額 56px；今日累計 58px |
| `stat-md` | **48px** | **700** | 紅 | 設定頁每分鐘薪資 |
| `stat-sm` | **36px** | **700** | 紅 | 碼錶中心時間；結果本次時間 |
| `label-lg` | 28px | 400 | **灰** `#666` | 今日戰績標籤、stat hero 標籤 |
| `label-md` | 22–26px | 400 | **灰** `#666` | 欄位標籤、組標題、result stat 標籤 |
| `body` | 24px | 400 | 黑 | `setup-intro`（75ch, lh 1.6） |
| `hint` | 22–24px | 400 | 黑／灰 | 驗證 hint、howto；`result-empty-text` **24px 灰** |
| `input` | 28px | 400 | **紅** | `rough-input-native` 使用者輸入 |

**旋轉**：display／stat 常用 ±0.6°–2.5°；label 常用 -0.5°–-1°。

---

## 3. 間距 Tokens（Spacing）

### 3.1 基礎 scale

| Token | 值 | 用途 |
|-------|-----|------|
| `space-1` | 4px | stat 內 label↔value 緊湊間距 |
| `space-2` | 6–8px | 欄位內小 gap；hero group gap |
| `space-3` | 10px | 組內預設 gap（`*-group`） |
| `space-4` | 12px | 並排欄位 gap、按鈕列 gap |
| `space-5` | 14–16px | 控制區略鬆（timer-control gap 14px） |
| `space-6` | 20px | 主行動組 `margin-top`（無虛線） |
| `space-7` | 24px | 組間 `padding-top` |
| `space-8` | 28px | 組間 `margin-top` |

### 3.2 組內（within group）

| 情境 | token | 值 |
|------|-------|-----|
| `*-group` 直向 gap | `space-3` | 10px（result 用 12px） |
| `setup-field` label↔input | `space-2` | 8px |
| `setup-field-row` 兩欄 | `space-4` | 12px |
| `setup-field-stack` 模式列↔輸入 | `space-3` | 10px |
| StatDisplay label↔value | `space-1`–`space-2` | 4–6px |
| `setup-group-result` | 緊湊 | gap 4px，置中 |

### 3.3 組間（between groups）

```css
/* 套用於 setup-group / timer-group / result-group 的相鄰兄弟 */
margin-top: 28px;          /* space-8 */
padding-top: 24px;         /* space-7 */
border-top: 2px dashed rgba(17, 17, 17, 0.14);
```

**例外 — 主行動組** `*-group-action`：

```css
margin-top: 20px;          /* space-6 */
padding-top: 0;
border-top: none;
```

### 3.4 全域版面

| 項目 | 值 |
|------|-----|
| 內容最大寬度 | 560px |
| 外殼 padding | 16px |
| 區塊 gap（shell） | 16px |
| 方格紙格線 | 22px |
| 主按鈕最大寬 | `min(100%, 250–260px)` |
| 老闆列安全區 | `--boss-bar-clearance` = 84px + 40px |
| **頁面卡片** `.page-card` | 外層 `20px 18px`（覆蓋 `.rough-box` 預設 18px）；內層 `.rough-content` 上下各 `--boss-bar-gap`（40px）— **四頁共用** |
| **App 底部留白** | `app-shell` `padding-bottom: calc(84px + 40px + safe-area)` |

### 3.5 內容對齊

- `.rough-content`：`flex` 直向、置中、`gap: 10px`
- 表單容器（`setup-form` / `timer-form` / `result-form`）：`width: 100%`、子組 `align-items: stretch`
- Stat／按鈕列：`max-width: 320px` 置中（hero stat、操作列）

---

## 4. 顏色語意

### 4.1 Token 表

| Token | 色碼 | 用在哪 |
|-------|------|--------|
| `ink` | `#111` | 正文、`setup-intro`、howto 列表、驗證 hint、語言按鈕 normal 文字 |
| `ink-muted` | `#666` | **全站 stat 標籤**、欄位名、組標題、placeholder、空狀態說明 |
| `stroke` | `#111` | `RoughButton` 與 `RoughInput` 描邊（統一黑邊） |
| `input-stroke` | `#111` | `RoughInput` 描邊（同 `stroke`） |
| `brand-red` | `#e63946` | 輸入值、**全站 stat 數字**（金額／時間）、碼錶、頁面標題、primary 按鈕文字、active 文字 |
| `boss-bar` | `#333` | 底部老闆列深灰橫幅背景 |
| `label-blue` | `#457b9d` | secondary 按鈕文字（**頁面 stat 標籤改灰**） |
| `label-blue-tint` | `rgba(69, 123, 157, 0.15)` | secondary 按鈕 hover 填色 |
| `brand-red-tint` | `rgba(230, 57, 70, 0.12)` | primary 按鈕 **hover** 填色 |
| `highlight-yellow` | `#fef08a` | 按鈕 **active** CSS 填色；`result-total-plain` 今日戰績底 |
| `highlight-yellow-tint` | `rgba(254,240,138,0.22)` | howto 區淡黃底 |
| `highlight-yellow-tint-hover` | `rgba(254,240,138,0.35)` | mode-toggle **未選** hover 填色 |
| `nav-route-bg` | `rgba(254,240,138,0.45)` | 漢堡選單當前路由底 |

### 4.2 紅 `#e63946`

| ✅ 可用 | ❌ 禁止 |
|---------|---------|
| `RoughInput` 輸入值 | 把黃色當數字展示背景 |
| 設定／計時／結果／紀錄 **所有 stat 數字** | 任何「看起來像按鈕」的非互動區塊填色 |
| 碼錶中心時間、紅色進度環 | |
| 頁面標題 `result-big-title` | |
| `RoughButton.is-active` 文字 | |

### 4.3 藍 `#457b9d`

| ✅ 可用 | ❌ 禁止 |
|---------|---------|
| secondary 按鈕預設 | 輸入框描邊（用黑 `#111`） |
| | stat 標籤（用灰 `#666`） |
| | 金額／時間數字（用紅） |
| | primary 按鈕文字（用紅 `#e63946`） |

> 輸入與按鈕邊框皆黑 `#111`；藍色僅用於 secondary 按鈕文字。

### 4.4 灰 `#666`（標籤）

| ✅ 可用 | ❌ 禁止 |
|---------|---------|
| 全站 stat 標籤、欄位名、組標題、空狀態說明 | 金額／時間數字（用紅） |
| placeholder、模式未選文字 | |

### 4.5 黃 `#fef08a`

| ✅ 可用 | ❌ 禁止 |
|---------|---------|
| `RoughButton` **active** CSS 實心填色（見 §5.0.2） | 計時頁 live 數據區背景 |
| `result-total-plain` 今日戰績底 | 任何非互動的 stat 展示框（除今日戰績區） |
| howto 淡黃 tint（22% 透明度） | 與 active 按鈕無法區分的 solid 黃底 stat |

> **核心規則**：黃 = 已選中按鈕（toggle）或今日戰績摘要區。不要把黃用在 live 計時數字上。

### 4.6 導覽分頁色（`labelColors`）

```
標題紅 → 設定藍 → 計時紅 → 結果紅 → 紀錄藍
#e63946  #457b9d  #e63946  #e63946  #457b9d
```

### 4.7 老闆來了

| 層 | 規格 |
|----|------|
| **橫幅** `boss-key-bar` | 全寬固定底、深灰 `#333`（**非**整條紅底） |
| **按鈕** `boss-key-button-frame` | 右下獨立緊急鍵；紅底 `#e63946` + 白字；圓角 16px；手繪黑邊 |
| **hover / 按下** | 黑底 `#111` + 紅字 `#e63946` + **紅邊** `#e63946` |
| **假郵件** | 刻意脫離手繪風：system-ui + Outlook 藍 `#0f6cbd` |

計時**不暫停**；隨時可切換假收件匣。

---

## 5. 按鈕系統與狀態設計

全部互動框基於 `RoughFrame` + rough.js（`roughness: 2.8`、`strokeWidth: 3`）。  
SVG 邊框 `pointer-events: none`。

**核心 affordance 規則（形狀區隔）：**
1. **邊框**：輸入與按鈕皆黑 `#111`（rough.js 手繪線）
2. **圓角**：輸入直角 0px、按鈕 **16px**
3. **填色**：依按鈕類型與狀態（見下表）；**active 用 CSS 實心填色，不用 SVG fill**

---

### 5.0 視覺區隔規則（輸入 vs 按鈕）

| 元素 | 邊框 | 圓角 | 背景 | 用意 |
|------|------|------|------|------|
| **`RoughInput`** | 黑 `#111` 3px | 0px（直角） | 白 | 「填資料」區，尖銳矩形感 |
| **`RoughButton`** | 黑 `#111` 3px | **16px** | 依類型填色 | 「按下去」區，柔軟圓潤感 |

> 圓角 + 直角 = affordance 雙重信號。使用者一眼判斷：圓潤形狀＝可點、銳角矩形＝可輸入。

### 5.0.1 按鈕 Active 狀態統一（全類型）

**Normal** = 白底 + 黑邊 + 各類型文字色｜**Hover** = 淡色填色｜**Active** = 黃底 `#fef08a` + 紅字 `#e63946`

| 按鈕類型 | Normal | Active（統一） |
|----------|--------|----------------|
| **Primary** | 白 + 黑邊 + **紅字** | 黃 + 紅字 |
| **Secondary** | 白 + 黑邊 + 藍字（或紅字，見 §5.2） | 黃 + 紅字 |
| **Mode-toggle** | 白 + 黑邊 + 灰／黑字 | 黃 + 紅字 |

- **Mode-toggle `active` prop**（已選中）：維持黃底紅字，直到切換
- **Primary / Secondary `:active`**（按下瞬間）：同樣黃底紅字，放開回 normal
- 薪資列 mode-toggle active 文字亦用 **紅**（不再用 `#111`）

### 5.0.2 Active 填色實作（塗鴉邊框 + 實心底）

與老闆鍵相同策略：

| 層 | 技術 | 說明 |
|----|------|------|
| **邊框** | rough.js SVG `stroke="#111"` | 手繪線條保留 |
| **填色** | CSS `background` on `.rough-button-frame` | **禁止** rough.js SVG `fill` 當 active 底色（避免蠟筆質感） |
| **裁切** | `border-radius: 16px` + `overflow: hidden` | 填色跟隨圓角 |

`RoughButton`：`fill="transparent"` 固定；`.is-active { background: #fef08a }`。

---

### 5.1 Primary（主行動）

| 屬性 | 規格 |
|------|------|
| **用途** | 開始摸魚、結束摸魚、繼續摸魚、前往計時（空狀態） |
| **API** | `<RoughButton primary>` |
| **class** | `start-button` / `timer-end-button` / `result-continue-button` |
| **寬度** | 單欄：`min(100%, 250–260px)` 置中；並排：`result-actions-row` 內 `width: 100%` |

| 狀態 | 背景 | 文字 | 備註 |
|------|------|------|------|
| **normal** | **白** | **紅** `#e63946` 28–36px | 單欄主按鈕 36px；並排列 28px |
| **hover**（桌面） | 淡紅 12% | 紅 36px | `transition: background-color 0.2s` |
| **active**（`active` prop 或 `:active`） | **黃 `#fef08a`** | **紅 `#e63946`** | CSS 實心底 |
| **disabled** | 白 | 紅 36px | `opacity: 0.5` |

**實作備註：** `RoughFrame` `cornerRadius={16}`；SVG 永遠 `fill="transparent"`；狀態填色全走 CSS。

---

### 5.2 Secondary（次要行動）

| 屬性 | 規格 |
|------|------|
| **用途** | 導覽型次要操作（藍）或同級並列操作（紅） |
| **class** | 見下表 |
| **版面** | `result-actions-row` / `result-empty-actions` — 兩欄 grid gap 12px，max-width 320px；History `history-actions` gap 10px |

**文字色對照（normal）**

| class | 色 | 字級 | 情境 |
|-------|-----|------|------|
| `result-empty-secondary-button` | 藍 `#457b9d` | 28px | 結果空狀態「前往設定」 |
| `result-secondary-button` | 藍 `#457b9d` | 22px | History「返回上一步」 |
| `result-share-button` | **紅** `#e63946` | 28px | 結果頁「分享」（與繼續摸魚並排） |
| `result-clear-button` | **紅** `#e63946` | 22px | 結果／History「清空紀錄」（獨立列於紀錄下方或操作列） |

| 狀態 | 背景 | 文字 | 備註 |
|------|------|------|------|
| **normal** | 白 | 見上表 | 並排列與 primary 同寬 |
| **hover** | 藍 tint 15%（藍字鈕）／紅 tint 12%（紅字鈕） | 對應文字色 | |
| **active** | **黃 `#fef08a`** | **紅 `#e63946`** | 與 primary / mode-toggle 統一 |
| **disabled** | 白 | 原色 | `opacity: 0.5` |

---

### 5.3 Mode-toggle（模式切換）

| 屬性 | 規格 |
|------|------|
| **用途** | 時薪／月薪／年薪；EN／中文 |
| **版面** | `mode-row` 三欄 grid，gap 10px |
| **API** | `<RoughButton active={boolean}>` |

| 狀態 | 背景 | 文字 | 備註 |
|------|------|------|------|
| **normal** | 白 | 薪資列 `#666`；語言列 `#111` | 未選 |
| **active** | CSS `#fef08a` 實心底 | **紅** `#e63946` | 已選中 |
| **hover**（僅未選） | `highlight-yellow-tint-hover` 35% | 對應文字色 | 選擇器：`:not(.is-active)` |
| **disabled** | — | — | 目前未使用 |

---

### 5.4 RoughInput 狀態

| 狀態 | 邊框 | 文字 | 備註 |
|------|------|------|------|
| **normal** | 黑 `#111` 3px | 紅 `#e63946` 28px | 使用者輸入值 |
| **focus-visible** | 黑 3px | 紅 28px | 淡灰光暈 `0 0 0 2px rgba(17,17,17,0.15)`；**僅鍵盤 focus**，滑鼠點擊不常駐 |
| **placeholder** | 黑 3px | `#666` | |
| **disabled** | 黑 3px | — | 整組 `opacity: 0.38`（沿用 `.setup-group.is-disabled`） |

元件：`RoughInput` → `<RoughFrame stroke="#111" fill="transparent">`。

---

### 5.5 其他互動（非三種之一）

| 元件 | 邊框 | 背景 | 說明 |
|------|------|------|------|
| `stopwatch-toggle-button` | 黑 | 白 | 碼錶 ▶／‖ **紅**圖示；**寬高與 `timer-end-button` 相同** |
| `nav-menu-toggle` | 黑 | 白；open 時 **active 黃底紅字** | 漢堡 ☰ |
| **老闆來了** | 黑 | 見 §4.7 | 橫幅 `#333` + 右下紅色緊急鍵 |

---

### 5.6 實作優先順序（Rollout）

| 階段 | 內容 | 狀態 |
|------|------|------|
| **P0** | 按鈕 16px 圓角 + 輸入直角 + 統一黑邊 + 白底 normal | ✅ |
| **P1** | 全按鈕 hover 淡色反饋 | ✅ |
| **P1+** | Active CSS 實心底（取代 SVG 蠟筆 fill） | ✅ |
| **P2** | `RoughInput` `:focus-visible` 光暈 | 未做 |
| **P2** | 實物換算 UI、部署 | 未做 |

`prefers-reduced-motion: reduce` 時關閉 background transition。

---

## 6. StatDisplay Pattern

**結構**（標籤在上、數字在下、置中）：

```html
<div class="result-stat result-stat-hero">   <!-- 或 result-stat-secondary -->
  <p class="result-stat-label">標籤</p>
  <p class="result-stat-value timer-stat-money">數字</p>   <!-- 或 result-stat-money / result-stat-time / rate-value -->
</div>
```

### 6.1 變體對照表

| 情境 | 容器 | 標籤 | 數字 | 數字色 |
|------|------|------|------|--------|
| 計時·偷到金額 | `result-stat-hero` | `result-stat-label` **26px** 灰 | `timer-stat-money` **64px** | **紅** |
| 設定·每分鐘薪資 | `result-stat-hero` | `result-stat-label` **26px** 灰 | `rate-value` **48px** | 紅 |
| 結果·本次金額 | `result-stat-hero` | `result-stat-label` **灰** `#666` | `result-stat-money` **56px** | 紅 |
| 結果·本次時間 | `result-stat-secondary` | `result-stat-label` **灰** | `result-stat-time` **36px** | 紅 |
| 結果·今日累計 | `result-total-plain` 黃底無框 | `result-total-label` **28px 灰** | `result-total-amount` **58px** | 紅 |
| 結果·紀錄列 | `result-record-item` | `result-record-index` 灰 | 時間＋金額 | 紅 |

### 6.2 間距

- label ↔ value：`gap: 4–6px`
- hero stat 上下 padding：`4px 0 8px`

### 6.3 元件化（v1 規格，待實作）

建議未來抽成 `<StatDisplay variant="hero|secondary" label value />`，目前以 **`result-stat` CSS class 組合** 實作於 Setup / Timer / Result。

---

## 6.5 全站色彩規則（Result-led，v1.6）

| 元素 | 色 | 備註 |
|------|-----|------|
| 頁面標題 `result-big-title` | 紅 `#e63946` | Setup `setupTitle`、Result `resultTitle` |
| 所有 stat 標籤 | 灰 `#666` | 含欄位名、組標題、空狀態說明 |
| 所有 stat 數字 | 紅 `#e63946` + **700** | 金額、時間、輸入值、紀錄列 |
| 今日戰績底 | 黃 `#fef08a` | `result-total-plain`；無 rough 黑框 |
| Secondary 按鈕文字 | 藍 `#457b9d`（導覽）或紅 `#e63946`（分享／清空） | 僅互動元件，非資料展示 |
| Primary 按鈕文字 | 紅 `#e63946` | |

**已淘汰**：計時頁 live 金額專用綠 `#2a9d8f`、stat 標籤藍 `#457b9d`、橘／紫按鈕色。

---

## 7. 核心元件（簡表）

| 元件 | 角色 |
|------|------|
| `RoughBox` | 頁面主卡片 `.page-card` |
| `RoughFrame` | 手繪框（邊框 only；填色優先用 CSS） |
| `RoughButton` | primary / secondary / mode-toggle；`fill` 恆 transparent |
| `RoughInput` | 數字輸入，黑邊 `#111`，直角，紅字 28px |
| `StopwatchDial` | 計時碼錶（§1.2） |
| `NavMenu` | Header 右側漢堡；當前路由淡黃底 |
| `BossKeyButton` | 底部灰橫幅 + 紅色緊急鍵（§4.7） |

**插圖**：v1 **不使用**頁面裝飾插圖（已移除 setup hero、結果頁火柴人／彩紙）。`StickFigure.tsx` 保留於 codebase 但未掛載。

---

## 8. 路由與 Header

| 路由 | 狀態 |
|------|------|
| `/setup` | ✅ v1 對齊 |
| `/timer` | ✅ v1 對齊 |
| `/result` | ✅ v1 對齊 |
| `/history` | ✅ v1.7 對齊（§1.4） |

頂部：

| 斷點 | 版面 |
|------|------|
| **寬 > 520px** | **標題** 左（Serif **42px** 紅）｜**EN／中文／☰** 右（同一列） |
| **寬 ≤ 520px** | **標題** 獨占最上方一列（**38px**）；**EN／中文／☰** 整列下移、靠右 |

---

## 9. Localization

| | `zh` | `en` |
|--|------|------|
| 產品名 | 薪水小偷 | On The Clock |
| 幣別 | `NT$` | `$` |
| 文案 | `src/i18n/translations.ts` | 同左 |

**實物換算**（結果頁）：規格有、**UI 未做**。`realWorldItems` 英文仍為舊 UK 酒類，上線前需改。

---

## 10. 動效與無障礙

| 項目 | 現況 |
|------|------|
| 動效 | 碼錶環 `stroke-dashoffset`；按鈕背景色 `transition 0.2s`（P1 起） |
| `prefers-reduced-motion` | 碼錶環、按鈕 background transition 關閉 |
| a11y | 圖示按鈕 `aria-label`；老闆鍵 `aria-pressed`；表單 `label`/`htmlFor`；輸入 `:focus-visible`（P2） |
| 對比 | 黑字白底為主；active 黃底紅字；輸入／按鈕皆黑邊 |

---

## 11. v1 規格 vs 目前 Code — 差異清單

### 已對齊 ✅

| 項目 | 說明 |
|------|------|
| 按鈕 16px 圓角、輸入直角、黑邊 `#111` | §5.0 |
| Primary 白底 normal + hover | §5.1 |
| Active 黃底紅字（CSS 實心，無蠟筆 fill） | §5.0.1–5.0.2 |
| 碼錶中心僅 MM:SS，無標籤 | §1.2 |
| 結果頁：灰標籤 + 紅數字、今日戰績無框、inline 紀錄、繼續｜分享 | §1.3 |
| 結果頁空狀態：灰說明 + 計時｜設定並排等寬、無 speech 裝飾 | §1.3 |
| 無襯線正文 + 金額字重 700 + 簡化色盤（無橘紫） | §2、§4 |
| 老闆鍵：灰橫幅 + 紅緊急鍵、hover 黑底紅字紅邊 | §4.7 |
| 全站灰標籤 + 紅數字（Result-led） | §6.5 |
| 四頁 `.page-card` 上下對稱 padding | §3.4 |
| Header 窄螢幕標題上／nav 下 | §8 |
| 計時進場自動開始（`startTimer`） | §1.2 |
| 薪資 localStorage 持久化 | §12 |
| Hover 淡色反饋 | §5.1–5.3 |
| Setup 說明在前、表單在後（A–C 在 `setup-form` 外） | §1.1 |
| History 頁完整版面（無標題、黃底戰績、返回｜清空） | §1.4 |
| Timer／History 無頁內大標題 | 頂部表 |
| 分享按鈕紅字、空狀態設定鈕藍字 | §5.2 |

### 尚未完成

| # | 項目 |
|---|------|
| 1 | `RoughInput` `:focus-visible` 光暈（§5.4 P2） |
| 2 | `<StatDisplay>` 獨立元件（目前 CSS class） |
| 3 | `:root` design tokens 擴充（色碼仍多數硬編碼於 `index.css`） |
| 4 | 實物換算 UI |
| 5 | `realWorldItems` 英文內容更新 |
| 6 | Vercel 部署與 OG 圖 |

### 已淘汰／移除

| 項目 | 說明 |
|------|------|
| 頁面插圖 | setup hero、結果火柴人／彩紙 |
| 輸入框藍邊 | 改統一黑邊 |
| 結果頁紀錄 modal | 改 inline 列表 |
| `result-speech` 裝飾（「還沒開偷呢」） | 空狀態已移除 |
| `action-orange` / `accent-purple` | primary／分享改紅；導覽色簡化 |
| 底部整條紅色老闆橫幅 | 改 `#333` 灰橫幅 + 獨立紅按鈕 |
| `BossKeyMarkerBg` 裝飾 | 已從 `BossKeyButton` 移除 |
| Timer 獨立「已過時間」stat 列 | 已併入碼錶中心 |
| 計時頁 live 金額綠 `#2a9d8f` | 全站 stat 數字改紅 |
| stat 標籤藍 `#457b9d` | 全站標籤改灰 `#666` |
| History 頁 `RoughFrame` 黃框 | 改 `result-total-plain` 無框 |
| BottomNav | 改漢堡選單 |
| Timer 按 ▶ 導回 `/setup` | 改 disabled + hint |

---

## 12. 檔案對照

| 設計決策 | 程式位置 |
|----------|----------|
| App 骨架 | `src/layout/AppLayout.tsx` |
| 全域樣式 | `src/index.css` |
| 文案 | `src/i18n/translations.ts`（含 `setupTitle`） |
| 薪資持久化 | `src/lib/storage.ts` → `loadSalaryConfig` / `saveSalaryConfig` |
| 計時全域狀態 | `src/context/AppStateContext.tsx` → `timerStartAt` / `startTimer()` |
| 手繪元件 | `src/components/Rough*.tsx` |
| 碼錶 | `src/components/StopwatchDial.tsx` |
| 三頁 | `src/pages/SetupPage.tsx`、`TimerPage.tsx`、`ResultPage.tsx` |
| 紀錄頁 | `src/pages/HistoryPage.tsx` |
| 漢堡選單 | `src/components/NavMenu.tsx`、`Header.tsx` |
| 老闆鍵 | `src/components/BossKeyButton.tsx`、`BossKeyContext.tsx` |
| 專案筆記 | 上層 `../CLAUDE.md` |

---

*v1.7 更新：2026-06-26。補 App Shell 骨架與四頁卡片 class；Setup 說明／表單分層；Timer 僅偷到金額 L1、無頁標；History 操作列與資料刷新；§5.2 按鈕文字色分表；Header 窄螢幕 38px；§11 對齊現況。*

*v1.6 更新：2026-06-26。全站對齊 Result 頁色彩（灰標籤、紅數字）；補 §1.4 History、§1.2 自動計時、§6.5 色彩總表；setupTitle；四頁 padding；薪資持久化；老闆鍵 hover 紅邊；修正文件與 code 落差。*

*v1.5 更新：2026-06-26。Lobb's Padel 參考：正文改系統無襯線；金額／標題字重 700；行距 1.5–1.6、段落 75ch；移除橘／紫；結果頁空狀態並排等寬按鈕、移除 speech 裝飾。*

*v1.4 更新：2026-06-29。對齊目前 code：結果頁 P2（灰標籤紅數字、inline 紀錄、繼續｜分享）；碼錶無標籤；按鈕 active CSS 實心底；老闆鍵灰橫幅＋紅鍵 hover 黑底紅字；§11 差異清單重寫。*

*v1.3：按鈕 16px 圓角、輸入黑邊、形狀區隔；老闆鍵緊急按鈕初版。*
