import { createPortal } from 'react-dom'
import { RoughButton } from './RoughButton'
import { useBossKey } from '../context/BossKeyContext'
import { useLanguage } from '../context/LanguageContext'

export function BossKeyButton() {
  const { isActive, toggle } = useBossKey()
  const { t } = useLanguage()
  const label = isActive ? t('bossAllClear') : t('bossAlert')

  return createPortal(
    <div className={`boss-key-bar${isActive ? ' is-active' : ''}`}>
      <div className="boss-key-bar-inner">
        <RoughButton
          type="button"
          className="boss-key-button"
          frameClassName="boss-key-button-frame"
          onClick={toggle}
          aria-pressed={isActive}
          aria-label={label}
        >
          {label}
        </RoughButton>
      </div>
    </div>,
    document.body
  )
}
