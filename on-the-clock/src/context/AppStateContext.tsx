import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { loadSalaryConfig, saveSalaryConfig } from '../lib/storage'
import type { SalaryConfig, SessionRecord } from '../types'

interface AppStateContextValue {
  salaryConfig: SalaryConfig
  setSalaryConfig: (config: SalaryConfig) => void
  timerStartAt: number | null
  startTimer: () => void
  stopTimer: () => void
  lastSession: SessionRecord | null
  setLastSession: (session: SessionRecord | null) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [salaryConfig, setSalaryConfigState] = useState<SalaryConfig>(() => loadSalaryConfig())
  const [timerStartAt, setTimerStartAt] = useState<number | null>(null)
  const [lastSession, setLastSession] = useState<SessionRecord | null>(null)

  const setSalaryConfig = useCallback((config: SalaryConfig) => {
    setSalaryConfigState(config)
    saveSalaryConfig(config)
    localStorage.setItem('selected-currency', config.currency)
  }, [])

  const value = useMemo<AppStateContextValue>(
    () => ({
      salaryConfig,
      setSalaryConfig,
      timerStartAt,
      startTimer: () => setTimerStartAt(Date.now()),
      stopTimer: () => setTimerStartAt(null),
      lastSession,
      setLastSession
    }),
    [salaryConfig, timerStartAt, lastSession, setSalaryConfig]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}
