import type { InputHTMLAttributes } from 'react'
import { RoughFrame } from './RoughFrame'

type RoughInputProps = InputHTMLAttributes<HTMLInputElement>

export function RoughInput({ className, ...inputProps }: RoughInputProps) {
  return (
    <RoughFrame
      className="rough-control rough-input-frame"
      contentClassName="rough-control-content"
      stroke="#111"
      fill="transparent"
      cornerRadius={0}
    >
      <input {...inputProps} className={`rough-input-native ${className ?? ''}`} />
    </RoughFrame>
  )
}
