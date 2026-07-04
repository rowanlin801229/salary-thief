import { useEffect, useRef } from 'react'
import rough from 'roughjs'

interface BossKeyMarkerBgProps {
  isActive: boolean
}

export function BossKeyMarkerBg({ isActive }: BossKeyMarkerBgProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const svg = svgRef.current
    if (!wrap || !svg) return

    const draw = () => {
      const { width, height } = wrap.getBoundingClientRect()
      if (width <= 0 || height <= 0) return

      svg.innerHTML = ''
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      const rc = rough.svg(svg)

      const fill = isActive ? '#b91c1c' : '#e63946'
      const fillAccent = isActive ? '#991b1b' : '#d62839'
      const stroke = isActive ? '#7f1d1d' : '#b91c1c'
      const edgeStroke = isActive ? '#991b1b' : '#c1121f'
      const top = height * 0.1
      const w = width
      const h = height

      svg.append(
        rc.rectangle(0, 0, w, h + 6, {
          fill,
          fillStyle: 'solid',
          stroke: 'none',
          roughness: 0,
          seed: 1
        })
      )

      const swatch = [
        [0, h + 8],
        [w * 0.06, h + 2],
        [w * 0.22, h + 6],
        [w, h + 4],
        [w + 2, top + 18],
        [w * 0.94, top + 2],
        [w * 0.76, top + 20],
        [w * 0.58, top - 2],
        [w * 0.41, top + 14],
        [w * 0.24, top + 4],
        [w * 0.08, top + 16],
        [-2, top + 8]
      ]
      const swatchPath = `M ${swatch.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`

      svg.append(
        rc.path(swatchPath, {
          fill,
          fillStyle: 'solid',
          stroke,
          strokeWidth: 2,
          roughness: 3.8,
          bowing: 3.4,
          seed: isActive ? 91 : 42
        })
      )

      svg.append(
        rc.rectangle(w * 0.04, h * 0.22, w * 0.92, h * 0.82, {
          fill: fillAccent,
          fillStyle: 'solid',
          stroke: 'none',
          roughness: 4.5,
          bowing: 2.8,
          seed: isActive ? 73 : 28
        })
      )

      svg.append(
        rc.line(w * 0.01, top + 10, w * 0.99, top + 7, {
          stroke: edgeStroke,
          strokeWidth: 2.5,
          roughness: 4.2,
          bowing: 2.2,
          seed: 11
        })
      )

      svg.append(
        rc.line(w * 0.12, top + 22, w * 0.88, top + 18, {
          stroke: isActive ? '#7f1d1d' : '#c1121f',
          strokeWidth: 1.5,
          roughness: 3.6,
          bowing: 1.8,
          seed: 63
        })
      )
    }

    draw()
    const resizeObserver = new ResizeObserver(draw)
    resizeObserver.observe(wrap)
    return () => resizeObserver.disconnect()
  }, [isActive])

  return (
    <div ref={wrapRef} className="boss-key-marker-bg" aria-hidden>
      <svg ref={svgRef} className="boss-key-marker-svg" />
    </div>
  )
}
