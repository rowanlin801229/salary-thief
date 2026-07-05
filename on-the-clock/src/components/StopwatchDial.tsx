import { formatMinutesSeconds } from '../lib/time'

const DIAL_CENTER = 98
const RING_RADIUS = 92
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS
/** 每 60 秒跑滿一圈，長時間計時會循環（中心時間仍累加） */
const RING_CYCLE_MS = 60 * 1000

interface StopwatchDialProps {
  elapsedMs: number
  isActive: boolean
  ringCycleMs?: number
  ariaLabel: string
}

export function StopwatchDial({
  elapsedMs,
  isActive,
  ringCycleMs = RING_CYCLE_MS,
  ariaLabel
}: StopwatchDialProps) {
  const progress = (elapsedMs % ringCycleMs) / ringCycleMs
  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - progress)
  const timeText = formatMinutesSeconds(elapsedMs)

  return (
    <div
      className={`stopwatch-dial ${isActive ? 'is-active' : ''}`}
      role="timer"
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 196 196" aria-hidden>
        <circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={RING_RADIUS}
          className="stopwatch-dial-bg"
          fill="#FFFFFF"
        />
        <circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={RING_RADIUS}
          className="stopwatch-dial-track"
          fill="none"
        />
        <circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={RING_RADIUS}
          className="stopwatch-dial-ring"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${DIAL_CENTER} ${DIAL_CENTER})`}
        />
        <text
          x={DIAL_CENTER}
          y={104}
          className="stopwatch-dial-time"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="inherit"
          fontWeight={700}
        >
          {timeText}
        </text>
      </svg>
    </div>
  )
}
