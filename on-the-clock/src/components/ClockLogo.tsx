interface ClockLogoProps {
  className?: string
}

/**
 * Hand-drawn doodle alarm clock used as the app logo.
 * Two bells, a hammer knob, and slowly rotating hands on a round face.
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
      <path d="M13 10.5c-4.4 .3-7.7 3.7-7.4 7.6l7.3-1.5Z" fill="currentColor" />
      {/* right bell */}
      <path d="M35 10.5c4.4 .3 7.7 3.7 7.4 7.6l-7.3-1.5Z" fill="currentColor" />
      {/* hammer knob on top */}
      <path d="M20 7.5c1.6-1.2 6.4-1.2 8 0" />
      <path d="M24 7V4.5" />
      {/* wobbly hand-drawn clock face (enlarged) */}
      <path d="M24 9.5C33.2 9.2 41 16.6 40.8 25.9 40.6 35 33.2 41.8 24 41.5 15 41.2 7.2 34 7.5 25 7.7 15.8 14.8 9.8 24 9.5Z" />
      {/* hour + minute hands (slowly rotating) */}
      <g className="clock-hand clock-hand-hour" style={{ transformOrigin: '24px 25.5px' }}>
        <path d="M24 25.5 23.3 14.5" />
      </g>
      <g className="clock-hand clock-hand-minute" style={{ transformOrigin: '24px 25.5px' }}>
        <path d="M24 25.5 32.5 29" />
      </g>
      {/* center dot */}
      <circle cx="24" cy="25.5" r="1.6" fill="currentColor" stroke="none" />
      {/* tick marks */}
      <path d="M24 12.5v2.3" />
      <path d="M37 25.5h-2.3" />
      <path d="M24 38.5v-2.3" />
      <path d="M13.3 25.5h-2.3" />
    </svg>
  )
}
