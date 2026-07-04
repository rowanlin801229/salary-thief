# Cursor Prompt：計時頁碼錶改版

## 任務
計時頁（`/timer`）碼錶升級：
1. **整合時間顯示**：把「已過時間」移進 StopwatchDial 圓心顯示
2. **邊框進度條動畫**：碼錶邊框隨計時進度（0–100%）逐步繪製成圓

## 現況
**TimerPage.tsx** 版面結構：
```
timer-group-control     ← 時鐘 + ▶/暫停
timer-group-stats       ← 偷到金額（綠）+ 已過時間（藍）← 要整合進碼錶
timer-group-action      ← 結束摸魚按鈕
```

## 設計規範（DESIGN.md）
- **色系**：
  - 標籤藍：`#457b9d`（已過時間標籤「已過時間」）
  - 金額綠：`#2a9d8f`（下方保留的「偷到金額」）
  - 邊框黑：`#000`（rough.js 描邊）
  - 進度條邊框：**紅 `#e63946`**（視覺上代表計時進行）
  
- **字級**（§4）：
  - 時間標籤：22–26px
  - 時間數字（MM:SS）：32–40px
  
- **手繪**：rough.js `roughness: 2.8`、`bowing: 2.5`、線寬 3px

## 技術實現

### 1. StopwatchDial.tsx 修改
**SVG 中新增圓形進度邊框**：
- 內圈：已過時間（標籤 + MM:SS 數字）
- 外圈：黑色底邊框（rough.js 已有）+ **紅色進度邊框**（新增）

**進度計算**：
```
進度 % = (elapsedMs / 某個基準值) * 100
```
> 問題：「基準值」是什麼？
> - Option A：無上限（純粹顯示 0–100%，超過 100% 就滿了）
> - Option B：固定計時上限（e.g. 60 分鐘滿 100%）
> - 建議：先用 Option A（簡單），邊框跑完就不動了

**實現方式**（SVG stroke-dasharray）：
```svg
<!-- 黑色底邊 (rough 元件) -->
<g class="stopwatch-dial-bg">...</g>

<!-- 進度邊框 (新增) -->
<circle 
  class="stopwatch-progress-ring"
  cx="98" 
  cy="98" 
  r="92"
  stroke="#e63946"
  stroke-width="3"
  fill="none"
  stroke-dasharray="577"           <!-- 2πr ≈ 577 (r=92) -->
  stroke-dashoffset={計算出的偏移量}
  stroke-linecap="round"
/>
```

圓周長公式：`2πr`（r=92 → 約 577px）
偏移量公式：`(1 - 進度%) × 圓周長`

### 2. TimerPage.tsx 改動

**移除 `.timer-stat-secondary`**（已過時間獨立區塊）：
```tsx
// 刪除或註解掉：
// <div className="timer-stat timer-stat-secondary">
//   <p className="timer-stat-label">{t('elapsed')}</p>
//   <p className="timer-stat-value timer-stat-time">{formatMinutesSeconds(elapsedMs)}</p>
// </div>

// 改為傳給 StopwatchDial：
<StopwatchDial elapsedMs={elapsedMs} isActive={isRunning} />
```

**版面層級調整**：
```
timer-group-control
  ├─ StopwatchDial（含內部時間顯示 + 外圈進度邊框）
  ├─ ▶/暫停按鈕
  └─ 提示文案
  
[虛線分隔]

timer-group-stats
  └─ 偷到金額（綠 64px）← 保留

[虛線分隔]

timer-group-action
  ├─ 結束摸魚按鈕
  └─ 提示文案
```

### 3. CSS 更新（src/index.css）

**移除或隱藏**：
```css
.timer-stat-secondary { display: none; }
```

**新增進度環動畫**（可選，讓邊框更生動）：
```css
.stopwatch-progress-ring {
  transition: stroke-dashoffset 0.1s linear;  /* 平滑更新 */
}

@media (prefers-reduced-motion: reduce) {
  .stopwatch-progress-ring {
    transition: none;
  }
}
```

## Props 調整

**StopwatchDial 元件簽名**：
```tsx
interface StopwatchDialProps {
  elapsedMs: number;        // 已過時間（毫秒）
  isActive: boolean;        // 計時中？
}

// 新增可選 props（若需要）：
// maxDurationMs?: number;  // 進度條 100% 對應的時長（預設無限長）
```

## 測試清單
- [ ] 計時中：邊框從 0% 逐步繪製；內部時間實時更新
- [ ] 暫停時：邊框停止；時間凍結
- [ ] 計時重新開始：邊框繼續從上一個位置跑
- [ ] 計時結束後跳結果頁
- [ ] 手機 & 桌面：碼錶 196px，內文清晰、不重疊
- [ ] 「老闆來了」：不影響計時
- [ ] 邊框圓周滿後行為（超過 100%？）

## 參考檔案
- `src/components/StopwatchDial.tsx`（主要改這個）
- `src/pages/TimerPage.tsx`（移除 timer-stat-secondary）
- `src/index.css`（CSS 調整）
- `DESIGN.md` §6（元件規範）、§9（動效原則）
- `src/lib/time.ts`（formatMinutesSeconds）

## 備註
- 邊框顏色用紅 `#e63946` 是為了與「計時中」視覺呼應（進度條 = 正在跑）
- 如果邊框顏色不滿意，改成藍 `#457b9d` 也可
- 進度邊框應保留 `stroke-linecap="round"` 讓端點更柔和（與手繪風一致）
