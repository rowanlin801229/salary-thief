# Cursor Prompt — 幣別選擇功能（P1）

## 目標
在設定頁的薪資輸入框旁邊，加入幣別選擇按鈕（NT$ / $ / £），點擊展開下拉選單。幣別選擇獨立於語言，支援持久化保存。

---

## 代碼改動清單

### 1. 更新類型定義 — `src/types/index.ts`

在 `SalaryConfig` 中加入幣別欄位：

```typescript
export interface SalaryConfig {
  mode: 'hourly' | 'monthly' | 'annual'
  amount: number
  daysPerMonth?: number
  hoursPerDay?: number
  hoursPerWeek?: number
  weeksPerYear?: number
  currency?: 'TWD' | 'USD' | 'GBP'  // ← 新增，預設 'TWD'
}
```

---

### 2. 建立 CurrencyContext — `src/context/CurrencyContext.tsx`（新檔案）

管理全局幣別狀態（獨立於語言）。

```typescript
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type Currency = 'TWD' | 'USD' | 'GBP'

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  TWD: 'NT$',
  USD: '$',
  GBP: '£'
}

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (next: Currency) => void
  symbol: string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('selected-currency')
    return (saved as Currency) || 'TWD'
  })

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency: (next) => {
        setCurrency(next)
        localStorage.setItem('selected-currency', next)
      },
      symbol: CURRENCY_SYMBOLS[currency]
    }),
    [currency]
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}
```

---

### 3. 建立 CurrencySelectorButton 組件 — `src/components/CurrencySelectorButton.tsx`（新檔案）

```typescript
import { useState, useRef, useEffect } from 'react'
import { RoughButton } from './RoughButton'
import type { ReactNode } from 'react'

type Currency = 'TWD' | 'USD' | 'GBP'

const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'TWD', label: 'NT$' },
  { value: 'USD', label: '$' },
  { value: 'GBP', label: '£' }
]

interface Props {
  value: Currency
  onChange: (currency: Currency) => void
  disabled?: boolean
}

export function CurrencySelectorButton({ value, onChange, disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentLabel = CURRENCY_OPTIONS.find((opt) => opt.value === value)?.label || 'NT$'

  // 點擊外部關閉選單
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        menuRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // 鍵盤支持：Escape 關閉、上下箭頭導覽、Enter 選擇
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      return
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="currency-selector-button-container" ref={buttonRef}>
      <button
        type="button"
        className="currency-selector-button rough-button-frame"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Select currency"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="rough-button-native" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span>{currentLabel}</span>
          <span style={{ fontSize: '14px', lineHeight: 1 }}>▼</span>
        </div>
      </button>

      {isOpen && (
        <div className="currency-selector-menu" ref={menuRef} role="listbox">
          {CURRENCY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`currency-selector-option ${value === option.value ? 'is-active' : ''}`}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### 4. 更新 AppStateContext — `src/context/AppStateContext.tsx`

在 `setSalaryConfig` 時同步更新幣別：

```typescript
// 在現有的 setSalaryConfig 中，確保 currency 欄位被保存
const setSalaryConfig = (config: SalaryConfig) => {
  setSalaryConfigState(config)
  localStorage.setItem('salary-config', JSON.stringify(config))
}
```

---

### 5. 更新 App.tsx — 加入 CurrencyProvider

```typescript
import { CurrencyProvider } from './context/CurrencyContext'

export function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AppStateProvider>
          {/* existing app structure */}
        </AppStateProvider>
      </CurrencyProvider>
    </LanguageProvider>
  )
}
```

---

### 6. 更新 SetupPage.tsx — 加入幣別選擇按鈕

在薪資輸入框部分改為並排：

```typescript
import { CurrencySelectorButton } from '../components/CurrencySelectorButton'
import { useCurrency } from '../context/CurrencyContext'

export function SetupPage() {
  const { currency, setCurrency } = useCurrency()
  // ... existing code ...

  return (
    <RoughBox className="page-card setup-doodle-card">
      {/* existing title, intro, howto ... */}

      <div className="setup-form">
        <section className="setup-group" aria-labelledby="setup-salary-heading">
          <div className="setup-field">
            <label className="field-label" id="setup-salary-heading" htmlFor="salary-amount">
              {t('salary')}
            </label>
            <div className="setup-field-stack">
              <div className="mode-row">
                {/* existing mode buttons: 時薪 / 月薪 / 年薪 */}
              </div>
              
              {/* NEW: 輸入框 + 幣別按鈕並排 */}
              <div className="setup-field-input-group">
                <RoughInput
                  id="salary-amount"
                  type="number"
                  min="0"
                  value={salaryConfig.amount || ''}
                  onChange={(event) =>
                    setSalaryConfig({ ...salaryConfig, amount: Math.max(0, Number(event.target.value) || 0) })
                  }
                  placeholder={
                    salaryConfig.mode === 'hourly'
                      ? `${CURRENCY_SYMBOLS[currency]}/時`
                      : `${CURRENCY_SYMBOLS[currency]}`
                  }
                />
                <CurrencySelectorButton
                  value={currency}
                  onChange={setCurrency}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* existing schedule & rate sections ... */}
      </div>
    </RoughBox>
  )
}
```

---

### 7. 加入 CSS 樣式 — `src/index.css`

```css
/* 幣別選擇按鈕容器 */
.setup-field-input-group {
  display: flex;
  gap: 8px;
  width: 100%;
  align-items: stretch;
}

.setup-field-input-group .rough-input-frame {
  flex: 1;
  min-width: 0;
}

/* 幣別選擇按鈕 */
.currency-selector-button-container {
  position: relative;
  flex-shrink: 0;
}

.currency-selector-button {
  min-width: 110px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
}

.currency-selector-button .rough-button-native {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 26px;
  font-weight: 700;
  color: #e63946;
}

.currency-selector-button:disabled {
  opacity: 0.38;
  pointer-events: none;
}

/* 下拉選單 */
.currency-selector-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 1000;
  min-width: 110px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  border: 3px solid #111;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* optional: rough.js 手繪邊框 */
}

/* 下拉選項 */
.currency-selector-option {
  padding: 10px 14px;
  border: none;
  background: #fff;
  color: #111;
  font-size: 26px;
  font-weight: 400;
  cursor: pointer;
  text-align: center;
  border-radius: 0;
  transition: background-color 0.15s, color 0.15s;
}

.currency-selector-option:hover {
  background: rgba(254, 240, 138, 0.35);
}

.currency-selector-option.is-active {
  background: #fef08a;
  color: #b91c1c;
  font-weight: 700;
}

.currency-selector-option:focus-visible {
  outline: 2px solid #e63946;
  outline-offset: -2px;
}

.currency-selector-option:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

/* 響應式調整（≤520px 時） */
@media (max-width: 520px) {
  .setup-field-input-group {
    gap: 6px;
  }

  .currency-selector-button {
    min-width: 100px;
  }

  .currency-selector-button .rough-button-native {
    font-size: 22px;
  }

  .currency-selector-option {
    font-size: 22px;
    padding: 8px 12px;
  }
}
```

---

### 8. 更新 LanguageContext（可選）— 移除自動幣別邏輯

如果 `LanguageContext` 中有自動設定 `currencySymbol` 的邏輯，改為直接從 `CurrencyContext` 讀取。

```typescript
// OLD（刪除）：
// currencySymbol: language === 'en' ? '$' : 'NT$'

// NEW（改為使用 CurrencyContext）：
// 在需要幣別的地方使用 useCurrency() hook
```

---

## 測試清單

- [ ] 刷新頁面，幣別選擇按鈕顯示正確（預設 NT$）
- [ ] 點擊按鈕，下拉選單展開
- [ ] 選擇不同幣別，按鈕更新、placeholder 更新
- [ ] 刷新頁面，幣別保持上次選擇（localStorage）
- [ ] 按鍵盤：Tab 進入按鈕 → Enter 展開 → 上下箭頭導覽 → Enter 選擇 → Escape 關閉
- [ ] 禁用按鈕：灰化、無法點擊
- [ ] 下拉選單點選外部關閉
- [ ] 每分鐘薪資計算使用選中的幣別

---

## 備註

- 暫不加入 rough.js 手繪邊框到下拉選單（先用簡單邊框測試效果，後續可調整）
- 下拉選項可改為並排（三個並排）或垂直（垂直列表），根據視覺效果再決定
- localStorage 鍵名：`selected-currency`

---

## 預期效果

✅ 幣別獨立選擇（不綁語言）  
✅ 輸入框 + 幣別按鈕並排  
✅ 點擊展開下拉選單（三個選項）  
✅ 選擇後更新 + localStorage 持久化  
✅ 無障礙支持（ARIA + 鍵盤）  
✅ 手繪風格 + 紅色主題統一
