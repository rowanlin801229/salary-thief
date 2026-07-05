import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { RoughFrame } from './RoughFrame'

interface RoughButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode
  active?: boolean
  primary?: boolean
  frameClassName?: string
}

export function RoughButton({
  children,
  active = false,
  primary = false,
  className,
  frameClassName,
  ...buttonProps
}: RoughButtonProps) {
  return (
    <RoughFrame
      className={`rough-control rough-button-frame ${active ? 'is-active' : ''} ${primary ? 'is-primary' : ''} ${frameClassName ?? ''}`}
      contentClassName="rough-control-content"
      fill="transparent"
      stroke="#000000"
      cornerRadius={16}
    >
      <button {...buttonProps} className={`rough-button-native ${className ?? ''}`}>
        {children}
      </button>
    </RoughFrame>
  )
}
