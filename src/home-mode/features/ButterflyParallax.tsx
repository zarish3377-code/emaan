import { useEffect, useRef, useState } from 'react'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'

const Butterfly = ({
  x,
  y,
  size = 60,
  hue = 280,
  flapDur = 0.45,
}: {
  x: number
  y: number
  size?: number
  hue?: number
  flapDur?: number
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      filter: `drop-shadow(0 6px 12px hsla(${hue},70%,55%,0.4))`,
    }}
  >
    <svg viewBox="-50 -50 100 100" width="100%" height="100%">
      {/* upper wings */}
      <g style={{ transformOrigin: '0 0', animation: `hm-flap ${flapDur}s ease-in-out infinite` }}>
        <ellipse cx={-22} cy={-12} rx={22} ry={26} fill={`hsla(${hue},80%,75%,0.85)`} />
        <ellipse cx={22} cy={-12} rx={22} ry={26} fill={`hsla(${hue},80%,75%,0.85)`} />
      </g>
      {/* lower wings */}
      <g
        style={{
          transformOrigin: '0 0',
          animation: `hm-flap ${flapDur}s ease-in-out ${flapDur * 0.15}s infinite`,
        }}
      >
        <ellipse cx={-16} cy={14} rx={16} ry={20} fill={`hsla(${(hue + 30) % 360},80%,80%,0.75)`} />
        <ellipse cx={16} cy={14} rx={16} ry={20} fill={`hsla(${(hue + 30) % 360},80%,80%,0.75)`} />
      </g>
      {/* body */}
      <ellipse cx={0} cy={0} rx={3} ry={18} fill="#3a2a3a" />
      <circle cx={0} cy={-18} r={3.5} fill="#3a2a3a" />
    </svg>
  </div>
)

const Flower = ({
  x,
  y,
  size,
  hue,
  swayDur,
}: {
  x: number
  y: number
  size: number
  hue: number
  swayDur: number
}) => (
  <div
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      transformOrigin: 'bottom center',
      animation: `hm-sway ${swayDur}s ease-in-out infinite`,
      pointerEvents: 'none',
    }}
  >
    <svg viewBox="-50 -50 100 100" width="100%" height="100%">
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <ellipse
            key={i}
            cx={Math.cos(a) * 18}
            cy={Math.sin(a) * 18}
            rx={16}
            ry={9}
            fill={`hsla(${hue},80%,75%,0.85)`}
            transform={`rotate(${(a * 180) / Math.PI})`}
          />
        )
      })}
      <circle cx={0} cy={0} r={9} fill="#fff3a8" />
      <circle cx={0} cy={0} r={5} fill="#e8b04a" />
    </svg>
  </div>
)

export default function ButterflyParallax() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [b1, setB1] = useState({ x: 0, y: 0 })
  const [b2, setB2] = useState({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 1200)
    const onMove = (e: MouseEvent) => {
      const r = rootRef.current?.getBoundingClientRect()
      if (!r) return
      const rx = (e.clientX - r.left) / r.width
      const ry = (e.clientY - r.top) / r.height
      setMouse({ x: rx, y: ry })
      targetRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    window.addEventListener('mousemove', onMove)

    let raf = 0
    let f = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      f++
      const tg = targetRef.current
      setB1((prev) => ({
        x: prev.x + (tg.x - 60 + Math.sin(f * 0.02) * 40 - prev.x) * 0.04,
        y: prev.y + (tg.y - 40 + Math.cos(f * 0.025) * 30 - prev.y) * 0.04,
      }))
      setB2((prev) => ({
        x: prev.x + (tg.x + 80 + Math.cos(f * 0.018) * 50 - prev.x) * 0.03,
        y: prev.y + (tg.y + 50 + Math.sin(f * 0.022) * 40 - prev.y) * 0.03,
      }))
    }
    raf = requestAnimationFrame(tick)

    return () => {
      clearTimeout(t)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const px = (mouse.x - 0.5) * 2
  const py = (mouse.y - 0.5) * 2

  return (
    <FeatureOverlay background="linear-gradient(180deg, #d4e8c8, #f6d8e2 80%, #e8c4d8)">
      <div ref={rootRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Layer 1: bg image */}
        <div
          style={{
            position: 'absolute',
            inset: -30,
            backgroundImage: 'url(/home-mode/garden_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${px * -10}px, ${py * -10}px)`,
            opacity: 0.85,
          }}
        />
        {/* Layer 2: small flowers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${px * -25}px, ${py * -25}px)`,
          }}
        >
          <Flower x={12} y={70} size={50} hue={330} swayDur={3.2} />
          <Flower x={88} y={75} size={56} hue={290} swayDur={3.8} />
          <Flower x={30} y={82} size={44} hue={350} swayDur={2.8} />
        </div>
        {/* Layer 3: mid flowers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${px * -50}px, ${py * -50}px)`,
          }}
        >
          <Flower x={18} y={50} size={90} hue={320} swayDur={4} />
          <Flower x={72} y={45} size={100} hue={275} swayDur={4.6} />
          <Flower x={50} y={60} size={80} hue={345} swayDur={3.4} />
        </div>
        {/* Layer 4: butterflies */}
        <Butterfly x={b1.x} y={b1.y} size={70} hue={280} flapDur={0.42} />
        <Butterfly x={b2.x} y={b2.y} size={56} hue={335} flapDur={0.5} />
        {/* vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(20,10,30,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>
      {showText && (
        <div
          style={{
            ...featureCaption,
            bottom: '10%',
            fontSize: 'clamp(1.1rem, 2.4vw, 1.5rem)',
            animation: 'hm-fade-in 800ms ease',
          }}
        >
          if i was a butterfly i'd find you first, every time
        </div>
      )}
    </FeatureOverlay>
  )
}
