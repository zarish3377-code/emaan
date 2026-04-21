import { useEffect, useRef, useState } from 'react'
import FeatureOverlay from './FeatureOverlay'
import { getNextMessage, showHMMessage } from '../messages'

interface Heart {
  x: number
  y: number
  size: number
  vy: number
  vxAmp: number
  vxFreq: number
  rot: number
  rotV: number
  color: string
  phase: number
}
interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

const COLORS = ['#ff6b9d', '#c44dff', '#4dffc4', '#ffd700', '#ff4757']

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rot: number,
  color: string
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.scale(size / 30, size / 30)
  ctx.fillStyle = color
  ctx.shadowBlur = 10
  ctx.shadowColor = color
  ctx.beginPath()
  ctx.moveTo(0, -10)
  ctx.bezierCurveTo(-15, -25, -30, -8, 0, 14)
  ctx.bezierCurveTo(30, -8, 15, -25, 0, -10)
  ctx.fill()
  ctx.restore()
}

export default function FallingHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const hearts: Heart[] = []
    const sparks: Spark[] = []
    const dust: { x: number; y: number; vy: number; r: number; o: number }[] = []

    const spawnHeart = (yOverride?: number): Heart => ({
      x: Math.random() * W,
      y: yOverride ?? -30,
      size: 14 + Math.random() * 16,
      vy: 1 + Math.random() * 2,
      vxAmp: 12 + Math.random() * 18,
      vxFreq: 0.005 + Math.random() * 0.01,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.04,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      phase: Math.random() * 1000,
    })
    for (let i = 0; i < 40; i++) hearts.push(spawnHeart(Math.random() * H))
    for (let i = 0; i < 22; i++)
      dust.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vy: -0.2 - Math.random() * 0.3,
        r: 1 + Math.random() * 1.6,
        o: 0.3 + Math.random() * 0.3,
      })

    const onClick = (e: MouseEvent | TouchEvent) => {
      const t = 'touches' in e ? e.changedTouches[0] : (e as MouseEvent)
      if (!t) return
      const cx = t.clientX
      const cy = t.clientY
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i]
        const dx = h.x - cx
        const dy = h.y - cy
        if (Math.hypot(dx, dy) < 36) {
          for (let k = 0; k < 12; k++) {
            const a = (k / 12) * Math.PI * 2
            sparks.push({
              x: h.x,
              y: h.y,
              vx: Math.cos(a) * (2 + Math.random() * 2),
              vy: Math.sin(a) * (2 + Math.random() * 2),
              life: 30,
              color: h.color,
            })
          }
          showHMMessage(getNextMessage())
          hearts.splice(i, 1)
          scoreRef.current++
          setScore(scoreRef.current)
          setTimeout(() => hearts.push(spawnHeart()), 1500)
          break
        }
      }
    }
    canvas.addEventListener('mousedown', onClick)
    canvas.addEventListener('touchstart', onClick)

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    let f = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      f++
      ctx.fillStyle = 'rgba(13,5,24,0.25)'
      ctx.fillRect(0, 0, W, H)

      for (const d of dust) {
        d.y += d.vy
        if (d.y < -5) {
          d.y = H + 5
          d.x = Math.random() * W
        }
        ctx.fillStyle = `rgba(255,235,200,${d.o})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const h of hearts) {
        h.y += h.vy
        h.rot += h.rotV
        const drift = Math.sin((f + h.phase) * h.vxFreq) * h.vxAmp
        const dx = h.x + drift
        if (h.y > H + 30) {
          h.y = -30
          h.x = Math.random() * W
        }
        drawHeart(ctx, dx, h.y, h.size, h.rot, h.color)
      }
      ctx.shadowBlur = 0

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vx *= 0.94
        s.vy *= 0.94
        s.life--
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.fillStyle = s.color
        ctx.globalAlpha = s.life / 30
        ctx.beginPath()
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // (toast messages handled by showHMMessage on click)
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
    <FeatureOverlay background="radial-gradient(ellipse at 50% 0%, #1a0a2e, #0d0518)">
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
      />
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          color: 'white',
          fontSize: '1.3rem',
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        × {score}
      </div>
    </FeatureOverlay>
  )
}
