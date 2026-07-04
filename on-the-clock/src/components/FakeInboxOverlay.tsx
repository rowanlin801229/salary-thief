import { useLanguage } from '../context/LanguageContext'
import { getFakeEmails } from '../lib/fakeInbox'

export function FakeInboxOverlay() {
  const { language } = useLanguage()
  const items = getFakeEmails(language)
  const folders =
    language === 'zh'
      ? ['收件匣', '寄件備份', '草稿', '已刪除項目']
      : ['Inbox', 'Sent Items', 'Drafts', 'Deleted Items']

  return (
    <div className="boss-inbox" role="presentation">
      <header className="boss-inbox-topbar">
        <div className="boss-inbox-brand">
          <span className="boss-inbox-logo" aria-hidden>
            M
          </span>
          <span className="boss-inbox-app-name">Mail</span>
        </div>
        <div className="boss-inbox-search">
          <input
            type="search"
            readOnly
            value=""
            placeholder={language === 'zh' ? '搜尋郵件' : 'Search mail'}
            aria-label={language === 'zh' ? '搜尋郵件' : 'Search mail'}
          />
        </div>
      </header>

      <div className="boss-inbox-body">
        <aside className="boss-inbox-sidebar">
          <button type="button" className="boss-inbox-compose">
            {language === 'zh' ? '新增郵件' : 'New mail'}
          </button>
          <ul className="boss-inbox-folders">
            {folders.map((folder, index) => (
              <li key={folder}>
                <button type="button" className={index === 0 ? 'is-active' : ''}>
                  {folder}
                  {index === 0 ? <span className="boss-inbox-count">6</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="boss-inbox-main">
          <div className="boss-inbox-toolbar">
            <span>{language === 'zh' ? '收件匣' : 'Inbox'}</span>
            <span className="boss-inbox-toolbar-meta">
              {language === 'zh' ? '6 封郵件' : '6 messages'}
            </span>
          </div>
          <ul className="boss-inbox-list">
            {items.map((email) => (
              <li key={email.id} className={email.unread ? 'is-unread' : ''}>
                <button type="button" className="boss-inbox-row">
                  <span className="boss-inbox-sender">{email.sender}</span>
                  <span className="boss-inbox-subject">{email.subject}</span>
                  <span className="boss-inbox-preview">{email.preview}</span>
                  <span className="boss-inbox-time">{email.time}</span>
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  )
}
