import { useLanguage } from '../context/LanguageContext'
import type { Language } from '../types'

interface LeaderboardEntry {
  uid: string
  displayName: string
  photoURL: string
  totalMinutes: number
  isCurrentUser: boolean
}

const FAKE_DATA: LeaderboardEntry[] = [
  { uid: '1', displayName: '小明', photoURL: '', totalMinutes: 108, isCurrentUser: false },
  { uid: '2', displayName: '阿花', photoURL: '', totalMinutes: 95, isCurrentUser: false },
  { uid: '3', displayName: '大雄', photoURL: '', totalMinutes: 83, isCurrentUser: false },
  { uid: '4', displayName: 'Rowan', photoURL: '', totalMinutes: 67, isCurrentUser: true },
  { uid: '5', displayName: '靜香', photoURL: '', totalMinutes: 45, isCurrentUser: false },
  { uid: '6', displayName: '技安', photoURL: '', totalMinutes: 32, isCurrentUser: false },
]

function formatLeaderboardTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours <= 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}

function formatLeaderboardMonth(language: Language, date = new Date()): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  if (language === 'zh') return `${year}年${month}月`
  const monthName = date.toLocaleString('en-US', { month: 'long' })
  return `${monthName} ${year}`
}

function Avatar({
  entry,
  className = '',
}: {
  entry: LeaderboardEntry
  className?: string
}) {
  const initial = entry.displayName.slice(0, 1).toUpperCase()
  const classes = [
    'leaderboard-avatar',
    entry.isCurrentUser ? 'is-current-user' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (entry.photoURL) {
    return <img className={classes} src={entry.photoURL} alt="" />
  }

  return <span className={`${classes} leaderboard-avatar-fallback`}>{initial}</span>
}

export function LeaderboardPage() {
  const { t, language } = useLanguage()

  const ranked = [...FAKE_DATA].sort((a, b) => b.totalMinutes - a.totalMinutes)
  const topThree = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  const first = topThree[0]
  const second = topThree[1]
  const third = topThree[2]

  const podiumSlots = [
    { place: 2, entry: second, heightClass: 'is-second' },
    { place: 1, entry: first, heightClass: 'is-first' },
    { place: 3, entry: third, heightClass: 'is-third' },
  ]

  return (
    <main className="page-card leaderboard-page">
      <header className="leaderboard-header">
        <h1 className="leaderboard-title">{t('leaderboardTitle')}</h1>
        <p className="leaderboard-month">{formatLeaderboardMonth(language)}</p>
      </header>

      {ranked.length === 0 ? (
        <p className="leaderboard-empty">{t('leaderboardEmpty')}</p>
      ) : (
        <>
          <section className="leaderboard-podium" aria-label={t('leaderboardTitle')}>
            {podiumSlots.map(({ place, entry, heightClass }) => {
              if (!entry) return null
              return (
                <div key={entry.uid} className={`leaderboard-podium-slot ${heightClass}`}>
                  <Avatar entry={entry} />
                  <p className="leaderboard-podium-name">
                    {entry.displayName}
                    {entry.isCurrentUser ? ` ${t('leaderboardYou')}` : ''}
                  </p>
                  <p className="leaderboard-podium-time">{formatLeaderboardTime(entry.totalMinutes)}</p>
                  <div className={`leaderboard-step ${heightClass}`} aria-hidden="true">
                    <span className="leaderboard-step-rank">{place}</span>
                  </div>
                </div>
              )
            })}
          </section>

          <div className="leaderboard-divider" />

          <ol className="leaderboard-list">
            {rest.map((entry, index) => {
              const rank = index + 4
              return (
                <li
                  key={entry.uid}
                  className={`leaderboard-row${entry.isCurrentUser ? ' is-current-user' : ''}`}
                >
                  <span className="leaderboard-rank">{rank}</span>
                  <Avatar entry={entry} />
                  <span className="leaderboard-name">
                    {entry.displayName}
                    {entry.isCurrentUser ? ` ${t('leaderboardYou')}` : ''}
                  </span>
                  <span className="leaderboard-time">{formatLeaderboardTime(entry.totalMinutes)}</span>
                </li>
              )
            })}
          </ol>
        </>
      )}
    </main>
  )
}
