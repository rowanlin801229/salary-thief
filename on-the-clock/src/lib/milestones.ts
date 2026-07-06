import type { Language, SessionRecord } from '../types'
import {
  loadMonthlyHistory,
  loadTodaySessions,
  listMonthlyHistoryMonths,
  yearMonthFromDate
} from './storage'

export interface MilestoneStats {
  bestSingle: SessionRecord | null
  totalStolen: number
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

function computeStats(sessions: SessionRecord[]): MilestoneStats {
  if (sessions.length === 0) {
    return { bestSingle: null, totalStolen: 0 }
  }

  const bestSingle = sessions.reduce((best, record) =>
    record.stolenAmount > best.stolenAmount ? record : best
  )

  const totalStolen = sessions.reduce((sum, record) => sum + record.stolenAmount, 0)

  return { bestSingle, totalStolen }
}

export function getCurrentMonthSessions(): SessionRecord[] {
  const yearMonth = yearMonthFromDate()
  return mergeSessionsById(loadMonthlyHistory(yearMonth), loadTodaySessions())
}

export function getCurrentMonthStats(sessions: SessionRecord[]): MilestoneStats {
  return computeStats(sessions)
}

export function getAllTimeSessions(): SessionRecord[] {
  const months = listMonthlyHistoryMonths()
  const monthlyLists = months.map((yearMonth) => loadMonthlyHistory(yearMonth))
  return mergeSessionsById(...monthlyLists, loadTodaySessions())
}

export function getAllTimeStats(sessions: SessionRecord[]): MilestoneStats {
  return computeStats(sessions)
}

export function formatMilestoneDate(timestamp: number, language: Language): string {
  const date = new Date(timestamp)
  if (language === 'zh') {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(date)
}

export interface MonthSessionGroup {
  yearMonth: string
  sessions: SessionRecord[]
}

export function groupSessionsByMonth(sessions: SessionRecord[]): MonthSessionGroup[] {
  const byMonth = new Map<string, SessionRecord[]>()

  for (const record of sessions) {
    const date = new Date(record.endAt)
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const list = byMonth.get(yearMonth) ?? []
    list.push(record)
    byMonth.set(yearMonth, list)
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([yearMonth, monthSessions]) => ({
      yearMonth,
      sessions: [...monthSessions].sort((a, b) => b.endAt - a.endAt)
    }))
}

export function formatMonthGroupLabel(yearMonth: string, language: Language): string {
  const [year, month] = yearMonth.split('-').map(Number)
  if (language === 'zh') {
    return `【${year}年${month}月】`
  }
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1)
  )
}
