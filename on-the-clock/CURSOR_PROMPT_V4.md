# 🎨 Cursor Prompt — 薪水小偷 v4.0（手繪涂鴉黑白風）

**【重要】忽略所有舊 prompt。從現在開始用 v4.0 手繪涂鴉 meme 風設計。**

---

## 設計系統速覽

- **色彩**：純黑白（#FFF + #000），零灰色、零彩色
- **標題字體**：Caveat / Kalam（手寫馬克筆，可傾斜沿弧線排列）
- **正文字體**：Courier Prime（打字機字體）
- **插畫**：手繪線稿（2–4px 粗細不均），純線條、meme 風涂鴉符號
- **排版**：隨性不對稱、大量留白、涂鴉散落

---

## 實施步驟

### 1. Google Fonts 導入（public/index.html）

在 `<head>` 加入：
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet">
```

### 2. CSS 基礎（src/index.css）

```css
:root {
  --bg: #FFFFFF;
  --fg: #000000;
}

body, html {
  background: var(--bg);
  color: var(--fg);
  font-family: 'Courier Prime', monospace;
  line-height: 1.3;
}

/* 去掉所有灰色和彩色 */
* {
  color: var(--fg);
  border-color: var(--fg);
  background: var(--bg);
}
```

### 3. 標題字體（src/index.css）

```css
/* H1 Hero Title — 大字手寫，可傾斜 */
h1, .result-big-title, .setupTitle, .app-header h1 {
  font-family: 'Caveat', cursive;
  font-size: 80px;  /* 可調整到 140px */
  font-weight: 700;
  color: var(--fg);
  transform: rotate(-2deg);  /* 略微傾斜 */
  line-height: 1.1;
}

/* H2 / H3 Section Heading */
h2, h3, .result-group-title, .setup-group-title {
  font-family: 'Caveat', cursive;
  font-size: 32px;
  font-weight: 700;
  color: var(--fg);
  transform: rotate(-1deg);  /* 微傾 */
}

/* 正文 — 打字機字體，緊密 */
p, body, .setup-intro, .result-empty-text {
  font-family: 'Courier Prime', monospace;
  font-size: 13px;
  line-height: 1.3;
  color: var(--fg);
}
```

### 4. 按鈕重設計（src/index.css）

```css
button, .rough-button-frame, button-like {
  background: var(--bg);
  border: 2px solid var(--fg);
  border-radius: 0px;  /* 方角 */
  padding: 12px 24px;
  font-family: 'Caveat', cursive;  /* 手寫風 */
  font-size: 18px;
  font-weight: 700;
  color: var(--fg);
  cursor: pointer;
  min-height: 48px;
  transition: border 0.2s;
  transform: rotate(-1deg);  /* 略微傾斜，增加隨性感 */
}

button:hover {
  border-width: 3px;
}

button:active {
  background: var(--fg);
  color: var(--bg);
  border-width: 3px;
}

button:disabled {
  opacity: 0.5;  /* 淡化，但保持純黑白 */
  cursor: not-allowed;
}
```

### 5. 輸入框重設計（src/index.css）

```css
input, .rough-input-frame {
  background: var(--bg);
  border: 2px solid var(--fg);
  border-radius: 0px;
  padding: 12px 16px;
  font-family: 'Courier Prime', monospace;
  font-size: 13px;
  color: var(--fg);
  height: 44px;
}

input:focus {
  outline: none;
  border-width: 3px;
}

input::placeholder {
  color: var(--fg);
  opacity: 0.5;  /* 淡化 placeholder，但保持黑色 */
}
```

### 6. 卡片邊框（src/index.css）

```css
.page-card, .result-doodle-card, .setup-doodle-card {
  background: var(--bg);
  border: 2px solid var(--fg);
  border-radius: 2px;  /* 微圓，可選 */
  padding: 24px;
  transform: rotate(-0.5deg);  /* 非常輕微傾斜 */
}

.result-group, .setup-group, .timer-group {
  border: none;  /* 移除內部分隔 */
  margin-top: 24px;
  padding-top: 0;
}
```

### 7. 涂鴉符號裝飾（可選但推薦）

在 React 元件中加入（例如 `ResultPage.tsx` 的角落）：

```tsx
/* 用簡單 Unicode 符號或自製 SVG */
<span style={{
  position: 'absolute',
  fontSize: '24px',
  color: '#000',
  opacity: 0.7,
  transform: 'rotate(15deg)'
}}>
  ?
</span>
<span style={{ /* 星星 */ }}>★</span>
<span style={{ /* 箭頭 */ }}>→</span>
```

或用 SVG 繪製手繪線稿：
```tsx
<svg width="40" height="40" viewBox="0 0 40 40" style={{position: 'absolute'}}>
  <circle cx="20" cy="20" r="18" fill="none" stroke="#000" strokeWidth="2" />
  <path d="M 15 20 Q 20 25 25 20" fill="none" stroke="#000" strokeWidth="2" />
</svg>
```

### 8. Back Arrow 風格（src/index.css）

```css
.back-button-row {
  background: var(--bg);
  border-bottom: 2px solid var(--fg);
  padding: 12px 16px;
}

.back-button-frame {
  border: 2px solid var(--fg);
  background: var(--bg);
  width: 50px;
  height: 48px;
}

.back-button-frame:hover {
  border-width: 3px;
}
```

### 9. 移除所有灰階效果

**搜尋並替換**：
- ❌ `opacity: 0.x` → 改成 `opacity: 0.5`（純黑白，無灰）
- ❌ `rgba(...)` → 改成 `#FFF` 或 `#000`
- ❌ `#666`, `#999`, `#ccc` 等灰色 → 全改 `#000` 或 `#FFF`
- ❌ `background: linear-gradient(...)` → 改成純色 `#FFF`
- ❌ 所有彩色（紅、綠、藍等）→ 改成 `#000`

### 10. 檢查清單

- [ ] Google Fonts（Caveat + Courier Prime）載入成功
- [ ] 所有文字是 #000，所有背景是 #FFF
- [ ] 沒有灰色、沒有彩色、沒有透明度製造灰感
- [ ] H1 用 Caveat（大手寫），其他正文用 Courier Prime
- [ ] 按鈕 2–3px 黑邊框、白內部、手寫文字
- [ ] 輸入框 2px 黑邊框、白內部
- [ ] 卡片有 2px 黑邊框
- [ ] Back Arrow 邊框黑、內部白
- [ ] 所有元素可略微傾斜（-2° 到 +2°），增加隨性感
- [ ] Result Tab 邊框改黑、無彩色
- [ ] Logo 占位符改成簡單黑白圖案（可黑方形、黑圓、或迷你涂鴉）
- [ ] 涂鴉符號（?★→）隨機散落在頁面角落（optional）

---

## 關鍵提醒

⚠️ **絕對不要用灰色** — 不是 `#999` 也不是 `rgba(0, 0, 0, 0.5)`  
⚠️ **絕對不要用彩色** — 不是紅、綠、藍、橄欖綠...  
⚠️ **不要平滑圓角** — 用 0px（方）或最多 2–4px（微圓）  
⚠️ **不要 rough.js 手繪邊框** — 改成純 CSS 2px 黑線  
⚠️ **邊框粗細可變** — hover 時加粗（2px → 3px），模擬手繪筆觸

---

## 完成後測試

```bash
# 執行以確認沒有灰色
grep -r "rgba\|#[89abc][0-9a-f][0-9a-f]" src/index.css
# 不應該有輸出
```

---

**這次沒有妥協，純黑白 Meme 風。準備改了！** 🖤🤍
