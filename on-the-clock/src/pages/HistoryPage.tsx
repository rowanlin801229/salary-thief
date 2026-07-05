import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DoodleMarks } from '../components/DoodleMarks'
import { RoughBox } from '../components/RoughBox'
import { RoughButton } from '../components/RoughButton'
import { useAppState } from '../context/AppStateContext'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { formatCurrency } from '../lib/salary'
import { clearTodaySessions, loadTodaySessions } from '../lib/storage'
import { formatMinutesSeconds } from '../lib/time'

export function HistoryPage() {
  const { t, language } = useLanguage()
  const { symbol } = useCurrency()
  const { setLastSession } = useAppState()
  const location = useLocation()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState(() => loadTodaySessions())

  useEffect(() => {
    setSessions(loadTodaySessions())
  }, [location.pathname])

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        setSessions(loadTodaySessions())
      }
    }

    document.addEventListener('visibilitychange', refresh)
    return () => document.removeEventListener('visibilitychange', refresh)
  }, [])

  const total = useMemo(
    () => sessions.reduce((sum, item) => sum + item.stolenAmount, 0),
    [sessions]
  )

  const handleClearRecords = () => {
    if (sessions.length === 0) return
    if (!window.confirm(t('clearRecordsConfirm'))) return

    clearTodaySessions()
    setLastSession(null)
    setSessions([])
  }

  return (
    <RoughBox className="page-card history-page">
      <DoodleMarks />
      <div className="history-form">
        <section className="history-group history-group-hero">
          <p className="result-big-title history-big-title">{t('historyTitle')}</p>
          <div className="page-cat-wrap page-cat-wrap-history">
            <img className="page-cat" src="/cats/history-cat.png" alt="" aria-hidden />
            <span className="page-cat-bubble page-cat-bubble-history">{t('historyCatQuote')}</span>
          </div>
        </section>
        <section className="history-group history-group-total">
          <div className="result-total-plain">
            <p className="result-total-label">{t('todayCumulative')}</p>
            <p className="result-total-amount">{formatCurrency(symbol, total)}</p>
          </div>
        </section>

        <section className="history-group history-group-records">
          {sessions.length === 0 ? (
            <p className="history-empty">{t('noRecordsToday')}</p>
          ) : (
            <ul className="result-today-records history-records-list">
              {sessions.map((record, index) => (
                <li key={record.id} className="result-record-item">
                  <span className="result-record-index">
                    {language === 'zh'
                      ? `${t('recordEntry')}${sessions.length - index}次`
                      : `${t('recordEntry')} ${index + 1}`}
                  </span>
                  <span className="result-record-time">{formatMinutesSeconds(record.elapsedMs)}</span>
                  <span className="result-record-amount">
                    {formatCurrency(symbol, record.stolenAmount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          className={`history-group history-group-actions${sessions.length === 0 ? ' history-group-actions-single' : ''}`}
        >
          <RoughButton
            type="button"
            className="result-secondary-button"
            frameClassName="history-action-frame"
            onClick={() => navigate(-1)}
          >
            {t('back')}
          </RoughButton>
          {sessions.length > 0 && (
            <RoughButton
              type="button"
              className="result-clear-button"
              frameClassName="history-action-frame"
              onClick={handleClearRecords}
            >
              {t('clearRecords')}
            </RoughButton>
          )}
        </section>
      </div>
    </RoughBox>
  )
}
