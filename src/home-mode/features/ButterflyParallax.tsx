import { useEffect, useRef, useState } from 'react'
import FeatureOverlay from './FeatureOverlay'
import { getNextMessage, showHMMessage } from '../messages'

interface BfDef {
  id: 'a' | 'b' | 'c'
  wing: string
  vein: string
  start: { x: number; y: number }
  cp1: { x: number; y: number }
  cp2: { x: number; y: number }
  end: { x: number; y: number }
  rest: { x: number; y: number } // settled position around envelope (vw/vh)
}

const BUTTERFLIES: BfDef[] = [
  {
    id: 'a',
    wing: 'rgba(180,160,230,0.72)',
    vein: 'rgba(120,90,180,0.45)',
    start: { x: -15, y: 60 },
    cp1: { x: 10, y: 20 },
    cp2: { x: 30, y: 55 },
    end: { x: 42, y: 47 },
    rest: { x: 42, y: 44 },
  },
  {
    id: 'b',
    wing: 'rgba(240,185,145,0.72)',
    vein: 'rgba(180,120,80,0.45)',
    start: { x: 110, y: 70 },
    cp1: { x: 75, y: 30 },
    cp2: { x: 60, y: 65 },
    end: { x: 52, y: 48 },
    rest: { x: 58, y: 44 },
  },
  {
    id: 'c',
    wing: 'rgba(155,220,185,0.72)',
    vein: 'rgba(80,160,110,0.45)',
    start: { x: -10, y: 15 },
    cp1: { x: 25, y: 10 },
    cp2: { x: 45, y: 35 },
    end: { x: 48, y: 43 },
    rest: { x: 50, y: 38 },
  },
]

function bezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

const Butterfly = ({
  wing,
  vein,
  flapDur,
}: {
  wing: string
  vein: string
  flapDur: number
}) => (
  <svg
    width={80}
    height={60}
    viewBox="-40 -30 80 60"
    style={{ overflow: 'visible', perspective: '200px' }}
  >
    {/* Body */}
    <ellipse cx="0" cy="0" rx="2" ry="14" fill="#6A4030" />
    <circle cx="0" cy="-12" r="2.5" fill="#3a2820" />
    <path
      d="M0 -12 Q-2 -16 -4 -18"
      stroke="#3a2820"
      strokeWidth="0.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M0 -12 Q2 -16 4 -18"
      stroke="#3a2820"
      strokeWidth="0.6"
      fill="none"
      strokeLinecap="round"
    />

    {/* Upper Left */}
    <g
      style={{
        transformOrigin: '0px 0px',
        animation: `hm-bf-flap-up ${flapDur}s ease-in-out infinite`,
      }}
    >
      <path
        d="M 0,-2 C -34,-26 -38,-2 -28,12 C -16,18 -4,8 0,-2 Z"
        fill={wing}
        stroke={vein}
        strokeWidth="0.5"
      />
      <path
        d="M -4,0 Q -16,-8 -28,-6 M -4,2 Q -18,2 -26,8 M -4,4 Q -14,8 -20,12"
        stroke={vein}
        strokeWidth="0.4"
        fill="none"
      />
    </g>

    {/* Upper Right */}
    <g
      style={{
        transformOrigin: '0px 0px',
        animation: `hm-bf-flap-up ${flapDur}s ease-in-out infinite`,
      }}
    >
      <path
        d="M 0,-2 C 34,-26 38,-2 28,12 C 16,18 4,8 0,-2 Z"
        fill={wing}
        stroke={vein}
        strokeWidth="0.5"
      />
      <path
        d="M 4,0 Q 16,-8 28,-6 M 4,2 Q 18,2 26,8 M 4,4 Q 14,8 20,12"
        stroke={vein}
        strokeWidth="0.4"
        fill="none"
      />
    </g>

    {/* Lower Left */}
    <g
      style={{
        transformOrigin: '0px 6px',
        animation: `hm-bf-flap-low ${flapDur + 0.06}s ease-in-out infinite`,
      }}
    >
      <path
        d="M 0,6 C -22,8 -26,22 -14,24 C -4,24 0,16 0,6 Z"
        fill={wing}
        opacity={0.85}
        stroke={vein}
        strokeWidth="0.5"
      />
      <path
        d="M -3,9 Q -12,12 -16,18"
        stroke={vein}
        strokeWidth="0.4"
        fill="none"
      />
    </g>

    {/* Lower Right */}
    <g
      style={{
        transformOrigin: '0px 6px',
        animation: `hm-bf-flap-low ${flapDur + 0.06}s ease-in-out infinite`,
      }}
    >
      <path
        d="M 0,6 C 22,8 26,22 14,24 C 4,24 0,16 0,6 Z"
        fill={wing}
        opacity={0.85}
        stroke={vein}
        strokeWidth="0.5"
      />
      <path
        d="M 3,9 Q 12,12 16,18"
        stroke={vein}
        strokeWidth="0.4"
        fill="none"
      />
    </g>
  </svg>
)

type Phase = 'approach' | 'arrived' | 'opened' | 'leaving'

export default function ButterflyParallax() {
  const [phase, setPhase] = useState<Phase>('approach')
  const [t, setT] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const messageShownRef = useRef(false)

  // Approach RAF
  useEffect(() => {
    if (phase !== 'approach') return
    const start = performance.now()
    const duration = 2200
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setT(eased)
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setPhase('arrived')
        setTimeout(() => setShowHint(true), 900)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  // After letter opens, butterflies leave after 4s
  useEffect(() => {
    if (phase !== 'opened') return
    const tm = setTimeout(() => setPhase('leaving'), 4000)
    return () => clearTimeout(tm)
  }, [phase])

  const handleEnvelopeClick = () => {
    if (phase !== 'arrived') return
    setPhase('opened')
    setShowHint(false)
    if (!messageShownRef.current) {
      messageShownRef.current = true
      setTimeout(() => showHMMessage(getNextMessage()), 1100)
    }
  }

  return (
    <FeatureOverlay background="#1a2a18">
      {/* Blurred garden background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/home-mode/garden_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          filter: 'blur(3px) brightness(0.7)',
          transform: 'scale(1.05)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(200,230,200,0.15)',
          pointerEvents: 'none',
        }}
      />

      {/* Butterflies */}
      {BUTTERFLIES.map((b) => {
        let posX: number
        let posY: number
        let flapDur = 0.5
        let opacity = 1
        let translateY = 0

        if (phase === 'approach') {
          flapDur = 0.28
          posX = bezier(t, b.start.x, b.cp1.x, b.cp2.x, b.end.x)
          posY = bezier(t, b.start.y, b.cp1.y, b.cp2.y, b.end.y)
        } else {
          posX = b.rest.x
          posY = b.rest.y
          if (phase === 'leaving') {
            translateY = -200
            opacity = 0
          }
        }

        return (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: `${posX}vw`,
              top: `${posY}vh`,
              transform: `translate(-50%, -50%) translateY(${translateY}px)`,
              opacity,
              transition:
                phase === 'leaving'
                  ? `transform 2500ms ease-out ${
                      b.id === 'a' ? 0 : b.id === 'b' ? 400 : 800
                    }ms, opacity 2500ms ease-out ${
                      b.id === 'a' ? 0 : b.id === 'b' ? 400 : 800
                    }ms`
                  : phase === 'arrived' || phase === 'opened'
                  ? 'left 600ms ease, top 600ms ease'
                  : undefined,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <Butterfly wing={b.wing} vein={b.vein} flapDur={flapDur} />
          </div>
        )
      })}

      {/* Envelope + Letter */}
      {phase !== 'approach' && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 20,
            perspective: '800px',
          }}
        >
          <div
            onClick={handleEnvelopeClick}
            style={{
              position: 'relative',
              width: 180,
              height: 130,
              cursor: phase === 'arrived' ? 'pointer' : 'default',
              animation: 'hm-pop-in 600ms cubic-bezier(0.34, 1.4, 0.64, 1)',
            }}
          >
            {/* Envelope body */}
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(160deg, #FEF8F2, #F9EFE4)',
                border: '1.5px solid #E0C8A8',
                borderRadius: 6,
                boxShadow:
                  '0 12px 40px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.15)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, transparent 49.5%, #E8D5B8 49.5%, #E8D5B8 50.5%, transparent 50.5%), linear-gradient(225deg, transparent 49.5%, #E8D5B8 49.5%, #E8D5B8 50.5%, transparent 50.5%)',
                  opacity: 0.4,
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Wax seal */}
            <div
              style={{
                position: 'absolute',
                top: 42,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 40% 35%, #E87090, #C84060)',
                color: 'white',
                fontSize: 14,
                lineHeight: '28px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(180,40,80,0.4)',
                zIndex: 2,
                opacity: phase === 'opened' || phase === 'leaving' ? 0 : 1,
                transition: 'opacity 300ms ease',
              }}
            >
              ♡
            </div>

            {/* Flap (rotates open) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 65,
                background: 'linear-gradient(180deg, #F5EAD8, #EDD9BB)',
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                borderBottom: '1px solid #D4B888',
                transformOrigin: 'top center',
                transform:
                  phase === 'opened' || phase === 'leaving'
                    ? 'rotateX(-180deg)'
                    : 'rotateX(0deg)',
                transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 3,
              }}
            />

            {/* Letter — slides up out of envelope */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 240,
                maxHeight:
                  phase === 'opened' || phase === 'leaving' ? 460 : 0,
                overflow: 'hidden',
                opacity: phase === 'opened' || phase === 'leaving' ? 1 : 0,
                transform:
                  phase === 'opened' || phase === 'leaving'
                    ? 'translate(-50%, -110%)'
                    : 'translate(-50%, 30px)',
                transition:
                  'max-height 700ms cubic-bezier(0.4,0,0.2,1) 200ms, opacity 400ms ease 200ms, transform 600ms cubic-bezier(0.34,1.2,0.64,1) 200ms',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  background: '#FFFDF8',
                  border: '1px solid #E8DCC8',
                  borderRadius: 4,
                  padding: '24px 22px 20px',
                  boxShadow:
                    '0 -4px 20px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.2)',
                  backgroundImage:
                    'repeating-linear-gradient(transparent, transparent 27px, rgba(180,160,130,0.12) 27px, rgba(180,160,130,0.12) 28px)',
                  backgroundSize: '100% 28px',
                  backgroundPosition: '0 8px',
                  fontFamily: "'Dancing Script', cursive",
                  color: '#3A2820',
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: 1.85,
                    margin: 0,
                  }}
                >
                  you wandered here,
                  <br />
                  so i sent these three
                  <br />
                  to find you.
                  <br />
                  <br />
                  they said you looked
                  <br />
                  like someone who needed
                  <br />
                  to know they are loved.
                  <br />
                  <br />
                  they were right.
                </p>
                <p
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 17,
                    fontWeight: 600,
                    color: '#C84060',
                    textAlign: 'right',
                    marginTop: 12,
                    paddingRight: 8,
                  }}
                >
                  — always ♡
                </p>
              </div>
            </div>
          </div>

          {showHint && phase === 'arrived' && (
            <div
              style={{
                marginTop: 16,
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 13,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.08em',
                animation: 'hm-hint-pulse 1.8s ease-in-out infinite',
                pointerEvents: 'none',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              open it ✦
            </div>
          )}
        </div>
      )}
    </FeatureOverlay>
  )
}
