import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { CURRENCY_SYMBOLS } from '../context/CurrencyContext'
import { RoughFrame } from './RoughFrame'
import type { Currency } from '../types'

const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'TWD', label: CURRENCY_SYMBOLS.TWD },
  { value: 'USD', label: CURRENCY_SYMBOLS.USD },
  { value: 'GBP', label: CURRENCY_SYMBOLS.GBP }
]

interface CurrencySelectorButtonProps {
  value: Currency
  onChange: (currency: Currency) => void
  disabled?: boolean
}

export function CurrencySelectorButton({ value, onChange, disabled }: CurrencySelectorButtonProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(() =>
    Math.max(0, CURRENCY_OPTIONS.findIndex((opt) => opt.value === value))
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  const currentLabel = CURRENCY_SYMBOLS[value]

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    optionRefs.current[highlightIndex]?.focus()
  }, [isOpen, highlightIndex])

  const selectOption = (currency: Currency) => {
    onChange(currency)
    setIsOpen(false)
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (event.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isOpen) {
        selectOption(CURRENCY_OPTIONS[highlightIndex].value)
      } else {
        const index = CURRENCY_OPTIONS.findIndex((opt) => opt.value === value)
        setHighlightIndex(index >= 0 ? index : 0)
        setIsOpen(true)
      }
      return
    }

    if (!isOpen) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightIndex((index) => (index + 1) % CURRENCY_OPTIONS.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightIndex((index) => (index - 1 + CURRENCY_OPTIONS.length) % CURRENCY_OPTIONS.length)
    }
  }

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightIndex((index + 1) % CURRENCY_OPTIONS.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightIndex((index - 1 + CURRENCY_OPTIONS.length) % CURRENCY_OPTIONS.length)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOption(CURRENCY_OPTIONS[index].value)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
    }
  }

  return (
    <div className="currency-selector-button-container" ref={containerRef}>
      <RoughFrame
        className={`rough-control rough-button-frame currency-selector-button-frame${isOpen ? ' is-open' : ''}`}
        contentClassName="rough-control-content currency-selector-button-content"
        stroke="#111"
        fill="transparent"
        cornerRadius={16}
      >
        <button
          type="button"
          className="currency-selector-button rough-button-native"
          onClick={() => {
            if (disabled) return
            if (!isOpen) {
              const index = CURRENCY_OPTIONS.findIndex((opt) => opt.value === value)
              setHighlightIndex(index >= 0 ? index : 0)
            }
            setIsOpen((open) => !open)
          }}
          onKeyDown={handleTriggerKeyDown}
          disabled={disabled}
          aria-label={t('selectCurrency')}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{currentLabel}</span>
          <span className="currency-selector-chevron" aria-hidden>
            ▼
          </span>
        </button>
      </RoughFrame>

      {isOpen && (
        <div className="currency-selector-menu" ref={menuRef} role="listbox" aria-label={t('selectCurrency')}>
          {CURRENCY_OPTIONS.map((option, index) => (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node
              }}
              type="button"
              className={`currency-selector-option${value === option.value ? ' is-active' : ''}${highlightIndex === index ? ' is-highlighted' : ''}`}
              onClick={() => selectOption(option.value)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              onMouseEnter={() => setHighlightIndex(index)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
