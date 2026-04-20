import { useEffect, useRef } from 'react'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'

interface P {
  vx: number
  vy: number
  R: number
  speed: number
  q: number
  D: number
  force: number
  f: number
  trace: { x: number; y: number }[]
}

export default function CanvasPulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)
    const rand = (m: number, n: number) => Math.random() * (n - m) + m

    const heartPos = (rad: number) => {
      return [
        Math.pow(Math.sin(rad), 3),
        -(15 * Math.cos(rad) -
          5 * Math.cos(2 * rad) -
          2 * Math.cos(3 * rad) -
          Math.cos(4 * rad)) /
          17,
      ]
    }

    const buildPoints = (count: number, scale: number, ox: number, oy: number) => {
      const pts: number[][] = []
      const dr = 0.1
      const total = (Math.PI * 2) / dr
      for (let i = 0; i < count; i++) {
        const r = (i / count) * Math.PI * 2
        const p = heartPos(r)
        pts.push([p[0] * scale + ox, p[1] * scale + oy])
        // also a noisy point near the curve
        const j = (Math.random() - 0.5) * scale * 0.05
        pts.push([p[0] * scale + ox + j, p[1] * scale + oy + j])
      }
      return pts
    }

    let cx = W / 2
    let cy = H / 2
    let scale = Math.min(W, H) * 0.0014 * 210

    const buildAll = () => {
      cx = W / 2
      cy = H / 2
      scale = Math.min(W, H) * 0.0014 * 210
      const a = buildPoints(220, scale, cx, cy)
      const b = buildPoints(150, scale * 0.72, cx, cy)
      const c = buildPoints(90, scale * 0.45, cx, cy)
      return [...a, ...b, ...c]
    }
    let pointArr = buildAll()
    const particles: P[] = []
    for (let i = 0; i < pointArr.length; i++) {
      const x = Math.random() * W
      const y = Math.random() * H
      particles.push({
        vx: x,
        vy: y,
        R: 2,
        speed: rand(0.1, 0.25),
        q: i,
        D: 2 * Math.random() + 1,
        force: 0.2 * Math.random() + 0.7,
        f: `hsla(${Math.floor(rand(-10, 10))}, ${Math.floor(rand(50, 100))}%, ${Math.floor(rand(50, 80))}%, 0.85)`,
        trace: [],
      })
    }

    let time = 0
    let raf = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const n = -Math.cos(time)
      if (Math.sin(time) < 0) {
        time += 0.5
      } else {
        time += 0.05
      }
      const factor = 1 + n * 0.05
      void factor

      ctx.fillStyle = 'rgba(0,0,0,0.18)'
      ctx.fillRect(0, 0, W, H)

      for (let i = 0; i < particles.length; i++) {
        const u = particles[i]
        const t = pointArr[u.q]
        if (!t) continue
        const tx = (t[0] - cx) * factor + cx
        const ty = (t[1] - cy) * factor + cy
        const dx = tx - u.vx
        const dy = ty - u.vy
        const d = Math.sqrt(dx * dx + dy * dy)
        const A = 30 - d
        const B = (A < 0 ? -1 : 1) * (A < 0 ? -A : A) / 30
        const f = (10 + u.D * (B * B)) * u.force
        u.vx += (dx / d) * f * u.speed
        u.vy += (dy / d) * f * u.speed
        u.trace[0] = u.trace[0] || { x: u.vx, y: u.vy }
        const T = u.trace[0]
        T.x -= (T.x - u.vx) * 0.1
        T.y -= (T.y - u.vy) * 0.1
        ctx.fillStyle = u.f
        ctx.beginPath()
        ctx.arc(T.x, T.y, u.R, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      pointArr = buildAll()
    }
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <FeatureOverlay background="#000000">
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
      <div
        style={{
          ...featureCaption,
          top: '12%',
          fontSize: 'clamp(1.2rem, 2.6vw, 1.6rem)',
          animation: 'hm-pulse 2.4s ease-in-out infinite',
        }}
      >
        you have the most beautiful heart i've ever known
      </div>
    </FeatureOverlay>
  )
}
