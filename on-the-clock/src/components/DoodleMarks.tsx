interface DoodleMarksProps {
  className?: string
}

export function DoodleMarks({ className }: DoodleMarksProps) {
  return (
    <div className={`doodle-marks ${className ?? ''}`} aria-hidden>
      <span className="doodle-mark doodle-mark-q">？</span>
      <span className="doodle-mark doodle-mark-star">★</span>
      <span className="doodle-mark doodle-mark-arrow">→</span>
    </div>
  )
}
