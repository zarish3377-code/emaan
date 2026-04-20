import { useEffect, useMemo, useState } from 'react'
import { useHomeMode } from './useHomeMode'

const GOLD_COLORS = ['#FFD700', '#F9C846', '#FFC107', '#FFE066', '#FFAB00']

interface Particle {
  x: number
  y: number
  size: number
  color: string
  drift: number
  duration: number
  delay: number
  pulse: boolean
  glow: boolean
  isStar: boolean
}

function makeParticles(): Particle[] {
  const arr: Particle[] = []
  for (let i = 0; i < 80; i++) {
    arr.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 6,
      color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      drift: 15 + Math.random() * 20,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 4,
      pulse: Math.random() < 0.2,
      glow: Math.random() < 0.15,
      isStar: Math.random() < 0.5,
    })
  }
  return arr
}

const Star = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: 'block' }}>
    <path
      d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
      fill={color}
    />
  </svg>
)

export default function WelcomeScene() {
  const { showWelcome, setShowWelcome } = useHomeMode()
  const particles = useMemo(makeParticles, [])
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  useEffect(() => {
    if (!showWelcome) return
    const tOut = setTimeout(() => setPhase('out'), 2200)
    const tDone = setTimeout(() => setShowWelcome(false), 2700)
    return () => {
      clearTimeout(tOut)
      clearTimeout(tDone)
    }
  }, [showWelcome, setShowWelcome])

  if (!showWelcome) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        background:
          'radial-gradient(ellipse at 50% 40%, #0A0F3D 0%, #050820 50%, #020410 100%)',
        overflow: 'hidden',
        opacity: phase === 'out' ? 0 : 1,
        transition: 'opacity 500ms ease',
      }}
    >
      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            ['--hm-w-drift' as string]: `${p.drift}px`,
            ['--hm-w-dur' as string]: `${p.duration}s`,
            ['--hm-w-delay' as string]: `${p.delay}s`,
            animation: `hm-welcome-rise var(--hm-w-dur) ease-in-out var(--hm-w-delay) infinite${
              p.pulse ? ', hm-welcome-pulse 2.6s ease-in-out infinite' : ''
            }`,
            filter: p.glow
              ? 'drop-shadow(0 0 4px rgba(255,215,0,0.85))'
              : undefined,
            opacity: phase === 'out' ? 0 : undefined,
            transform: phase === 'out' ? 'scale(1.5)' : undefined,
            transition: phase === 'out' ? 'all 600ms ease-out' : undefined,
          }}
        >
          {p.isStar ? (
            <Star size={p.size} color={p.color} />
          ) : (
            <div
              style={{
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: p.color,
              }}
            />
          )}
        </div>
      ))}

      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          color: '#F9E4A0',
          textShadow:
            '0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.2)',
          letterSpacing: '0.06em',
          opacity: phase === 'out' ? 0 : 1,
          transform:
            phase === 'out' ? 'translateY(-20px)' : 'translateY(0)',
          transition: 'opacity 500ms ease, transform 500ms ease',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            opacity: 0,
            animation:
              'hm-welcome-line 800ms cubic-bezier(0.34,1.4,0.64,1) 400ms forwards, hm-welcome-pulse-text 2.4s ease-in-out 1600ms infinite',
            lineHeight: 1.1,
          }}
        >
          Welcome Home,
        </div>
        <div
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            opacity: 0,
            marginTop: '0.2em',
            animation:
              'hm-welcome-line 800ms cubic-bezier(0.34,1.4,0.64,1) 800ms forwards, hm-welcome-pulse-text 2.4s ease-in-out 1800ms infinite',
            lineHeight: 1.1,
          }}
        >
          Love ♡
        </div>
      </div>
    </div>
  )
}
