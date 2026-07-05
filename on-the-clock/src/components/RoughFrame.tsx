import type { ReactNode } from 'react'

interface RoughFrameProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  stroke?: string
  fill?: string
  cornerRadius?: number
}

export function RoughFrame({
  children,
  className,
  contentClassName
}: RoughFrameProps) {
  return (
    <div className={`rough-frame ${className ?? ''}`.trim()}>
      <div className={contentClassName ?? 'rough-content'}>{children}</div>
    </div>
  )
}
