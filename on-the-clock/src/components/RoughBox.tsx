import type { ReactNode } from 'react'
import { RoughFrame } from './RoughFrame'

interface RoughBoxProps {
  children: ReactNode
  className?: string
  stroke?: string
  fill?: string
}

export function RoughBox({ children, className, stroke, fill }: RoughBoxProps) {
  return (
    <RoughFrame className={`rough-box ${className ?? ''}`} stroke={stroke} fill={fill}>
      {children}
    </RoughFrame>
  )
}
