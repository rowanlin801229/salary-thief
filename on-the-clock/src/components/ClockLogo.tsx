interface ClockLogoProps {
  className?: string
}

/**
 * Hand-drawn doodle alarm clock used as the app logo.
 * Two bells, a hammer knob, feet, and slowly rotating hands.
 * Uses currentColor so it adapts to light/dark theme.
 */
export function ClockLogo({ className }: ClockLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {/* left bell */}
      <path d="M14.5 12.5c-4 .3-7 3.4-6.7 6.9l6.6-1.4Z" fill="currentColor" />
      {/* right bell */}
      <path d="M33.5 12.5c4 .3 7 3.4 6.7 6.9l-6.6-1.4Z" fill="currentColor" />
      {/* hammer knob on top */}
      <path d="M20 9.5c1.6-1.2 6.4-1.2 8 0" />
      <path d="M24 9V6.5" />
      {/* wobbly hand-drawn clock face */}
      <path d="M24 12.2c8.1-.3 14.6 6 14.4 14.1C38.2 34 31.8 40 24 39.7 16 39.4 9.6 33 9.8 25 10 17.2 16 12.4 24 12.2Z" />
      {/* feet */}
      <path d="M15.5 37.5 11 42" />
      <path d="M32.5 37.5 37 42" />
      {/* hour + minute hands (slowly rotating) */}
      <g className="clock-hand clock-hand-hour" style={{ transformOrigin: '24px 26px' }}>
        <path d="M24 26 23.5 18.5" />
      </g>
      <g className="clock-hand clock-hand-minute" style={{ transformOrigin: '24px 26px' }}>
        <path d="M24 26 30.5 29" />
      </g>
      {/* center dot */}
      <circle cx="24" cy="26" r="1.4" fill="currentColor" stroke="none" />
      {/* tick marks */}
      <path d="M24 16.5v2" />
      <path d="M33.5 26h-2" />
      <path d="M24 35.5v-2" />
      <path d="M16.5 26h-2" />
    </svg>
  )
}
