import { useEffect, useRef } from 'react'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'
import { getNextMessage, showHMMessage } from '../messages'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}
interface Shell {
  x: number
  y: number
  vx: number
  vy: number
  ttl: number
  color: string
}

const COLORS = ['#ff4d6d', '#ffd166', '#06d6a0', '#ff70a6', '#a78bfa', '#ffffff']

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)
    mouse.current = { x: W / 2, y: H / 2 }

    const shells: Shell[] = []
    const particles: Particle[] = []

    const fire = () => {
      const sx = W / 2
      const sy = H - 40
      const dx = mouse.current.x - sx
      const dy = mouse.current.y - sy
      const len = Math.hypot(dx, dy) || 1
      const speed = 11
      shells.push({
        x: sx,
        y: sy,
        vx: (dx / len) * speed,
        vy: (dy / len) * speed,
        ttl: 50 + Math.random() * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }

    const explode = (x: number, y: number, color: string) => {
      const n = 36
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.2
        const sp = 2 + Math.random() * 4
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          maxLife: 60 + Math.random() * 30,
          color: Math.random() > 0.6
            ? COLORS[Math.floor(Math.random() * COLORS.length)]
            : color,
          size: 2 + Math.random() * 1.5,
        })
      }
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      const t = 'touches' in e ? e.touches[0] : (e as MouseEvent)
      if (!t) return
      mouse.current.x = t.clientX
      mouse.current.y = t.clientY
    }
    const onDown = () => fire()

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onMove)
    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('touchstart', onDown)

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      ctx.fillStyle = 'rgba(18,12,28,0.22)'
      ctx.fillRect(0, 0, W, H)

      // cannon
      const sx = W / 2
      const sy = H - 30
      const ang = Math.atan2(mouse.current.y - sy, mouse.current.x - sx)
      ctx.save()
      ctx.translate(sx, sy)
      ctx.rotate(ang + Math.PI / 2)
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.shadowBlur = 16
      ctx.shadowColor = '#ff70a6'
      ctx.fillRect(-6, -28, 12, 28)
      ctx.beginPath()
      ctx.arc(0, 0, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      for (let i = shells.length - 1; i >= 0; i--) {
        const s = shells[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.04
        s.ttl--
        ctx.fillStyle = s.color
        ctx.shadowBlur = 12
        ctx.shadowColor = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2)
        ctx.fill()
        if (s.ttl <= 0) {
          explode(s.x, s.y, s.color)
          showHMMessage(getNextMessage(), { x: s.x, y: s.y })
          shells.splice(i, 1)
        }
      }
      ctx.shadowBlur = 0

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        p.vx *= 0.99
        p.life++
        const a = 1 - p.life / p.maxLife
        if (a <= 0) {
          particles.splice(i, 1)
          continue
        }
        ctx.fillStyle = p.color
        ctx.globalAlpha = a
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('touchstart', onDown)
    }
  }, [])

  return (
    <FeatureOverlay background="rgba(18,12,28,0.97)">
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, cursor: 'crosshair' }}
      />
      <div
        style={{
          ...featureCaption,
          top: 40,
          fontSize: 'clamp(1rem, 2.4vw, 1.4rem)',
        }}
      >
        every time you look up, i hope you see something beautiful
        <br />
        <span style={{ fontSize: '0.75em', opacity: 0.7 }}>
          tap or click anywhere to fire
        </span>
      </div>
    </FeatureOverlay>
  )
}
