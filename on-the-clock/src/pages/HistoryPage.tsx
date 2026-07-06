import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import {
  formatMonthGroupLabel,
  getAllTimeSessions,
  groupSessionsByMonth
} from '../lib/milestones'
import { formatCurrency } from '../lib/salary'
import { clearTodaySessions, loadTodaySessions } from '../lib/storage'
import { formatMinutesSeconds } from '../lib/time'
import type { SessionRecord } from '../types'

type HistoryTab = 'today' | 'allTime'

function tabFromSearchParam(value: string | null): HistoryTab {
  if (value === 'all-time' || value === 'alltime' || value === 'all-records' || value === 'month') {
    return 'allTime'
  }
  return 'today'
}

function TodayRecordList({ sessions }: { sessions: SessionRecord[] }) {
  const { t, language } = useLanguage()
  const { symbol } = useCurrency()

  if (sessions.length === 0) {
    return <p className="wireframe-empty">{t('noRecordsToday')}</p>
  }

  return (
    <ul className="wireframe-record-list">
      {sessions.map((record, index) => (
        <li key={record.id} className="wireframe-record-item wireframe-record-item-today">
          <span className="wireframe-record-index">
            {language === 'zh'
              ? `${t('recordEntry')}${sessions.length - index}次`
              : `${t('recordEntry')} ${index + 1}`}
          </span>
          <span className="wireframe-record-time">{formatMinutesSeconds(record.elapsedMs)}</span>
          <span className="wireframe-record-amount">
            {formatCurrency(symbol, record.stolenAmount)}
          </span>
        </li>
      ))}
    </ul>
  )
}

function AllTimeGroupedRecords({
  sessions,
  emptyText
}: {
  sessions: SessionRecord[]
  emptyText: string
}) {
  const { t, language } = useLanguage()
  const { symbol } = useCurrency()
  const groups = useMemo(() => groupSessionsByMonth(sessions), [sessions])

  if (groups.length === 0) {
    return <p className="wireframe-empty">{emptyText}</p>
  }

  return (
    <div className="history-month-groups">
      {groups.map((group) => (
        <section key={group.yearMonth} className="history-month-group">
          <h2 className="history-month-heading">
            {formatMonthGroupLabel(group.yearMonth, language)}
          </h2>
          <ul className="wireframe-record-list">
            {group.sessions.map((record, index) => (
              <li key={record.id} className="wireframe-record-item wireframe-record-item-today">
                <span className="wireframe-record-index">
                  {language === 'zh'
                    ? `${t('recordEntry')}${group.sessions.length - index}次`
                    : `${t('recordEntry')} ${index + 1}`}
                </span>
                <span className="wireframe-record-time">
                  {formatMinutesSeconds(record.elapsedMs)}
                </span>
                <span className="wireframe-record-amount">
                  {formatCurrency(symbol, record.stolenAmount)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export function HistoryPage() {
  const { t } = useLanguage()
  const { symbol } = useCurrency()
  const { setLastSession } = useAppState()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [sessions, setSessions] = useState(() => loadTodaySessions())
  const [activeTab, setActiveTab] = useState<HistoryTab>(() =>
    tabFromSearchParam(searchParams.get('tab'))
  )
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setSessions(loadTodaySessions())
    setRefreshKey((key) => key + 1)
    setActiveTab(tabFromSearchParam(searchParams.get('tab')))
  }, [location.pathname, searchParams])

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        setSessions(loadTodaySessions())
        setRefreshKey((key) => key + 1)
      }
    }

    document.addEventListener('visibilitychange', refresh)
    return () => document.removeEventListener('visibilitychange', refresh)
  }, [])

  const total = useMemo(
    () => sessions.reduce((sum, item) => sum + item.stolenAmount, 0),
    [sessions]
  )

  const allTimeSessions = useMemo(() => getAllTimeSessions(), [refreshKey])
  const emptyText = t('noData')

  const handleClearRecords = () => {
    if (sessions.length === 0) return
    if (!window.confirm(t('clearRecordsConfirm'))) return

    clearTodaySessions()
    setLastSession(null)
    setSessions([])
  }

  const handleTabChange = (tab: HistoryTab) => {
    setActiveTab(tab)
    if (tab === 'today') {
      navigate('/history', { replace: true })
      return
    }
    navigate('/history?tab=all-time', { replace: true })
  }

  return (
    <main className="wireframe-page history-wireframe-page">
      <h1 className="wireframe-title">{t('historyTitle')}</h1>

      <div className="result-tab-bar">
        <button
          type="button"
          className={`result-tab ${activeTab === 'today' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('today')}
        >
          {t('tabTodayRecords')}
        </button>
        <button
          type="button"
          className={`result-tab ${activeTab === 'allTime' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('allTime')}
        >
          {t('tabAllTimeRecords')}
        </button>
      </div>

      {activeTab === 'today' && (
        <section className="result-tab-content wireframe-content">
          <div className="wireframe-stat">
            <p className="wireframe-stat-label">{t('todayCumulative')}</p>
            <p className="wireframe-stat-value">{formatCurrency(symbol, total)}</p>
          </div>
          <TodayRecordList sessions={sessions} />
        </section>
      )}

      {activeTab === 'allTime' && (
        <section className="result-tab-content wireframe-content">
          <AllTimeGroupedRecords sessions={allTimeSessions} emptyText={emptyText} />
        </section>
      )}

      <div className="wireframe-actions">
        <button type="button" className="wireframe-button" onClick={() => navigate('/result')}>
          {t('back')}
        </button>
        {activeTab === 'today' && sessions.length > 0 && (
          <button type="button" className="wireframe-button" onClick={handleClearRecords}>
            {t('clearRecords')}
          </button>
        )}
      </div>
    </main>
  )
}
