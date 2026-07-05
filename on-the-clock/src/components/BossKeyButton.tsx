import { createPortal } from 'react-dom'
import { RoughButton } from './RoughButton'
import { useBossKey } from '../context/BossKeyContext'
import { useLanguage } from '../context/LanguageContext'

export function BossKeyButton() {
  const { isActive, toggle } = useBossKey()
  const { t } = useLanguage()

  if (isActive) {
    return null
  }

  return createPortal(
    <div className="boss-key-bar">
      <div className="boss-key-bar-inner">
        <RoughButton
          type="button"
          className="boss-key-button"
          frameClassName="boss-key-button-frame"
          onClick={toggle}
          aria-pressed={false}
          aria-label={t('bossAlert')}
        >
          {t('bossAlert')}
        </RoughButton>
      </div>
    </div>,
    document.body
  )
}
