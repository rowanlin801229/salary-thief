import { useLanguage } from '../context/LanguageContext'
import { labelColors } from '../i18n/translations'
import { NavMenu } from './NavMenu'
import { RoughButton } from './RoughButton'

export function Header() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="app-header">
      <h1 style={{ color: labelColors[0] }}>{t('appTitle')}</h1>
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
