import { useEffect, useState } from 'react'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'

interface FlowerDef {
  id: string
  cx: number
  cy: number
  size: number
  petalCount: number
  centerColor: string
  petalCenter: string
  petalEdge: string
  delay: number
}

const FLOWERS: FlowerDef[] = [
  {
    id: 'f1',
    cx: 220,
    cy: 200,
    size: 60,
    petalCount: 6,
    centerColor: '#FFE066',
    petalCenter: '#FFB8D0',
    petalEdge: '#E07090',
    delay: 3000,
  },
  {
    id: 'f2',
    cx: 480,
    cy: 180,
    size: 60,
    petalCount: 7,
    centerColor: '#FFE066',
    petalCenter: '#FFB8D0',
    petalEdge: '#E07090',
    delay: 3400,
  },
  {
    id: 'f3',
    cx: 350,
    cy: 280,
    size: 60,
    petalCount: 6,
    centerColor: '#FFE066',
    petalCenter: '#FFB8D0',
    petalEdge: '#E07090',
    delay: 3800,
  },
  {
    id: 'f4',
    cx: 180,
    cy: 340,
    size: 40,
    petalCount: 5,
    centerColor: '#FFE066',
    petalCenter: '#D4B8FF',
    petalEdge: '#9060D0',
    delay: 4200,
  },
  {
    id: 'f5',
    cx: 510,
    cy: 320,
    size: 40,
    petalCount: 5,
    centerColor: '#FFE066',
    petalCenter: '#D4B8FF',
    petalEdge: '#9060D0',
    delay: 4600,
  },
  {
    id: 'f6',
    cx: 350,
    cy: 130,
    size: 24,
    petalCount: 5,
    centerColor: '#FFE066',
    petalCenter: '#FFD8E8',
    petalEdge: '#FF89B0',
    delay: 5500,
  },
]

const MESSAGES = [
  'you bloom quietly but everyone sees it',
  'this one is yours',
  'even flowers know your name',
  'as alive as you are',
  'growing, always',
]

interface FloatingPetal {
  id: number
  x: number
  y: number
  driftX: number
  color: string
}

interface ActiveMsg {
  id: number
  x: number
  y: number
  text: string
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
  return (
    <g
      style={{
        transformOrigin: `${def.cx}px ${def.cy}px`,
        transformBox: 'fill-box',
        animation: bloomed
          ? `hm-flower-breathe ${3 + Math.random()}s ease-in-out ${def.id.length * 0.5}s infinite`
          : undefined,
        cursor: bloomed ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {/* Glow halo */}
      {bloomed && (
        <circle
          cx={def.cx}
          cy={def.cy}
          r={def.size * 1.4}
          fill={def.petalEdge}
          opacity={0.18}
          style={{
            filter: 'blur(12px)',
            transition: 'opacity 1s ease',
          }}
        />
      )}

      {/* Sepals (3 small green points behind petals) */}
      {[0, 120, 240].map((rot) => (
        <ellipse
          key={rot}
          cx={def.cx}
          cy={def.cy + def.size * 0.4}
          rx={def.size * 0.18}
          ry={def.size * 0.45}
          fill="#3A8A4A"
          style={{
            transformOrigin: `${def.cx}px ${def.cy}px`,
            transformBox: 'fill-box',
            transform: `rotate(${rot}deg)`,
            animation: `hm-bloom 600ms ease ${def.delay - 400}ms both`,
          }}
        />
      ))}

      {/* Petals */}
      {Array.from({ length: def.petalCount }).map((_, i) => {
        const rot = (360 / def.petalCount) * i
        const petalDelay = def.delay + i * 100
        return (
          <ellipse
            key={i}
            cx={def.cx}
            cy={def.cy - def.size * 0.5}
            rx={def.size * 0.32}
            ry={def.size * 0.55}
            fill={`url(#petal-grad-${def.id})`}
            style={{
              transformOrigin: `${def.cx}px ${def.cy}px`,
              transformBox: 'fill-box',
              ['--hm-petal-rot' as string]: `${rot}deg`,
              animation: `hm-petal-bloom 700ms cubic-bezier(0.34,1.4,0.64,1) ${petalDelay}ms both`,
            }}
          />
        )
      })}

      {/* Center stamen */}
      <circle
        cx={def.cx}
        cy={def.cy}
        r={def.size * 0.18}
        fill={def.centerColor}
        style={{
          animation: `hm-bloom 400ms ease ${def.delay + 600}ms both`,
        }}
      />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 6
        const x1 = def.cx + Math.cos(a) * def.size * 0.18
        const y1 = def.cy + Math.sin(a) * def.size * 0.18
        const x2 = def.cx + Math.cos(a) * def.size * 0.3
        const y2 = def.cy + Math.sin(a) * def.size * 0.3
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FFD700"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              animation: `hm-fade-in 400ms ease ${def.delay + 700}ms both`,
            }}
          />
        )
      })}
    </g>
  )
}

export default function FlowerBloom() {
  const [bloomed, setBloomed] = useState(false)
  const [showText, setShowText] = useState(false)
  const [petals, setPetals] = useState<FloatingPetal[]>([])
  const [messages, setMessages] = useState<ActiveMsg[]>([])

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 7000)
    const t2 = setTimeout(() => setBloomed(true), 7800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const handleFlowerClick = (def: FlowerDef, e: React.MouseEvent) => {
    if (!bloomed) return
    const rect = (e.currentTarget as SVGElement)
      .closest('svg')!
      .getBoundingClientRect()
    const screenX = rect.left + (def.cx / 700) * rect.width
    const screenY = rect.top + (def.cy / 600) * rect.height

    const newPetals: FloatingPetal[] = []
    for (let i = 0; i < 3; i++) {
      newPetals.push({
        id: Date.now() + i,
        x: screenX + (Math.random() - 0.5) * 30,
        y: screenY,
        driftX: (Math.random() - 0.5) * 80,
        color: def.petalEdge,
      })
    }
    setPetals((prev) => [...prev, ...newPetals])
    setTimeout(() => {
      setPetals((prev) =>
        prev.filter((p) => !newPetals.find((n) => n.id === p.id))
      )
    }, 1500)

    const msgId = Date.now()
    const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    setMessages((prev) => [...prev, { id: msgId, x: screenX, y: screenY - 40, text }])
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== msgId))
    }, 2200)
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
        viewBox="0 0 700 600"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          {FLOWERS.map((f) => (
            <radialGradient
              key={f.id}
              id={`petal-grad-${f.id}`}
              cx="50%"
              cy="80%"
              r="80%"
            >
              <stop offset="0%" stopColor={f.petalCenter} />
              <stop offset="100%" stopColor={f.petalEdge} />
            </radialGradient>
          ))}
          <linearGradient id="leaf-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3A8A4A" />
            <stop offset="100%" stopColor="#2A6A3A" />
          </linearGradient>
        </defs>

        {/* Main stems */}
        {[
          'M340 580 C 320 480, 290 380, 220 200',
          'M360 580 C 380 480, 410 380, 480 180',
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#3A6A3A"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 800,
              strokeDashoffset: 800,
              animation: `hm-draw 1500ms ease-out ${i * 200}ms forwards`,
            }}
          />
        ))}

        {/* Branch stems */}
        {[
          'M310 460 C 280 440, 230 410, 180 340',
          'M390 460 C 420 440, 470 410, 510 320',
          'M295 380 C 310 360, 320 320, 350 280',
          'M310 320 C 290 290, 280 240, 350 130',
          'M395 380 C 380 360, 370 320, 350 280',
          'M390 320 C 410 290, 420 240, 350 130',
          'M280 410 C 250 400, 220 395, 200 395',
          'M420 410 C 450 400, 480 405, 500 405',
        ].map((d, i) => (
          <path
            key={`b${i}`}
            d={d}
            stroke="#4A7A4A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 400,
              strokeDashoffset: 400,
              animation: `hm-draw 900ms ease-out ${1500 + i * 150}ms forwards`,
            }}
          />
        ))}

        {/* Leaves */}
        {[
          { cx: 240, cy: 410, rot: -40, side: 'left', delay: 2400 },
          { cx: 460, cy: 410, rot: 40, side: 'right', delay: 2500 },
          { cx: 200, cy: 395, rot: -70, side: 'left', delay: 2600 },
          { cx: 500, cy: 395, rot: 70, side: 'right', delay: 2700 },
          { cx: 280, cy: 360, rot: -20, side: 'left', delay: 2800 },
          { cx: 420, cy: 360, rot: 20, side: 'right', delay: 2900 },
          { cx: 240, cy: 290, rot: -45, side: 'left', delay: 3000 },
          { cx: 460, cy: 290, rot: 45, side: 'right', delay: 3100 },
        ].map((l, i) => (
          <g
            key={`l${i}`}
            style={{
              transformOrigin: `${l.cx}px ${l.cy}px`,
              transformBox: 'fill-box',
              animation: `hm-bloom 700ms cubic-bezier(0.34,1.4,0.64,1) ${l.delay}ms both${
                bloomed
                  ? `, hm-leaf-sway ${4 + (i % 3)}s ease-in-out infinite`
                  : ''
              }`,
              transform: `rotate(${l.rot}deg)`,
            }}
          >
            <ellipse
              cx={l.cx}
              cy={l.cy}
              rx="22"
              ry="9"
              fill="url(#leaf-grad)"
              opacity="0.95"
            />
            <line
              x1={l.cx - 22}
              y1={l.cy}
              x2={l.cx + 22}
              y2={l.cy}
              stroke="#2A5A2A"
              strokeWidth="0.6"
              opacity="0.7"
            />
          </g>
        ))}

        {/* Decorative dots */}
        {Array.from({ length: 12 }).map((_, i) => {
          const cx = 200 + Math.random() * 320
          const cy = 200 + Math.random() * 200
          const isGold = i % 2 === 0
          return (
            <g
              key={`d${i}`}
              style={{
                animation: `hm-fade-in 600ms ease ${6500 + i * 80}ms both`,
              }}
            >
              {[0, 6, -6].map((dx, j) => (
                <circle
                  key={j}
                  cx={cx + dx}
                  cy={cy + (j % 2 === 0 ? 0 : 4)}
                  r="2"
                  fill={isGold ? '#FFD700' : '#C4B0E8'}
                  opacity="0.7"
                />
              ))}
            </g>
          )
        })}

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

      {/* Floating petals (detached) */}
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
          }}
        />
      ))}

      {/* Floating messages */}
      {messages.map((m) => (
        <div
          key={m.id}
          style={{
            position: 'fixed',
            left: m.x,
            top: m.y,
            transform: 'translate(-50%, 0)',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 14,
            color: '#FCE4EC',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            padding: '6px 12px',
            borderRadius: 100,
            whiteSpace: 'nowrap',
            animation: 'hm-msg-bubble 2200ms ease forwards',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {m.text}
        </div>
      ))}

      {showText && (
        <div
          style={{
            ...featureCaption,
            bottom: '8%',
            fontSize: '1.5rem',
            color: '#FCE4EC',
            opacity: 0,
            animation:
              'hm-welcome-line 800ms cubic-bezier(0.34,1.4,0.64,1) forwards',
          }}
        >
          you're the most in-bloom person i know
        </div>
      )}
    </FeatureOverlay>
  )
}
