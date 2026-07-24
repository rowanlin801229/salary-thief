import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoodleMarks } from '../components/DoodleMarks'
import { RoughBox } from '../components/RoughBox'
import { RoughButton } from '../components/RoughButton'
import { StopwatchDial } from '../components/StopwatchDial'
import { TimerToggleIcon } from '../components/TimerToggleIcon'
import { useAppState } from '../context/AppStateContext'
import { useBossKey } from '../context/BossKeyContext'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { formatCurrency, getPerMinuteRate, isScheduleComplete } from '../lib/salary'
import {
  clearActiveTimer,
  loadActiveTimer,
  loadTodaySessions,
  saveActiveTimer,
  saveLastSession,
  saveTodaySessions
} from '../lib/storage'
import { formatMinutesSeconds } from '../lib/time'

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function TimerPage() {
  const { t, language } = useLanguage()
  const { symbol } = useCurrency()
  const { salaryConfig, timerStartAt, stopTimer, setLastSession } = useAppState()
  const { isActive: bossKeyActive } = useBossKey()
  const [now, setNow] = useState(() => Date.now())
  // Restore from localStorage so long sessions / tab sleep / navigation don't zero the clock.
  // If AppState has a fresh auto-start (from Setup / Result), ignore the old snapshot.
  const [accumulatedMs, setAccumulatedMs] = useState(() => {
    if (timerStartAt !== null) return 0
    return loadActiveTimer()?.accumulatedMs ?? 0
  })
  const [activeSince, setActiveSince] = useState<number | null>(() => {
    if (timerStartAt !== null) return timerStartAt
    return loadActiveTimer()?.activeSince ?? null
  })
  const [sessionStartAt, setSessionStartAt] = useState<number | null>(() => {
    if (timerStartAt !== null) return timerStartAt
    return loadActiveTimer()?.sessionStartAt ?? null
  })
  const navigate = useNavigate()
  const activeSinceRef = useRef(activeSince)
  const wasRunningBeforeBossRef = useRef(false)
  activeSinceRef.current = activeSince

  const canStart = salaryConfig.amount > 0 && isScheduleComplete(salaryConfig)
  const isRunning = activeSince !== null

  // Consume global auto-start once (from Setup / Result), then clear so pause works.
  useEffect(() => {
    if (timerStartAt === null) return
    setSessionStartAt(timerStartAt)
    setActiveSince(timerStartAt)
    setAccumulatedMs(0)
    saveActiveTimer({
      sessionStartAt: timerStartAt,
      accumulatedMs: 0,
      activeSince: timerStartAt
    })
    stopTimer()
  }, [timerStartAt, stopTimer])

  // Keep snapshot in sync (pause / resume / tick segment changes)
  useEffect(() => {
    if (sessionStartAt === null && accumulatedMs <= 0 && activeSince === null) {
      clearActiveTimer()
      return
    }
    if (sessionStartAt === null) return
    saveActiveTimer({
      sessionStartAt,
      accumulatedMs,
      activeSince
    })
  }, [sessionStartAt, accumulatedMs, activeSince])

  // 500ms tick while visible; clear interval when tab/app is hidden (wall-clock still accurate)
  useEffect(() => {
    if (!isRunning) return

    let timerId = 0

    const start = () => {
      timerId = window.setInterval(() => setNow(Date.now()), 500)
    }
    const stop = () => {
      if (timerId) window.clearInterval(timerId)
      timerId = 0
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        stop()
      } else {
        setNow(Date.now())
        stop()
        start()
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    if (document.visibilityState === 'visible') {
      start()
    }

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [isRunning])

  // Boss key: pause while overlay is up; resume only if timer was running at activation
  useEffect(() => {
    if (bossKeyActive) {
      const since = activeSinceRef.current
      if (since !== null) {
        wasRunningBeforeBossRef.current = true
        setAccumulatedMs((acc) => acc + Math.max(0, Date.now() - since))
        setActiveSince(null)
      } else {
        wasRunningBeforeBossRef.current = false
      }
      return
    }

    if (wasRunningBeforeBossRef.current) {
      wasRunningBeforeBossRef.current = false
      setActiveSince(Date.now())
    }
  }, [bossKeyActive])

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
      id: createSessionId(),
      startAt,
      endAt,
      elapsedMs: finalElapsedMs,
      stolenAmount: finalStolenAmount
    }

    const existing = loadTodaySessions()
    saveTodaySessions([session, ...existing])
    saveLastSession(session)
    setLastSession(session)
    clearActiveTimer()
    setAccumulatedMs(0)
    setActiveSince(null)
    setSessionStartAt(null)
    stopTimer()
    navigate('/result')
  }

  return (
    <RoughBox className="page-card timer-page">
      <DoodleMarks />
      <div className="timer-form">
        <div className="page-cat-wrap page-cat-wrap-timer">
          <img className="page-cat" src="/cats/timer-cat.png" alt="" aria-hidden />
          <span className="page-cat-bubble page-cat-bubble-timer">{t('timerCatQuote')}</span>
        </div>
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
          <div className="result-stat result-stat-hero timer-stat-hero">
            {isRunning && stolenAmount > 0 && (
              <span className="page-burst timer-money-burst" aria-hidden>{t('timerMoneyBurst')}</span>
            )}
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
            disabled={!canStart || elapsedMs <= 0}
          >
            {t('endSlacking')}
          </RoughButton>
          {elapsedMs <= 0 && <p className="timer-page-hint timer-page-hint-end">{t('timerEndHint')}</p>}
        </section>
      </div>
    </RoughBox>
  )
}
