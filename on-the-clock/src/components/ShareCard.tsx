import { formatCurrency } from '../lib/salary'
import { formatMinutesSeconds } from '../lib/time'
import type { Language } from '../types'

interface ShareCardProps {
  amount: number
  elapsedMs: number
  symbol: string
  language: Language
}

export function ShareCard({ amount, elapsedMs, symbol, language }: ShareCardProps) {
  const appName = language === 'zh' ? '薪水小偷' : 'On The Clock'
  const tagline =
    language === 'zh'
      ? '認真工作的人，是不會看到這張圖的。'
      : 'Hard workers never see this card.'

  return (
    <div className="share-card" style={{ width: 375, height: 520 }}>
      {/* App 名：中文用 sans-serif，英文用 Caveat */}
      <p
        className="share-card-app-name"
        style={{ fontFamily: language === 'zh' ? 'sans-serif' : 'Caveat, cursive' }}
      >
        {appName}
      </p>

      <img className="share-card-cat" src="/cats/result-cat.png" alt="" aria-hidden />

      <p className="share-card-amount">{formatCurrency(symbol, amount)}</p>
      <p className="share-card-label">{language === 'zh' ? '偷到了！' : 'Stolen!'}</p>

      <p className="share-card-time">{formatMinutesSeconds(elapsedMs)}</p>

      <p className="share-card-tagline">{tagline}</p>
    </div>
  )
}
