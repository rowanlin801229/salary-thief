import { createPortal } from 'react-dom'
import { useBossKey } from '../context/BossKeyContext'
import { useLanguage } from '../context/LanguageContext'
import { getFakeEmails } from '../lib/fakeInbox'

function OutlookLogo() {
  return (
    <svg className="outlook-logo" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22 6.5v11a1.5 1.5 0 0 1-1.5 1.5H14l-3.2 2.4A1 1 0 0 1 9 20.5v-2H3.5A1.5 1.5 0 0 1 2 17V7a1.5 1.5 0 0 1 1.5-1.5H9V3.5a1 1 0 0 1 1.6-.8L13.8 5H20.5A1.5 1.5 0 0 1 22 6.5Z"
      />
    </svg>
  )
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return <span className="outlook-avatar-circle">{initials || '?'}</span>
}

export function FakeInboxOverlay() {
  const { language, t } = useLanguage()
  const { deactivate } = useBossKey()
  const items = getFakeEmails(language)
  const folders =
    language === 'zh'
      ? [
          { name: '收件匣', count: 6, active: true },
          { name: '已傳送郵件', count: null, active: false },
          { name: '草稿', count: null, active: false },
          { name: '刪除的郵件', count: null, active: false },
          { name: '垃圾郵件', count: null, active: false }
        ]
      : [
          { name: 'Inbox', count: 6, active: true },
          { name: 'Sent Items', count: null, active: false },
          { name: 'Drafts', count: null, active: false },
          { name: 'Deleted Items', count: null, active: false },
          { name: 'Junk Email', count: null, active: false }
        ]

  const copy =
    language === 'zh'
      ? {
          search: '搜尋',
          newMail: '新郵件',
          home: '常用',
          view: '檢視',
          help: '說明',
          focused: '焦點',
          other: '其他',
          inbox: '收件匣',
          messages: '6 封郵件',
          filter: '篩選',
          sort: '排序',
          byDate: '日期'
        }
      : {
          search: 'Search',
          newMail: 'New mail',
          home: 'Home',
          view: 'View',
          help: 'Help',
          focused: 'Focused',
          other: 'Other',
          inbox: 'Inbox',
          messages: '6 messages',
          filter: 'Filter',
          sort: 'Sort',
          byDate: 'Date'
        }

  return createPortal(
    <div className="boss-inbox outlook-shell" role="presentation">
      <header className="outlook-header">
        <button type="button" className="outlook-waffle" aria-hidden tabIndex={-1}>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </button>

        <div className="outlook-header-brand">
          <OutlookLogo />
          <span className="outlook-header-title">Outlook</span>
        </div>

        <div className="outlook-header-search">
          <svg viewBox="0 0 16 16" aria-hidden>
            <path
              fill="currentColor"
              d="M10.5 9.5h-.79l-.28-.27a3.5 3.5 0 1 0-.71.71l.27.28v.79l3.25 3.26.98-.98L10.5 9.5Zm-2 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
            />
          </svg>
          <input type="search" readOnly value="" placeholder={copy.search} aria-hidden tabIndex={-1} />
        </div>

        <div className="outlook-header-actions">
          <button type="button" className="outlook-icon-btn" aria-hidden tabIndex={-1}>
            <svg viewBox="0 0 20 20" aria-hidden>
              <path
                fill="currentColor"
                d="M10 2a6 6 0 0 0-4.47 10.03l-.72.72a.75.75 0 1 0 1.06 1.06l.72-.72A6 6 0 1 0 10 2Zm0 10.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"
              />
            </svg>
          </button>
          <button type="button" className="outlook-icon-btn" aria-hidden tabIndex={-1}>
            <svg viewBox="0 0 20 20" aria-hidden>
              <path
                fill="currentColor"
                d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4.5a.75.75 0 0 0-1.5 0v3.19l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2-2a.75.75 0 0 0 .22-.53V6.5Z"
              />
            </svg>
          </button>
          <span className="outlook-profile-avatar" aria-hidden>
            R
          </span>
        </div>
      </header>

      <div className="outlook-command-bar">
        <nav className="outlook-ribbon-tabs" aria-hidden>
          <button type="button" className="is-active">
            {copy.home}
          </button>
          <button type="button">{copy.view}</button>
          <button type="button">{copy.help}</button>
        </nav>

        <div className="outlook-command-actions">
          <button type="button" className="outlook-btn-primary outlook-btn-decoy" tabIndex={-1}>
            {copy.newMail}
          </button>
          <div className="outlook-command-divider" aria-hidden />
          <button type="button" className="outlook-icon-btn outlook-icon-btn--ribbon" aria-hidden tabIndex={-1}>
            <svg viewBox="0 0 20 20" aria-hidden>
              <path fill="currentColor" d="M4 5.5h12v1.5H4V5.5Zm0 4h12v1.5H4V9.5Zm0 4h8v1.5H4v-1.5Z" />
            </svg>
          </button>
          <button type="button" className="outlook-icon-btn outlook-icon-btn--ribbon" aria-hidden tabIndex={-1}>
            <svg viewBox="0 0 20 20" aria-hidden>
              <path
                fill="currentColor"
                d="M10 3.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 1.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
              />
            </svg>
          </button>
          <button type="button" className="outlook-btn-boss-clear" onClick={deactivate}>
            {t('bossAllClear')}
          </button>
        </div>
      </div>

      <div className="outlook-body">
        <aside className="outlook-folders">
          <ul className="outlook-folder-list">
            {folders.map((folder) => (
              <li key={folder.name}>
                <button
                  type="button"
                  className={`outlook-folder-item${folder.active ? ' is-active' : ''}`}
                  tabIndex={-1}
                >
                  <svg className="outlook-folder-icon" viewBox="0 0 20 20" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M3 5.5A1.5 1.5 0 0 1 4.5 4h4.38l1.12 1.5H15.5A1.5 1.5 0 0 1 17 7v8.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5V5.5Z"
                    />
                  </svg>
                  <span className="outlook-folder-name">{folder.name}</span>
                  {folder.count != null ? (
                    <span className="outlook-folder-count">{folder.count}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="outlook-mail-pane">
          <div className="outlook-list-toolbar">
            <div className="outlook-inbox-tabs">
              <button type="button" className="is-active" tabIndex={-1}>
                {copy.focused}
              </button>
              <button type="button" tabIndex={-1}>
                {copy.other}
              </button>
            </div>
            <div className="outlook-list-meta">
              <span>{copy.inbox}</span>
              <span className="outlook-list-meta-sep">·</span>
              <span>{copy.messages}</span>
            </div>
            <div className="outlook-list-actions">
              <button type="button" tabIndex={-1}>
                {copy.filter}
              </button>
              <button type="button" tabIndex={-1}>
                {copy.sort}: {copy.byDate}
              </button>
            </div>
          </div>

          <ul className="outlook-mail-list">
            {items.map((email) => (
              <li key={email.id} className={email.unread ? 'is-unread' : ''}>
                <button type="button" className="outlook-mail-row" tabIndex={-1}>
                  <span className="outlook-mail-checkbox" aria-hidden />
                  <InitialsAvatar name={email.sender} />
                  <span className="outlook-mail-content">
                    <span className="outlook-mail-topline">
                      <span className="outlook-mail-sender">{email.sender}</span>
                      <span className="outlook-mail-subject">{email.subject}</span>
                      <span className="outlook-mail-dash"> - </span>
                      <span className="outlook-mail-preview">{email.preview}</span>
                    </span>
                  </span>
                  <span className="outlook-mail-time">{email.time}</span>
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>,
    document.body
  )
}
