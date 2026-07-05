interface ClockLogoProps {
  className?: string
}

/**
 * Hand-drawn doodle clock used as the app logo.
 * Uses currentColor so it adapts to light/dark theme.
 */
export function ClockLogo({ className }: ClockLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {/* wobbly hand-drawn clock face */}
      <path d="M24 5.5c10.4-.4 18.7 8.2 18.4 18.7C42.1 34.4 34 42.4 23.6 42 13.4 41.6 5.4 33.2 5.8 22.9 6.2 13 14 5.8 24 5.5Z" />
      {/* little top knob */}
      <path d="M21.5 4.2c1.7-.9 3.6-.9 5.2 0" />
      <path d="M24 5.4V3" />
      {/* hour + minute hands (slowly rotating) */}
      <g className="clock-hand clock-hand-hour" style={{ transformOrigin: '24px 24px' }}>
        <path d="M24 24 23.4 13.5" />
      </g>
      <g className="clock-hand clock-hand-minute" style={{ transformOrigin: '24px 24px' }}>
        <path d="M24 24 32 27.5" />
      </g>
      {/* center dot */}
      <circle cx="24" cy="24" r="1.4" fill="currentColor" stroke="none" />
      {/* tick marks */}
      <path d="M24 9.2v2.2" />
      <path d="M38.6 24h-2.2" />
      <path d="M24 38.8v-2.2" />
      <path d="M11.4 24H9.2" />
    </svg>
  )
}
