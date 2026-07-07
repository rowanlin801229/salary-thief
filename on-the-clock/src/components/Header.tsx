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
        <span className="app-logo" aria-hidden>
          <ClockLogo className="app-logo-clock" />
        </span>
        <h1>{t('appTitle')}</h1>
      </div>
      <div className="app-header-actions">
        <div className="lang-toggle">
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
