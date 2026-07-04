interface TimerToggleIconProps {
  isRunning: boolean
}

export function TimerToggleIcon({ isRunning }: TimerToggleIconProps) {
  if (isRunning) {
    return (
      <svg className="timer-toggle-icon" viewBox="0 0 48 48" aria-hidden>
        <rect x="14" y="12" width="7" height="24" rx="1.5" fill="currentColor" />
        <rect x="27" y="12" width="7" height="24" rx="1.5" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg className="timer-toggle-icon" viewBox="0 0 48 48" aria-hidden>
      <path
        d="M18 12 L36 24 L18 36 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
