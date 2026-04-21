import { useEffect, useRef, useState } from 'react'
import FeatureOverlay from './FeatureOverlay'
import { getNextMessage, showHMMessage } from '../messages'

interface FlowerDef {
  id: string
  cx: number
  cy: number
  size: 'large' | 'medium' | 'small'
  petalCount: number
  gradientId: string
  delay: number
}

const FLOWERS: FlowerDef[] = [
  { id: 'f1', cx: 120, cy: 410, size: 'large',  petalCount: 6, gradientId: 'pg-rose',  delay: 2800 },
  { id: 'f2', cx: 480, cy: 410, size: 'large',  petalCount: 6, gradientId: 'pg-rose',  delay: 3200 },
  { id: 'f3', cx: 105, cy: 290, size: 'medium', petalCount: 5, gradientId: 'pg-lav',   delay: 3600 },
  { id: 'f4', cx: 495, cy: 290, size: 'medium', petalCount: 5, gradientId: 'pg-lav',   delay: 4000 },
  { id: 'f5', cx: 150, cy: 185, size: 'medium', petalCount: 5, gradientId: 'pg-gold',  delay: 4400 },
  { id: 'f6', cx: 450, cy: 185, size: 'small',  petalCount: 4, gradientId: 'pg-rose',  delay: 4800 },
]

const SIZE_SCALE: Record<'large' | 'medium' | 'small', number> = {
  large: 1.0,
  medium: 0.68,
  small: 0.47,
}

interface FloatingPetal {
  id: number
  x: number
  y: number
  driftX: number
  rot: number
  color: string
}

const Flower = ({
  def,
  bloomed,
  onClick,
}: {
  def: FlowerDef
  bloomed: boolean
  onClick: (e: React.MouseEvent) => void
}) => {
  const scale = SIZE_SCALE[def.size]
  // base petal path (teardrop pointing up), length 38
  const petalPath = `M 0,0 C ${-10 * scale},${-12 * scale} ${-12 * scale},${-28 * scale} 0,${-38 * scale} C ${12 * scale},${-28 * scale} ${10 * scale},${-12 * scale} 0,0 Z`
  const stamenR = 7 * scale

  return (
    <g
      transform={`translate(${def.cx} ${def.cy})`}
      style={{
        cursor: bloomed ? 'pointer' : 'default',
        transformBox: 'fill-box',
        transformOrigin: 'center',
        animation: bloomed
          ? `hm-flower-breathe ${3 + Math.random() * 1.5}s ease-in-out ${def.delay}ms infinite`
          : undefined,
      }}
      onClick={onClick}
      pointerEvents={bloomed ? 'all' : 'none'}
    >
      {/* Glow halo */}
      {bloomed && (
        <circle
          r={40 * scale}
          fill={`url(#${def.gradientId})`}
          opacity={0.35}
          style={{
            filter: 'blur(14px)',
            transformOrigin: 'center',
            animation: `hm-fade-in 1s ease ${def.delay + 800}ms both`,
          }}
        />
      )}

      {/* Sepals */}
      {[0, 120, 240].map((rot) => (
        <ellipse
          key={rot}
          cx={0}
          cy={0}
          rx={6 * scale}
          ry={14 * scale}
          fill="#5A8A40"
          style={{
            transformOrigin: 'center',
            transform: `rotate(${rot}deg)`,
            animation: `hm-bloom 500ms ease ${def.delay - 400}ms both`,
          }}
        />
      ))}

      {/* Petals */}
      {Array.from({ length: def.petalCount }).map((_, i) => {
        const rot = (360 / def.petalCount) * i
        return (
          <path
            key={i}
            d={petalPath}
            fill={`url(#${def.gradientId})`}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.5"
            style={{
              transformOrigin: 'center',
              ['--hm-petal-rot' as string]: `${rot}deg`,
              animation: `hm-petal-bloom 700ms cubic-bezier(0.34,1.4,0.64,1) ${def.delay + i * 80}ms both`,
            }}
          />
        )
      })}

      {/* Stamen lines */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 6
        const x2 = Math.cos(a) * 10 * scale
        const y2 = Math.sin(a) * 10 * scale
        return (
          <g
            key={i}
            style={{
              animation: `hm-fade-in 400ms ease ${def.delay + 700}ms both`,
            }}
          >
            <line
              x1={0}
              y1={0}
              x2={x2}
              y2={y2}
              stroke="#FFD000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx={x2} cy={y2} r={1.5 * scale} fill="#FF9000" />
          </g>
        )
      })}

      {/* Center */}
      <circle
        r={stamenR}
        fill="#FFE040"
        style={{
          animation: `hm-bloom 400ms ease ${def.delay + 600}ms both`,
        }}
      />
    </g>
  )
}

export default function FlowerBloom() {
  const [bloomed, setBloomed] = useState(false)
  const [showText, setShowText] = useState(false)
  const [petals, setPetals] = useState<FloatingPetal[]>([])
  const overlayRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 7000)
    const t2 = setTimeout(() => setBloomed(true), 6500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const handleFlowerClick = (def: FlowerDef, e: React.MouseEvent) => {
    if (!bloomed) return
    const svg = overlayRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const screenX = rect.left + (def.cx / 600) * rect.width
    const screenY = rect.top + (def.cy / 600) * rect.height

    // pulse the flower
    const g = e.currentTarget as SVGGElement
    g.style.transition = 'transform 300ms ease'
    const orig = g.getAttribute('transform') || ''
    g.style.transformOrigin = `${def.cx}px ${def.cy}px`
    g.style.transform = 'scale(1.18)'
    setTimeout(() => {
      g.style.transform = ''
    }, 300)
    void orig

    // detach petals
    const colorMap: Record<string, string> = {
      'pg-rose': '#E0607A',
      'pg-lav': '#9050C0',
      'pg-gold': '#D09020',
    }
    const color = colorMap[def.gradientId] || '#E0607A'
    const newPetals: FloatingPetal[] = []
    for (let i = 0; i < 3; i++) {
      newPetals.push({
        id: Date.now() + i,
        x: screenX + (Math.random() - 0.5) * 24,
        y: screenY,
        driftX: (Math.random() - 0.5) * 80,
        rot: (Math.random() - 0.5) * 360,
        color,
      })
    }
    setPetals((prev) => [...prev, ...newPetals])
    setTimeout(() => {
      setPetals((prev) =>
        prev.filter((p) => !newPetals.find((n) => n.id === p.id))
      )
    }, 1500)

    showHMMessage(getNextMessage())
  }

  return (
    <FeatureOverlay background="linear-gradient(180deg, #0A1A0A 0%, #0D2010 40%, #0A1808 100%)">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 80px)',
          pointerEvents: 'none',
        }}
      />

      <svg
        ref={overlayRef}
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <radialGradient id="pg-rose" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFD0E0" />
            <stop offset="100%" stopColor="#E0607A" />
          </radialGradient>
          <radialGradient id="pg-lav" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#E8D0FF" />
            <stop offset="100%" stopColor="#9050C0" />
          </radialGradient>
          <radialGradient id="pg-gold" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFEEB0" />
            <stop offset="100%" stopColor="#D09020" />
          </radialGradient>
          <linearGradient id="leaf-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#5A9A4A" />
            <stop offset="100%" stopColor="#3A6A2A" />
          </linearGradient>
        </defs>

        {/* Main stems */}
        {[
          { d: 'M 300,590 C 280,480 220,380 180,260', delay: 0 },
          { d: 'M 300,590 C 320,480 380,380 420,260', delay: 200 },
        ].map((s, i) => (
          <path
            key={`ms${i}`}
            d={s.d}
            stroke="#4A7A3A"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: 600,
              strokeDashoffset: 600,
              animation: `hm-draw 1500ms ease-out ${s.delay}ms forwards`,
            }}
          />
        ))}

        {/* Branch stems */}
        {[
          'M 250,500 C 200,470 150,460 120,420',
          'M 230,440 C 170,420 130,400 110,360',
          'M 240,370 C 180,340 150,300 150,250',
          'M 250,300 C 200,260 180,220 170,200',
          'M 350,500 C 400,470 450,460 480,420',
          'M 370,440 C 430,420 470,400 490,360',
          'M 360,370 C 420,340 450,300 450,250',
          'M 350,300 C 400,260 420,220 430,200',
        ].map((d, i) => (
          <path
            key={`b${i}`}
            d={d}
            stroke="#4A7A4A"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: 300,
              animation: `hm-draw 900ms ease-out ${1500 + i * 150}ms forwards`,
            }}
          />
        ))}

        {/* Leaves */}
        {[
          { cx: 200, cy: 480, rot: -30, delay: 1900 },
          { cx: 400, cy: 480, rot: 30, delay: 1900 },
          { cx: 175, cy: 425, rot: -45, delay: 2050 },
          { cx: 425, cy: 425, rot: 45, delay: 2050 },
          { cx: 165, cy: 360, rot: -55, delay: 2200 },
          { cx: 435, cy: 360, rot: 55, delay: 2200 },
          { cx: 200, cy: 270, rot: -25, delay: 2350 },
          { cx: 400, cy: 270, rot: 25, delay: 2350 },
        ].map((l, i) => (
          <g
            key={`l${i}`}
            transform={`translate(${l.cx} ${l.cy}) rotate(${l.rot})`}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: `hm-bloom 700ms cubic-bezier(0.34,1.4,0.64,1) ${l.delay}ms both${
                bloomed ? `, hm-leaf-sway ${3 + (i % 3)}s ease-in-out ${i * 0.3}s infinite` : ''
              }`,
            }}
          >
            <path
              d="M 0,0 C -8,-6 -10,-18 0,-26 C 10,-18 8,-6 0,0 Z"
              fill="url(#leaf-grad)"
            />
            <line x1={0} y1={0} x2={0} y2={-26} stroke="#2A5A2A" strokeWidth="0.7" />
          </g>
        ))}

        {/* Flowers */}
        {FLOWERS.map((f) => (
          <Flower
            key={f.id}
            def={f}
            bloomed={bloomed}
            onClick={(e) => handleFlowerClick(f, e)}
          />
        ))}
      </svg>

      {/* Floating detached petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: p.x,
            top: p.y,
            width: 14,
            height: 18,
            background: p.color,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            ['--hm-pf-x' as string]: `${p.driftX}px`,
            animation: 'hm-petal-float 1500ms ease-out forwards',
            pointerEvents: 'none',
            zIndex: 10,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}

      {showText && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '8%',
            transform: 'translateX(-50%)',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.4rem',
            color: '#FCE4EC',
            textAlign: 'center',
            maxWidth: 400,
            padding: '0 24px',
            textShadow: '0 2px 16px rgba(0,0,0,0.6)',
            opacity: 0,
            animation: 'hm-welcome-line 800ms cubic-bezier(0.34,1.4,0.64,1) forwards',
            pointerEvents: 'none',
          }}
        >
          you're the most in-bloom person i know
        </div>
      )}
    </FeatureOverlay>
  )
}
