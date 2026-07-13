import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { yearMonthFromDate } from './storage'

export interface LeaderboardEntry {
  uid: string
  displayName: string
  photoURL: string
  totalMinutes: number
  isCurrentUser: boolean
}

/**
 * 從 Firestore 讀本月排行榜
 * 聚合：掃 users collection → 讀 monthlyStats[month].totalMs → 排序
 */
export async function fetchMonthlyLeaderboard(
  currentUserId?: string
): Promise<LeaderboardEntry[]> {
  try {
    const month = yearMonthFromDate()
    const usersRef = collection(db, 'users')
    const usersSnap = await getDocs(usersRef)

    const rawEntries: Array<{ entry: LeaderboardEntry; totalMs: number }> = []

    for (const userDoc of usersSnap.docs) {
      const userData = userDoc.data()
      const monthlyStats = userData.monthlyStats?.[month]

      if (!monthlyStats?.totalMs || monthlyStats.totalMs <= 0) continue

      const totalMs: number = monthlyStats.totalMs
      const totalMinutes = Math.round(totalMs / 60000)

      rawEntries.push({
        entry: {
          uid: userDoc.id,
          displayName: userData.displayName || 'Unknown',
          photoURL: userData.photoURL || '',
          totalMinutes,
          isCurrentUser: userDoc.id === currentUserId
        },
        totalMs
      })
    }

    // 按 totalMs 排序（避免 rounding 誤差）
    rawEntries.sort((a, b) => b.totalMs - a.totalMs)
    return rawEntries.map((r) => r.entry)
  } catch (error) {
    console.error('[fetchMonthlyLeaderboard] error:', error)
    return []
  }
}
