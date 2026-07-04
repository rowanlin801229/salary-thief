# Cursor Prompt — 按鈕 Hover 效果統一（P1）

## 目標
所有按鈕的 hover 效果改成統一的黃底紅字（黃 `#fef08a` + 紅 `#b91c1c`），創造「動一動」的視覺反應。

---

## 代碼改動

### 1. 修改 `src/index.css` — 按鈕 hover 樣式

**找到並替換以下規則：**

```css
/* OLD：移除或註解掉以下規則 */

.rough-button-frame.is-primary:hover:not(:active):not(.is-active) {
  background: rgba(230, 57, 70, 0.12);
}

.rough-button-frame:not(.is-primary):hover:not(:active):not(.is-active) {
  background: rgba(69, 123, 157, 0.15);
}

.mode-row .rough-button-frame:hover:not(.is-active):not(:active),
.lang-toggle .rough-button-frame:hover:not(.is-active):not(:active) {
  background: rgba(254, 240, 138, 0.35);
}

/* NEW：統一 hover 樣式 */

.rough-button-frame:hover:not(:active):not(.is-active) {
  background: #fef08a;
}

.rough-button-frame:hover:not(:active):not(.is-active) .rough-button-native {
  color: #b91c1c;
}

/* 老闆鍵也套用統一 hover 樣式 */

.boss-key-button-frame:hover:not(:active) {
  background: #fef08a;
  border-radius: 16px;
}

.boss-key-button-frame:hover:not(:active) .rough-button-native {
  color: #b91c1c;
}
```

**說明：**
- 移除所有舊的 hover 顏色變異（紅色半透明、藍色半透明）
- 統一改成黃底 `#fef08a` + 紅字 `#b91c1c`
- 所有按鈕類型（primary / secondary / mode / lang / boss-key）共用同一套 hover 樣式
- Active/Pressed 狀態保持不變（已經是黃底紅字）

---

## 測試清單

- [ ] 設定頁的時薪/月薪/年薪按鈕 hover 時黃底紅字
- [ ] 設定頁的「開始摸魚」按鈕 hover 時黃底紅字
- [ ] 幣別選擇按鈕 hover 時黃底紅字
- [ ] 幣別下拉選項 hover 時黃底紅字
- [ ] 語言切換按鈕（EN/中文）hover 時黃底紅字
- [ ] 漢堡菜單內的按鈕 hover 時黃底紅字
- [ ] 老闆來了按鈕 hover 時黃底紅字
- [ ] 計時頁的「結束摸魚」按鈕 hover 時黃底紅字
- [ ] 結果頁的「分享」、「返回」等按鈕 hover 時黃底紅字
- [ ] 紀錄頁的「清空紀錄」、「返回」等按鈕 hover 時黃底紅字
- [ ] Hover 後滑鼠移出，顏色恢復正常
- [ ] Active 狀態保持現有效果（不變）

---

## 預期效果

✅ 所有按鈕 hover 效果統一  
✅ 黃底紅字「動一動」的視覺反應  
✅ 簡化 CSS 邏輯，減少維護負擔  
✅ 增強視覺一致性和品牌感
