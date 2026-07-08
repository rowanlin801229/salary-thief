import { useLanguage } from '../context/LanguageContext'

export function AuthLangSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="auth-lang-switcher">
      <button
        type="button"
        className={language === 'en' ? 'active' : ''}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={language === 'zh' ? 'active' : ''}
        onClick={() => setLanguage('zh')}
      >
        中文
      </button>
    </div>
  )
}
