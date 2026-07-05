import { useLanguage } from '../context/LanguageContext'
import { NavMenu } from './NavMenu'
import { RoughButton } from './RoughButton'

export function Header() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="app-header">
      <div className="app-header-brand">
        <div className="app-logo-placeholder" aria-hidden />
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
        <NavMenu />
      </div>
    </header>
  )
}
