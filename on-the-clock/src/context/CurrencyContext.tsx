import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { SALARY_CONFIG_KEY } from '../lib/storage'
import type { Currency } from '../types'

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  TWD: 'NT$',
  USD: '$',
  GBP: '£'
}

const CURRENCY_STORAGE_KEY = 'selected-currency'

function isCurrency(value: string | null | undefined): value is Currency {
  return value === 'TWD' || value === 'USD' || value === 'GBP'
}

function loadInitialCurrency(): Currency {
  const saved = localStorage.getItem(CURRENCY_STORAGE_KEY)
  if (isCurrency(saved)) return saved

  try {
    const raw = localStorage.getItem(SALARY_CONFIG_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { currency?: string }
      if (isCurrency(parsed.currency)) return parsed.currency
    }
  } catch {
    // ignore
  }

  return 'TWD'
}

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (next: Currency) => void
  symbol: string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(loadInitialCurrency)

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next)
    localStorage.setItem(CURRENCY_STORAGE_KEY, next)
  }, [])

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      symbol: CURRENCY_SYMBOLS[currency]
    }),
    [currency, setCurrency]
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
