import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CurrencySelectorButton } from '../components/CurrencySelectorButton'
import { DoodleMarks } from '../components/DoodleMarks'
import { RoughBox } from '../components/RoughBox'
import { RoughButton } from '../components/RoughButton'
import { RoughInput } from '../components/RoughInput'
import { useAppState } from '../context/AppStateContext'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { formatCurrency, getPerMinuteRate, isScheduleComplete } from '../lib/salary'
import type { Currency } from '../types'

export function SetupPage() {
  const { t, language } = useLanguage()
  const { currency, setCurrency, symbol } = useCurrency()
  const { salaryConfig, setSalaryConfig, startTimer } = useAppState()
  const navigate = useNavigate()
  const rate = useMemo(() => getPerMinuteRate(salaryConfig), [salaryConfig])
  const canStart = salaryConfig.amount > 0 && isScheduleComplete(salaryConfig)
  const [showStartHint, setShowStartHint] = useState(false)
  const startWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (salaryConfig.currency !== currency) {
      setSalaryConfig({ ...salaryConfig, currency })
    }
    // Keep salary config currency aligned with persisted currency on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (canStart) setShowStartHint(false)
  }, [canStart])

  useEffect(() => {
    if (!showStartHint) return
    const onPointerDown = (event: PointerEvent) => {
      if (startWrapRef.current?.contains(event.target as Node)) return
      setShowStartHint(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [showStartHint])

  const handleCurrencyChange = (next: Currency) => {
    setCurrency(next)
    setSalaryConfig({ ...salaryConfig, currency: next })
  }

  const startHint = useMemo(() => {
    if (canStart) return null
    if (salaryConfig.amount <= 0) {
      return salaryConfig.mode === 'hourly' ? t('hourlyRequired') : t('salaryRequired')
    }
    return t('scheduleRequired')
  }, [canStart, salaryConfig.amount, salaryConfig.mode, t])

  const handleStart = () => {
    if (!canStart) return
    startTimer()
    navigate('/timer')
  }

  const handleDisabledStartClick = () => {
    if (!canStart) setShowStartHint(true)
  }

  return (
    <RoughBox className="page-card setup-doodle-card">
      <DoodleMarks />

      <div className="setup-hero">
        <h1 className="setup-hero-title">{t('setupHeroTitle')}</h1>
        <div className="setup-hero-cat-wrap">
          <img className="setup-hero-cat" src="/cats/hero-cat.png" alt="" aria-hidden />
          <span className="setup-cat-bubble">{t('setupCatQuote')}</span>
        </div>
        <p className="setup-intro">{t('setupIntro')}</p>
      </div>

      <div className="setup-steps">
        <p className="setup-steps-title">{t('setupStepsTitle')}</p>
        <ol className="setup-howto">
          <li>{t('setupStep1')}</li>
          <li>{t('setupStep2')}</li>
          <li>{t('setupStep3')}</li>
          <li>{t('setupStep4')}</li>
        </ol>
      </div>

      <div className="setup-form">
        <section className="setup-group" aria-labelledby="setup-salary-heading">
          <div className="setup-field">
            <label className="field-label" id="setup-salary-heading" htmlFor="salary-amount">
              {t('salary')}
            </label>
            <div className="setup-field-stack">
              <div className="mode-row">
                <RoughButton
                  type="button"
                  active={salaryConfig.mode === 'hourly'}
                  onClick={() => setSalaryConfig({ ...salaryConfig, mode: 'hourly' })}
                >
                  {t('hourly')}
                </RoughButton>
                <RoughButton
                  type="button"
                  active={salaryConfig.mode === 'monthly'}
                  onClick={() => setSalaryConfig({ ...salaryConfig, mode: 'monthly' })}
                >
                  {t('monthly')}
                </RoughButton>
                <RoughButton
                  type="button"
                  active={salaryConfig.mode === 'annual'}
                  onClick={() => setSalaryConfig({ ...salaryConfig, mode: 'annual' })}
                >
                  {t('annual')}
                </RoughButton>
              </div>
              <div className="setup-field-input-group">
                <span className="setup-input-arrow" aria-hidden>
                  <span className="setup-input-arrow-text">{t('setupInputArrow')}</span>
                  <span className="setup-input-arrow-mark">↙</span>
                </span>
                <RoughInput
                  id="salary-amount"
                  type="number"
                  min="0"
                  value={salaryConfig.amount || ''}
                  onChange={(event) =>
                    setSalaryConfig({ ...salaryConfig, amount: Math.max(0, Number(event.target.value) || 0) })
                  }
                  placeholder={
                    salaryConfig.mode === 'hourly'
                      ? `${symbol}0/${language === 'zh' ? '時' : 'hr'}`
                      : `${symbol}0`
                  }
                />
                <CurrencySelectorButton
                  value={currency}
                  onChange={handleCurrencyChange}
                />
              </div>
            </div>
          </div>
        </section>

        {salaryConfig.mode !== 'hourly' && (
          <section className="setup-group" aria-labelledby="setup-schedule-heading">
            <p className="setup-group-title" id="setup-schedule-heading">
              {t('monthlyScheduleTitle')}
            </p>
            {salaryConfig.mode === 'annual' ? (
              <div className="setup-field-row">
                <div className="setup-field">
                  <label className="field-label setup-field-label" htmlFor="hours-per-week">
                    {t('hoursPerWeek')}
                  </label>
                  <RoughInput
                    id="hours-per-week"
                    type="number"
                    min="1"
                    step="0.5"
                    value={salaryConfig.hoursPerWeek}
                    onChange={(event) =>
                      setSalaryConfig({
                        ...salaryConfig,
                        hoursPerWeek: Math.max(1, Number(event.target.value) || 1)
                      })
                    }
                  />
                </div>
                <div className="setup-field">
                  <label className="field-label setup-field-label" htmlFor="weeks-per-year">
                    {t('weeksPerYear')}
                  </label>
                  <RoughInput
                    id="weeks-per-year"
                    type="number"
                    min="1"
                    max="52"
                    value={salaryConfig.weeksPerYear}
                    onChange={(event) =>
                      setSalaryConfig({
                        ...salaryConfig,
                        weeksPerYear: Math.min(52, Math.max(1, Number(event.target.value) || 1))
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="setup-field-row">
                <div className="setup-field">
                  <label className="field-label setup-field-label" htmlFor="days-per-month">
                    {t('daysPerMonth')}
                  </label>
                  <RoughInput
                    id="days-per-month"
                    type="number"
                    min="1"
                    value={salaryConfig.daysPerMonth}
                    onChange={(event) =>
                      setSalaryConfig({
                        ...salaryConfig,
                        daysPerMonth: Math.max(1, Number(event.target.value) || 1)
                      })
                    }
                  />
                </div>
                <div className="setup-field">
                  <label className="field-label setup-field-label" htmlFor="hours-per-day">
                    {t('hoursPerDay')}
                  </label>
                  <RoughInput
                    id="hours-per-day"
                    type="number"
                    min="1"
                    step="0.5"
                    value={salaryConfig.hoursPerDay}
                    onChange={(event) =>
                      setSalaryConfig({
                        ...salaryConfig,
                        hoursPerDay: Math.max(1, Number(event.target.value) || 1)
                      })
                    }
                  />
                </div>
              </div>
            )}
          </section>
        )}

        <section className="setup-group setup-group-result">
          <div className="result-stat result-stat-hero">
            <p className="result-stat-label">{t('ratePerMinute')}</p>
            <p className="result-stat-value rate-value">{formatCurrency(symbol, rate)}</p>
          </div>
          <p className="setup-note purple-note">
            {language === 'zh' ? '數字越高，賺越快' : 'Bigger number, faster profit'}
          </p>
        </section>

        <section className="setup-group setup-group-action">
          <div
            ref={startWrapRef}
            className="start-button-wrap"
            onClick={handleDisabledStartClick}
          >
            {canStart && <span className="start-burst" aria-hidden>{t('setupStartBurst')}</span>}
            <RoughButton
              type="button"
              primary
              className="start-button"
              frameClassName="start-button-frame"
              onClick={handleStart}
              disabled={!canStart}
            >
              {t('startTimer')}
            </RoughButton>
          </div>
          {showStartHint && startHint && (
            <p className="setup-start-hint">{startHint}</p>
          )}
        </section>
      </div>
    </RoughBox>
  )
}
