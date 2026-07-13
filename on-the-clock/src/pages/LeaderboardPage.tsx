import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { backfillLocalStorageSessions } from '../lib/firestore-session'
import { fetchMonthlyLeaderboard, type LeaderboardEntry } from '../lib/leaderboard'
import { loadMonthlyHistory, yearMonthFromDate } from '../lib/storage'
import type { Language } from '../types'

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
  const { user } = useAuth()

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 進頁：保底 backfill → 讀排行榜（await 順序，禁止平行 race）
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        setError(null)

        if (user) {
          const currentMonth = yearMonthFromDate()
          const monthlyLocal = loadMonthlyHistory(currentMonth)
          if (monthlyLocal.length > 0) {
            await backfillLocalStorageSessions(user.uid, monthlyLocal)
          }
        }

        const data = await fetchMonthlyLeaderboard(user?.uid)
        if (isMounted) setLeaderboard(data)
      } catch (err) {
        console.error('[LeaderboardPage] init error:', err)
        if (isMounted) setError(t('leaderboardError') || 'Failed to load leaderboard')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    init()
    return () => {
      isMounted = false
    }
  }, [user, t])

  // 5 分鐘自動刷新（不 setLoading，不閃）
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchMonthlyLeaderboard(user?.uid)
        setLeaderboard(data)
      } catch (err) {
        console.error('[LeaderboardPage] Auto-refresh error:', err)
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [user?.uid])

  const ranked = leaderboard
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

      {loading && (
        <p className="leaderboard-loading">{t('leaderboardLoading') || 'Loading...'}</p>
      )}

      {error && !loading && <p className="leaderboard-error">{error}</p>}

      {!loading && !error && ranked.length === 0 && (
        <p className="leaderboard-empty">{t('leaderboardEmpty') || 'No one here yet'}</p>
      )}

      {!loading && !error && ranked.length > 0 && (
        <>
          <section className="leaderboard-podium" aria-label={t('leaderboardTitle')}>
            {podiumSlots.map(({ place, entry, heightClass }) => (
              <div key={place} className={`leaderboard-podium-slot ${heightClass}`}>
                {entry ? (
                  <>
                    <Avatar entry={entry} />
                    <p className="leaderboard-podium-name">
                      {entry.displayName}
                      {entry.isCurrentUser ? ` ${t('leaderboardYou')}` : ''}
                    </p>
                    <p className="leaderboard-podium-time">{formatLeaderboardTime(entry.totalMinutes)}</p>
                  </>
                ) : (
                  <>
                    <span className="leaderboard-avatar leaderboard-avatar-empty" aria-hidden="true" />
                    <p className="leaderboard-podium-name leaderboard-empty-slot">—</p>
                    <p className="leaderboard-podium-time leaderboard-empty-slot">—</p>
                  </>
                )}
                <div className={`leaderboard-step ${heightClass}`} aria-hidden="true">
                  <span className="leaderboard-step-rank">{place}</span>
                </div>
              </div>
            ))}
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
