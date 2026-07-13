import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoodleMarks } from '../components/DoodleMarks'
import { RoughBox } from '../components/RoughBox'
import { RoughButton } from '../components/RoughButton'
import { useAppState } from '../context/AppStateContext'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { saveSessionToFirebase } from '../lib/firestore-session'
import { formatCurrency, isScheduleComplete } from '../lib/salary'
import { clearTodaySessions, loadLastSession, loadTodaySessions } from '../lib/storage'
import { formatMinutesSeconds } from '../lib/time'

function ResultShell({ children }: { children: ReactNode }) {
  return (
    <RoughBox className="page-card result-doodle-card">
      <DoodleMarks />
      {children}
    </RoughBox>
  )
}

export function ResultPage() {
  const { t, language } = useLanguage()
  const { symbol } = useCurrency()
  const { lastSession, startTimer, setLastSession, salaryConfig } = useAppState()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'session' | 'today'>('session')
  const [copied, setCopied] = useState(false)
  const [todayRecords, setTodayRecords] = useState(() => loadTodaySessions())

  useEffect(() => {
    if (!(salaryConfig.amount > 0 && isScheduleComplete(salaryConfig))) {
      navigate('/setup', { replace: true })
    }
  }, [salaryConfig, navigate])

  useEffect(() => {
    setTodayRecords(loadTodaySessions())

    if (user && lastSession) {
      saveSessionToFirebase(user.uid, lastSession).catch((err) => {
        console.error('[ResultPage] Failed to save session to Firebase:', err)
      })
    }
  }, [lastSession, user])

  const session = useMemo(
    () => lastSession ?? loadLastSession() ?? todayRecords[0] ?? null,
    [lastSession, todayRecords]
  )

  const totalAmount = useMemo(
    () => todayRecords.reduce((sum, record) => sum + record.stolenAmount, 0),
    [todayRecords]
  )

  const previewRecords = useMemo(() => todayRecords.slice(0, 3), [todayRecords])

  useEffect(() => {
    if (!copied) return
    const timerId = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timerId)
  }, [copied])

  const shareText =
    language === 'zh'
      ? `我今天摸魚 ${formatCurrency(symbol, totalAmount)}！`
      : `I slacked off for ${formatCurrency(symbol, totalAmount)} today!`

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = shareText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
    }
  }

  const handleClearRecords = () => {
    if (todayRecords.length === 0) return
    if (!window.confirm(t('clearRecordsConfirm'))) return

    clearTodaySessions()
    setLastSession(null)
    setTodayRecords([])
  }

  if (!session) {
    return (
      <ResultShell>
        <div className="result-form">
          <section className="result-group result-group-hero">
            <p className="result-big-title">{t('resultTitle')}</p>
          </section>
          <div className="page-cat-wrap page-cat-wrap-result">
            <img className="page-cat" src="/cats/result-cat.png" alt="" aria-hidden />
            <span className="page-cat-bubble page-cat-bubble-result">{t('resultCatQuote')}</span>
          </div>
          <section className="result-group result-group-empty">
            <p className="result-empty-text">{t('noSessionYet')}</p>
            <div className="result-empty-actions result-actions-row">
              <RoughButton
                type="button"
                primary
                className="result-continue-button"
                frameClassName="result-continue-button-frame"
                onClick={() => {
                  startTimer()
                  navigate('/timer')
                }}
              >
                {t('goTimer')}
              </RoughButton>
              <RoughButton
                type="button"
                className="result-empty-secondary-button"
                frameClassName="result-empty-secondary-button-frame"
                onClick={() => navigate('/setup')}
              >
                {t('goSetup')}
              </RoughButton>
            </div>
          </section>
        </div>
      </ResultShell>
    )
  }

  return (
    <ResultShell>
      <div className="result-form">
        <section className="result-group result-group-hero">
          <span className="page-burst result-title-burst" aria-hidden>{t('resultBurst')}</span>
          <p className="result-big-title">{t('resultTitle')}</p>
        </section>

        <div className="page-cat-wrap page-cat-wrap-result">
          <img className="page-cat" src="/cats/result-cat.png" alt="" aria-hidden />
          <span className="page-cat-bubble page-cat-bubble-result">{t('resultCatQuote')}</span>
        </div>

        <div className="result-tab-bar">
          <button
            type="button"
            className={`result-tab ${activeTab === 'session' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('session')}
          >
            {language === 'zh' ? '本次戰績' : 'This Round'}
          </button>
          <button
            type="button"
            className={`result-tab ${activeTab === 'today' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            {language === 'zh' ? '今日戰績' : 'Today'}
          </button>
        </div>

        {activeTab === 'session' && (
          <div className="result-tab-content result-tab-session">
            <section className="result-group result-group-session">
              <p className="result-group-title">
                {language === 'zh' ? '金額 & 時間' : 'Amount & Time'}
              </p>
              <div className="result-stat result-stat-hero">
                <p className="result-stat-label">{t('sessionAmount')}</p>
                <p className="result-stat-value result-stat-money">
                  {formatCurrency(symbol, session.stolenAmount)}
                </p>
              </div>
              <div className="result-stat result-stat-secondary">
                <p className="result-stat-label">{t('sessionTime')}</p>
                <p className="result-stat-value result-stat-time">
                  {formatMinutesSeconds(session.elapsedMs)}
                </p>
              </div>
            </section>

            <section className="result-group result-group-action">
              <div className="result-actions-row">
                <RoughButton
                  type="button"
                  primary
                  className="result-continue-button"
                  frameClassName="result-continue-button-frame"
                  onClick={() => {
                    startTimer()
                    navigate('/timer')
                  }}
                >
                  {t('continueSlacking')}
                </RoughButton>
                <RoughButton
                  type="button"
                  className="result-share-button"
                  frameClassName="result-share-button-frame"
                  onClick={handleShare}
                >
                  {copied ? t('copied') : t('share')}
                </RoughButton>
              </div>
            </section>

            <section className="result-group result-group-reconfigure">
              <RoughButton
                type="button"
                className="result-reconfigure-button"
                frameClassName="result-reconfigure-button-frame"
                onClick={() => navigate('/setup')}
              >
                {t('reconfigureSalary')}
              </RoughButton>
            </section>
          </div>
        )}

        {activeTab === 'today' && (
          <div className="result-tab-content result-tab-today">
            <section className="result-group result-group-today">
              <div className="result-total-plain">
                <p className="result-total-label">{t('todayCumulative')}</p>
                <p className="result-total-amount">{formatCurrency(symbol, totalAmount)}</p>
              </div>

              {todayRecords.length > 0 ? (
                <>
                  <ul className="result-today-records">
                    {previewRecords.map((record, index) => (
                      <li key={record.id} className="result-record-item">
                        <span className="result-record-index">
                          {language === 'zh'
                            ? `${t('recordEntry')}${todayRecords.length - index}次`
                            : `${t('recordEntry')} ${index + 1}`}
                        </span>
                        <span className="result-record-time">
                          {formatMinutesSeconds(record.elapsedMs)}
                        </span>
                        <span className="result-record-amount">
                          {formatCurrency(symbol, record.stolenAmount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <RoughButton
                    type="button"
                    className="result-view-more-button"
                    frameClassName="result-view-more-button-frame"
                    onClick={() => navigate('/history')}
                  >
                    {t('viewMore')}
                  </RoughButton>
                </>
              ) : (
                <p className="result-today-records-empty">{t('noRecordsToday')}</p>
              )}

              {todayRecords.length > 0 && (
                <RoughButton
                  type="button"
                  className="result-clear-button"
                  frameClassName="result-clear-button-frame"
                  onClick={handleClearRecords}
                >
                  {t('clearRecords')}
                </RoughButton>
              )}
            </section>
          </div>
        )}
      </div>
    </ResultShell>
  )
}
