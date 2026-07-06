import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import {
  formatMilestoneDate,
  getAllTimeSessions,
  getAllTimeStats,
  getCurrentMonthSessions,
  getCurrentMonthStats
} from '../lib/milestones'
import { formatCurrency } from '../lib/salary'
import { formatMinutesSeconds } from '../lib/time'
import type { SessionRecord } from '../types'

function StatBlock({
  label,
  amount,
  time,
  date
}: {
  label: string
  amount: string
  time?: string
  date?: string
}) {
  return (
    <div className="wireframe-stat">
      <p className="wireframe-stat-label">{label}</p>
      <p className="wireframe-stat-value">{time ? `${amount} (${time})` : amount}</p>
      {date && <p className="wireframe-stat-date">{date}</p>}
    </div>
  )
}

function BestSingleBlock({
  label,
  record,
  symbol,
  language,
  emptyText
}: {
  label: string
  record: SessionRecord | null
  symbol: string
  language: 'en' | 'zh'
  emptyText: string
}) {
  if (!record) {
    return (
      <div className="wireframe-stat">
        <p className="wireframe-stat-label">{label}</p>
        <p className="wireframe-stat-value">{emptyText}</p>
      </div>
    )
  }

  return (
    <StatBlock
      label={label}
      amount={formatCurrency(symbol, record.stolenAmount)}
      time={formatMinutesSeconds(record.elapsedMs)}
      date={formatMilestoneDate(record.endAt, language)}
    />
  )
}

export function AchievementPage() {
  const { t, language } = useLanguage()
  const { symbol } = useCurrency()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'month' | 'allTime'>('month')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setRefreshKey((key) => key + 1)
  }, [location.pathname])

  const monthSessions = useMemo(() => getCurrentMonthSessions(), [refreshKey])
  const allTimeSessions = useMemo(() => getAllTimeSessions(), [refreshKey])
  const monthStats = useMemo(() => getCurrentMonthStats(monthSessions), [monthSessions])
  const allTimeStats = useMemo(() => getAllTimeStats(allTimeSessions), [allTimeSessions])

  const hasAnyData = allTimeSessions.length > 0
  const emptyValue = t('noData')

  if (!hasAnyData) {
    return (
      <main className="wireframe-page achievement-wireframe-page">
        <h1 className="wireframe-title">{t('achievementTitle')}</h1>
        <p className="wireframe-empty">{emptyValue}</p>
        <div className="wireframe-actions">
          <button type="button" className="wireframe-button" onClick={() => navigate('/result')}>
            {t('back')}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="wireframe-page achievement-wireframe-page">
      <h1 className="wireframe-title">{t('achievementTitle')}</h1>

      <div className="result-tab-bar">
        <button
          type="button"
          className={`result-tab ${activeTab === 'month' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('month')}
        >
          {t('tabMonthAchievement')}
        </button>
        <button
          type="button"
          className={`result-tab ${activeTab === 'allTime' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('allTime')}
        >
          {t('tabAllTimeAchievement')}
        </button>
      </div>

      {activeTab === 'month' && (
        <section className="result-tab-content wireframe-content">
          <BestSingleBlock
            label={t('bestSingleMonth')}
            record={monthStats.bestSingle}
            symbol={symbol}
            language={language}
            emptyText={emptyValue}
          />
          <StatBlock
            label={t('monthTotal')}
            amount={
              monthStats.totalStolen > 0
                ? formatCurrency(symbol, monthStats.totalStolen)
                : emptyValue
            }
          />
        </section>
      )}

      {activeTab === 'allTime' && (
        <section className="result-tab-content wireframe-content">
          <BestSingleBlock
            label={t('bestSingleAllTime')}
            record={allTimeStats.bestSingle}
            symbol={symbol}
            language={language}
            emptyText={emptyValue}
          />
          <StatBlock
            label={t('allTimeTotal')}
            amount={formatCurrency(symbol, allTimeStats.totalStolen)}
          />
        </section>
      )}

      <div className="wireframe-actions">
        <button type="button" className="wireframe-button" onClick={() => navigate('/result')}>
          {t('back')}
        </button>
        <button type="button" className="wireframe-button" onClick={() => navigate('/history')}>
          {t('viewDetailRecords')}
        </button>
      </div>
    </main>
  )
}
