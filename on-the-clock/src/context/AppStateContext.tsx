import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { clearLastSession, loadSalaryConfig, saveSalaryConfig } from '../lib/storage'
import type { SalaryConfig, SessionRecord } from '../types'

interface AppStateContextValue {
  salaryConfig: SalaryConfig
  setSalaryConfig: (config: SalaryConfig) => void
  timerStartAt: number | null
  timerPausedAt: number | null
  timerActive: boolean
  startTimer: () => void
  stopTimer: () => void
  clearTimer: () => void
  lastSession: SessionRecord | null
  setLastSession: (session: SessionRecord | null) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [salaryConfig, setSalaryConfigState] = useState<SalaryConfig>(() => loadSalaryConfig())
  const [timerStartAt, setTimerStartAt] = useState<number | null>(null)
  const [timerPausedAt, setTimerPausedAt] = useState<number | null>(null)
  const [timerActive, setTimerActive] = useState(false)
  const [lastSession, setLastSession] = useState<SessionRecord | null>(null)

  const setSalaryConfig = useCallback((config: SalaryConfig) => {
    setSalaryConfigState(config)
    saveSalaryConfig(config)
    localStorage.setItem('selected-currency', config.currency)
  }, [])

  const startTimer = useCallback(() => {
    setTimerStartAt(Date.now())
    setTimerPausedAt(null)
    setTimerActive(true)
  }, [])

  const stopTimer = useCallback(() => setTimerStartAt(null), [])

  const clearTimer = useCallback(() => {
    setLastSession(null)
    setTimerStartAt(null)
    setTimerPausedAt(null)
    setTimerActive(false)
    clearLastSession()
  }, [])

  const value = useMemo<AppStateContextValue>(
    () => ({
      salaryConfig,
      setSalaryConfig,
      timerStartAt,
      timerPausedAt,
      timerActive,
      startTimer,
      stopTimer,
      clearTimer,
      lastSession,
      setLastSession
    }),
    [
      salaryConfig,
      timerStartAt,
      timerPausedAt,
      timerActive,
      lastSession,
      setSalaryConfig,
      startTimer,
      stopTimer,
      clearTimer
    ]
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
