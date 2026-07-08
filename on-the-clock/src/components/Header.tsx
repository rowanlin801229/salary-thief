import { useLanguage } from '../context/LanguageContext'
import { ClockLogo } from './ClockLogo'
import { NavMenu } from './NavMenu'
import { UserMenu } from './UserMenu'
import { RoughButton } from './RoughButton'

export function Header() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="app-header">
      <div className="app-header-brand">
        <span className="app-logo" aria-label={t('appTitle')}>
          <ClockLogo className="app-logo-clock" />
        </span>
      </div>

      <div className="app-header-actions">
        <div className="lang-toggle app-lang-switcher" role="group" aria-label="Language">
          <RoughButton type="button" active={language === 'en'} onClick={() => setLanguage('en')}>
            EN
          </RoughButton>
          <RoughButton type="button" active={language === 'zh'} onClick={() => setLanguage('zh')}>
            中文
          </RoughButton>
        </div>

        <UserMenu />
        <NavMenu />
      </div>
    </header>
  )
}
