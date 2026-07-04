import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoughBox } from '../components/RoughBox'
import { RoughButton } from '../components/RoughButton'
import { StopwatchDial } from '../components/StopwatchDial'
import { TimerToggleIcon } from '../components/TimerToggleIcon'
import { useAppState } from '../context/AppStateContext'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { formatCurrency, getPerMinuteRate, isScheduleComplete } from '../lib/salary'
import { loadTodaySessions, saveLastSession, saveTodaySessions } from '../lib/storage'
import { formatMinutesSeconds } from '../lib/time'

export function TimerPage() {
  const { t, language } = useLanguage()
  const { symbol } = useCurrency()
  const { salaryConfig, timerStartAt, stopTimer, setLastSession } = useAppState()
  const [now, setNow] = useState(() => Date.now())
  const [accumulatedMs, setAccumulatedMs] = useState(0)
  const [activeSince, setActiveSince] = useState<number | null>(() => timerStartAt)
  const [sessionStartAt, setSessionStartAt] = useState<number | null>(() => timerStartAt)
  const navigate = useNavigate()

  const canStart = salaryConfig.amount > 0 && isScheduleComplete(salaryConfig)
  const isRunning = activeSince !== null

  useEffect(() => {
    if (!timerStartAt || activeSince !== null) return
    setSessionStartAt(timerStartAt)
    setActiveSince(timerStartAt)
  }, [timerStartAt, activeSince])

  useEffect(() => {
    if (!isRunning) return
    const timerId = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(timerId)
  }, [isRunning])

  const elapsedMs = useMemo(() => {
    if (!activeSince) return accumulatedMs
    return accumulatedMs + Math.max(0, now - activeSince)
  }, [accumulatedMs, activeSince, now])

  const perMinuteRate = useMemo(() => getPerMinuteRate(salaryConfig), [salaryConfig])
  const stolenAmount = (elapsedMs / 60000) * perMinuteRate

  const stopwatchAriaLabel =
    language === 'zh'
      ? `${t('stopwatchLabel')}，${formatMinutesSeconds(elapsedMs)}，${isRunning ? t('timerRunning') : t('timerPaused')}`
      : `${t('stopwatchLabel')}, ${formatMinutesSeconds(elapsedMs)}, ${isRunning ? t('timerRunning') : t('timerPaused')}`

  const toggleStopwatch = () => {
    if (!canStart) return

    if (isRunning) {
      setAccumulatedMs(elapsedMs)
      setActiveSince(null)
      return
    }

    const startedAt = Date.now()
    if (!sessionStartAt) {
      setSessionStartAt(startedAt)
    }
    setActiveSince(startedAt)
  }

  const handleStop = () => {
    if (!canStart || elapsedMs <= 0) return

    const endAt = Date.now()
    const finalElapsedMs = elapsedMs
    const finalStolenAmount = (finalElapsedMs / 60000) * perMinuteRate
    const startAt = sessionStartAt ?? endAt - finalElapsedMs
    const session = {
      id: crypto.randomUUID(),
      startAt,
      endAt,
      elapsedMs: finalElapsedMs,
      stolenAmount: finalStolenAmount
    }

    const existing = loadTodaySessions()
    saveTodaySessions([session, ...existing])
    saveLastSession(session)
    setLastSession(session)
    stopTimer()
    navigate('/result')
  }

  return (
    <RoughBox className="page-card timer-page">
      <div className="timer-form">
        <section className="timer-group timer-group-control">
          <StopwatchDial
            elapsedMs={elapsedMs}
            isActive={isRunning}
            ariaLabel={stopwatchAriaLabel}
          />
          <RoughButton
            type="button"
            className="stopwatch-toggle-button"
            frameClassName="stopwatch-toggle-button-frame"
            onClick={toggleStopwatch}
            disabled={!canStart}
            aria-label={isRunning ? t('pauseTimerAria') : t('startTimerAria')}
          >
            <TimerToggleIcon isRunning={isRunning} />
          </RoughButton>
          {!canStart && <p className="timer-page-hint">{t('startFromSetup')}</p>}
          {canStart && elapsedMs <= 0 && !isRunning && (
            <p className="timer-page-hint">{t('timerTapHint')}</p>
          )}
        </section>

        <section className="timer-group timer-group-stats">
          <div className="result-stat result-stat-hero">
            <p className="result-stat-label">{t('stolenAmount')}</p>
            <p className="result-stat-value timer-stat-money">{formatCurrency(symbol, stolenAmount)}</p>
          </div>
        </section>

        <section className="timer-group timer-group-action">
          <RoughButton
            type="button"
            primary
            className="timer-end-button"
            frameClassName="timer-end-button-frame"
            onClick={handleStop}
            disabled={elapsedMs <= 0}
          >
            {t('endSlacking')}
          </RoughButton>
          {elapsedMs <= 0 && <p className="timer-page-hint timer-page-hint-end">{t('timerEndHint')}</p>}
        </section>
      </div>
    </RoughBox>
  )
}
