import { doc, getDoc, increment, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import type { SessionRecord } from '../types'
import { db } from './firebase'
import { yearMonthFromDate } from './storage'

/**
 * 存 session 到 Firestore + 累加月度統計
 * 冪等性：per-session ID，可安全重複呼叫（覆蓋時不重複累加）
 * 路徑：users/{uid}/sessions/{sessionId}
 * 累加：users/{uid}.monthlyStats[YYYY-MM].totalMs
 */
export async function saveSessionToFirebase(
  userId: string,
  session: SessionRecord
): Promise<void> {
  const sessionId = String(session.startAt)
  const sessionRef = doc(db, 'users', userId, 'sessions', sessionId)
  const userRef = doc(db, 'users', userId)
  const month = yearMonthFromDate(new Date(session.startAt))

  const sessionData = {
    startAt: session.startAt,
    endAt: session.endAt,
    elapsedMs: session.elapsedMs,
    stolenAmount: session.stolenAmount,
    timestamp: Timestamp.now()
  }

  try {
    const existingDoc = await getDoc(sessionRef)
    const isNewSession = !existingDoc.exists()

    await setDoc(sessionRef, sessionData, { merge: true })

    if (isNewSession) {
      await updateDoc(userRef, {
        [`monthlyStats.${month}.totalMs`]: increment(session.elapsedMs),
        [`monthlyStats.${month}.sessionsCount`]: increment(1),
        [`monthlyStats.${month}.lastUpdated`]: Timestamp.now()
      })
    }
  } catch (error) {
    console.error('[saveSessionToFirebase] error:', error)
    throw error
  }
}

/**
 * Backfill 訪客的 localStorage sessions → Firebase
 * 冪等性：per-session ID，可安全重複呼叫
 * 呼叫點：1. SetupProfilePage 完成時（主路徑） 2. LeaderboardPage 進頁時（保底）
 */
export async function backfillLocalStorageSessions(
  userId: string,
  monthlyLocalSessions: SessionRecord[]
): Promise<void> {
  if (!monthlyLocalSessions || monthlyLocalSessions.length === 0) return

  try {
    for (const session of monthlyLocalSessions) {
      await saveSessionToFirebase(userId, session)
    }
  } catch (error) {
    console.error('[backfillLocalStorageSessions] error:', error)
    // 失敗不擋用戶流程
  }
}
