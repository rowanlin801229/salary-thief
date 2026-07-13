import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Language } from '../types'

interface ShareSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  onDownload: () => void
  onCopyText: () => void
  copied: boolean
  language: Language
}

export function ShareSheet({
  isOpen,
  onClose,
  children,
  onDownload,
  onCopyText,
  copied,
  language,
}: ShareSheetProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <div
        className={`share-sheet-overlay${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`share-sheet${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className="share-sheet-handle" aria-hidden />

        <div className="share-sheet-header">
          <span className="share-sheet-title">
            {language === 'zh' ? '分享戰績' : 'Share'}
          </span>
          <button
            type="button"
            className="share-sheet-close"
            onClick={onClose}
            aria-label={language === 'zh' ? '關閉' : 'Close'}
          >
            ✕
          </button>
        </div>

        {/* 預覽縮放只在外層 wrapper，不影響截圖用的 cardRef */}
        <div className="share-sheet-preview">
          <div className="share-sheet-preview-scale">{children}</div>
        </div>

        <div className="share-sheet-actions">
          <button
            type="button"
            className="share-sheet-btn is-primary"
            onClick={onDownload}
          >
            {language === 'zh' ? '下載圖片' : 'Save Image'}
          </button>
          <button type="button" className="share-sheet-btn" onClick={onCopyText}>
            {copied
              ? language === 'zh'
                ? '已複製！'
                : 'Copied!'
              : language === 'zh'
                ? '複製文案'
                : 'Copy text'}
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}
