import { useEffect, useRef, type ReactNode } from 'react'
import rough from 'roughjs'

interface RoughFrameProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  stroke?: string
  fill?: string
  cornerRadius?: number
}

function roundedRectPath(x: number, y: number, width: number, height: number, radius: number): string {
  const r = Math.min(radius, width / 2, height / 2)
  if (r <= 0) {
    return `M ${x} ${y} H ${x + width} V ${y + height} H ${x} Z`
  }

  return [
    `M ${x + r} ${y}`,
    `H ${x + width - r}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `V ${y + height - r}`,
    `Q ${x + width} ${y + height} ${x + width - r} ${y + height}`,
    `H ${x + r}`,
    `Q ${x} ${y + height} ${x} ${y + height - r}`,
    `V ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    'Z'
  ].join(' ')
}

export function RoughFrame({
  children,
  className,
  contentClassName,
  stroke = '#000',
  fill = 'transparent',
  cornerRadius = 0
}: RoughFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const border = borderRef.current
    if (!container || !border) return

    const draw = () => {
      const { width, height } = container.getBoundingClientRect()
      border.innerHTML = ''
      border.setAttribute('viewBox', `0 0 ${width} ${height}`)
      const rc = rough.svg(border)
      const inset = 2
      const w = Math.max(0, width - inset * 2)
      const h = Math.max(0, height - inset * 2)
      const options = {
        stroke,
        strokeWidth: 3,
        roughness: 2.8,
        bowing: 2.5,
        seed: Math.floor(Math.random() * 100000),
        fill
      }

      const node =
        cornerRadius > 0
          ? rc.path(roundedRectPath(inset, inset, w, h, cornerRadius), options)
          : rc.rectangle(inset, inset, w, h, options)
      border.append(node)
    }

    draw()
    const resizeObserver = new ResizeObserver(() => draw())
    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [stroke, fill, cornerRadius])

  return (
    <div ref={containerRef} className={`rough-frame ${className ?? ''}`}>
      <svg ref={borderRef} className="rough-border" aria-hidden />
      <div className={contentClassName ?? 'rough-content'}>{children}</div>
    </div>
  )
}
