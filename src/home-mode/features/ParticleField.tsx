import { useEffect, useRef } from 'react'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'
import { getNextMessage, showHMMessage } from '../messages'

interface Star {
  x: number
  y: number
  vx: number
  vy: number
  baseHue: number
  size: number
}
interface Burst {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const stars: Star[] = []
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        baseHue: Math.random() * 360,
        size: 1.4 + Math.random() * 2.6,
      })
    }
    const bursts: Burst[] = []
    let mx = -1000
    let my = -1000

    const onMove = (e: MouseEvent | TouchEvent) => {
      const t = 'touches' in e ? e.touches[0] : (e as MouseEvent)
      if (!t) return
      mx = t.clientX
      my = t.clientY
    }
    const onLeave = () => {
      mx = -1000
      my = -1000
    }
    const onClick = (e: MouseEvent | TouchEvent) => {
      const t = 'touches' in e ? e.changedTouches[0] : (e as MouseEvent)
      if (!t) return
      for (let i = 0; i < 30; i++) {
        const a = (i / 30) * Math.PI * 2
        bursts.push({
          x: t.clientX,
          y: t.clientY,
          vx: Math.cos(a) * (2 + Math.random() * 3),
          vy: Math.sin(a) * (2 + Math.random() * 3),
          life: 50,
        })
      }
      showHMMessage(getNextMessage(), { x: t.clientX, y: t.clientY })
    }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
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

      const hueShift = (f * 0.4) % 360

      for (const s of stars) {
        const dx = mx - s.x
        const dy = my - s.y
        const d2 = dx * dx + dy * dy
        if (d2 < 14400) {
          const d = Math.sqrt(d2) || 1
          const force = (1 - d / 120) * 0.5
          s.vx += (dx / d) * force
          s.vy += (dy / d) * force
        }
        s.vx *= 0.95
        s.vy *= 0.95
        s.x += s.vx
        s.y += s.vy
        if (s.x < 0) s.x = W
        if (s.x > W) s.x = 0
        if (s.y < 0) s.y = H
        if (s.y > H) s.y = 0
        const hue = (s.baseHue + hueShift) % 360
        ctx.fillStyle = `hsl(${hue}, 80%, 80%)`
        ctx.shadowBlur = 8
        ctx.shadowColor = `hsl(${hue}, 80%, 80%)`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]
        b.x += b.vx
        b.y += b.vy
        b.vx *= 0.93
        b.vy *= 0.93
        b.life--
        if (b.life <= 0) {
          bursts.splice(i, 1)
          continue
        }
        ctx.fillStyle = `rgba(255,240,180,${b.life / 50})`
        ctx.beginPath()
        ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // (toast messages handled by showHMMessage on click)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('mousedown', onClick)
      canvas.removeEventListener('touchstart', onClick)
    }
  }, [])

  return (
    <FeatureOverlay background="#0d0518">
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, cursor: 'crosshair' }}
      />
      <div
        style={{
          ...featureCaption,
          bottom: '12%',
          fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        every star up there has heard your name
      </div>
    </FeatureOverlay>
  )
}
