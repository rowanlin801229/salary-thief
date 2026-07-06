import { defaultSalaryConfig } from './salary'
import type { Currency, SalaryConfig, SessionRecord } from '../types'

const HISTORY_KEY = 'on-the-clock/history'
const HISTORY_DATE_KEY = 'on-the-clock/history-date'
const LAST_SESSION_KEY = 'on-the-clock/last-session'
const SALARY_CONFIG_KEY = 'on-the-clock/salary-config'
const MONTHLY_HISTORY_PREFIX = 'on-the-clock/monthly-history-'

export { SALARY_CONFIG_KEY, MONTHLY_HISTORY_PREFIX }

export function yearMonthFromDate(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function monthlyHistoryStorageKey(yearMonth: string): string {
  return `${MONTHLY_HISTORY_PREFIX}${yearMonth}`
}

function mergeSessionsById(...lists: SessionRecord[][]): SessionRecord[] {
  const byId = new Map<string, SessionRecord>()
  for (const list of lists) {
    for (const record of list) {
      byId.set(record.id, record)
    }
  }
  return Array.from(byId.values())
}

function parseSessionRecords(raw: string | null): SessionRecord[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as SessionRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function isCurrency(value: unknown): value is Currency {
  return value === 'TWD' || value === 'USD' || value === 'GBP'
}

function todayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10)
}

export function loadTodaySessions(): SessionRecord[] {
  const storedDate = localStorage.getItem(HISTORY_DATE_KEY)
  const today = todayKey()
  if (storedDate !== today) {
    localStorage.setItem(HISTORY_DATE_KEY, today)
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]))
    return []
  }

  return parseSessionRecords(localStorage.getItem(HISTORY_KEY))
}

export function loadMonthlyHistory(yearMonth: string): SessionRecord[] {
  return parseSessionRecords(localStorage.getItem(monthlyHistoryStorageKey(yearMonth)))
}

export function saveMonthlyHistory(yearMonth: string, records: SessionRecord[]): void {
  localStorage.setItem(monthlyHistoryStorageKey(yearMonth), JSON.stringify(records))
}

export function listMonthlyHistoryMonths(): string[] {
  const months: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(MONTHLY_HISTORY_PREFIX)) {
      months.push(key.slice(MONTHLY_HISTORY_PREFIX.length))
    }
  }
  return months
}

function syncTodaySessionsToMonthlyHistory(records: SessionRecord[]): void {
  if (records.length === 0) return
  const yearMonth = yearMonthFromDate()
  const merged = mergeSessionsById(loadMonthlyHistory(yearMonth), records)
  saveMonthlyHistory(yearMonth, merged)
}

export function saveTodaySessions(records: SessionRecord[]): void {
  localStorage.setItem(HISTORY_DATE_KEY, todayKey())
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
  syncTodaySessionsToMonthlyHistory(records)
}

export function saveLastSession(session: SessionRecord): void {
  sessionStorage.setItem(LAST_SESSION_KEY, JSON.stringify(session))
}

export function loadLastSession(): SessionRecord | null {
  const raw = sessionStorage.getItem(LAST_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as SessionRecord
  } catch {
    return null
  }
}

export function clearLastSession(): void {
  sessionStorage.removeItem(LAST_SESSION_KEY)
}

export function clearTodaySessions(): void {
  saveTodaySessions([])
  clearLastSession()
}

export function loadSalaryConfig(): SalaryConfig {
  const raw = localStorage.getItem(SALARY_CONFIG_KEY)
  if (!raw) return defaultSalaryConfig

  try {
    const parsed = JSON.parse(raw) as SalaryConfig
    if (typeof parsed.amount !== 'number' || !parsed.mode) {
      return defaultSalaryConfig
    }
    return {
      ...defaultSalaryConfig,
      ...parsed,
      currency: isCurrency(parsed.currency) ? parsed.currency : defaultSalaryConfig.currency
    }
  } catch {
    return defaultSalaryConfig
  }
}

export function saveSalaryConfig(config: SalaryConfig): void {
  localStorage.setItem(SALARY_CONFIG_KEY, JSON.stringify(config))
}
