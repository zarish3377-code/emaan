import { useEffect, useRef } from 'react'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'
import { getNextMessage, showHMMessage } from '../messages'

interface Star {
  x: number
  y: number
  size: number
  baseA: number
  speed: number
  phase: number
}
interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  len: number
  life: number
  maxLife: number
}
interface Constellation {
  pts: { x: number; y: number }[]
  life: number
  drawn: number
}

export default function NightSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wishRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const stars: Star[] = []
    for (let i = 0; i < 320; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 0.6 + Math.random() * 2.2,
        baseA: 0.3 + Math.random() * 0.7,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      })
    }
    const shoots: ShootingStar[] = []
    const constellations: Constellation[] = []

    let nextShoot = performance.now() + 2000 + Math.random() * 3000

    const fireShooting = () => {
      const x = Math.random() * W * 0.6
      const y = Math.random() * H * 0.3
      const a = (Math.PI / 6) + Math.random() * (Math.PI / 6)
      const sp = 14 + Math.random() * 6
      shoots.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        len: 90 + Math.random() * 60,
        life: 0,
        maxLife: 50 + Math.random() * 30,
      })
      showHMMessage(getNextMessage())
    }

    const onClick = (e: MouseEvent | TouchEvent) => {
      const t = 'touches' in e ? e.changedTouches[0] : (e as MouseEvent)
      if (!t) return
      const cx = t.clientX
      const cy = t.clientY
      const n = 5 + Math.floor(Math.random() * 3)
      const pts = Array.from({ length: n }, () => ({
        x: cx + (Math.random() - 0.5) * 140,
        y: cy + (Math.random() - 0.5) * 140,
      }))
      constellations.push({
        pts,
        life: 240,
        drawn: 0,
      })
      showHMMessage(getNextMessage())
    }
    canvas.addEventListener('mousedown', onClick)
    canvas.addEventListener('touchstart', onClick)

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      ctx.fillStyle = 'rgba(3,5,16,0.35)'
      ctx.fillRect(0, 0, W, H)

      // moon
      const mx = W - 110
      const my = 110
      const grd = ctx.createRadialGradient(mx, my, 10, mx, my, 120)
      grd.addColorStop(0, 'rgba(237,216,146,0.35)')
      grd.addColorStop(1, 'rgba(237,216,146,0)')
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(mx, my, 120, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#edd892'
      ctx.shadowBlur = 30
      ctx.shadowColor = '#edd892'
      ctx.beginPath()
      ctx.arc(mx, my, 38, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // stars twinkle
      const ts = now * 0.001
      for (const s of stars) {
        const a = s.baseA * (0.5 + 0.5 * Math.sin(ts * s.speed + s.phase))
        ctx.fillStyle = `rgba(255,255,255,${a})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      }

      if (now > nextShoot) {
        fireShooting()
        nextShoot = now + 3000 + Math.random() * 3000
      }

      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i]
        s.x += s.vx
        s.y += s.vy
        s.life++
        const a = 1 - s.life / s.maxLife
        if (a <= 0) {
          shoots.splice(i, 1)
          continue
        }
        const tx = s.x - s.vx * (s.len / Math.hypot(s.vx, s.vy))
        const ty = s.y - s.vy * (s.len / Math.hypot(s.vx, s.vy))
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y)
        grad.addColorStop(0, 'rgba(255,255,255,0)')
        grad.addColorStop(1, `rgba(255,255,255,${a})`)
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()
      }

      for (let i = constellations.length - 1; i >= 0; i--) {
        const c = constellations[i]
        c.life--
        c.drawn = Math.min(c.pts.length, c.drawn + 0.06)
        const a = c.life > 60 ? 1 : c.life / 60
        // lines
        ctx.strokeStyle = `rgba(255,255,255,${0.4 * a})`
        ctx.lineWidth = 1
        ctx.beginPath()
        const dpts = Math.floor(c.drawn)
        for (let k = 0; k < dpts; k++) {
          const p = c.pts[k]
          if (k === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
        // dots
        for (let k = 0; k < dpts; k++) {
          const p = c.pts[k]
          ctx.fillStyle = `rgba(255,255,255,${a})`
          ctx.shadowBlur = 8
          ctx.shadowColor = 'white'
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.shadowBlur = 0
        // label near centroid
        if (dpts >= c.pts.length) {
          let cx = 0
          let cy = 0
          for (const p of c.pts) {
            cx += p.x
            cy += p.y
          }
          cx /= c.pts.length
          cy /= c.pts.length
          ctx.fillStyle = `rgba(255,255,255,${0.85 * a})`
          ctx.font = "italic 16px 'Cormorant Garamond', serif"
          ctx.textAlign = 'center'
          ctx.fillText(c.label, cx, cy + 30)
        }
        if (c.life <= 0) constellations.splice(i, 1)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousedown', onClick)
      canvas.removeEventListener('touchstart', onClick)
    }
  }, [])

  return (
    <FeatureOverlay background="radial-gradient(ellipse at 50% 0%, #0a0e2a, #030510)">
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, cursor: 'crosshair' }} />
      <div
        ref={wishRef}
        style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          color: 'white',
          fontSize: 'clamp(1.1rem, 2.4vw, 1.5rem)',
          textShadow: '0 2px 16px rgba(0,0,0,0.7)',
          opacity: 0,
          pointerEvents: 'none',
          textAlign: 'center',
          maxWidth: 500,
          padding: '0 24px',
        }}
      />
      <div
        style={{
          ...featureCaption,
          bottom: '10%',
          fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        somewhere under the same sky, i'm thinking of you
      </div>
    </FeatureOverlay>
  )
}
