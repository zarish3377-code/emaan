import { useEffect, useState } from 'react'
import FeatureOverlay from './FeatureOverlay'

interface BfDef {
  id: string
  wing: string
  vein: string
  startX: number
  startY: number
  cp1X: number
  cp1Y: number
  cp2X: number
  cp2Y: number
  endX: number
  endY: number
}

function cubic(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t
  return (
    u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  )
}

const BUTTERFLIES: BfDef[] = [
  {
    id: 'a',
    wing: 'rgba(180,160,230,0.78)',
    vein: 'rgba(120,100,180,0.55)',
    startX: -10,
    startY: 30,
    cp1X: 25,
    cp1Y: 10,
    cp2X: 35,
    cp2Y: 60,
    endX: 42,
    endY: 48,
  },
  {
    id: 'b',
    wing: 'rgba(240,180,140,0.78)',
    vein: 'rgba(180,110,80,0.55)',
    startX: 110,
    startY: 25,
    cp1X: 75,
    cp1Y: 70,
    cp2X: 60,
    cp2Y: 30,
    endX: 58,
    endY: 48,
  },
  {
    id: 'c',
    wing: 'rgba(160,220,190,0.78)',
    vein: 'rgba(80,150,120,0.55)',
    startX: -5,
    startY: 75,
    cp1X: 40,
    cp1Y: 90,
    cp2X: 40,
    cp2Y: 35,
    endX: 50,
    endY: 60,
  },
]

const RESTING_POSITIONS = [
  { x: 42, y: 44 },
  { x: 58, y: 44 },
  { x: 50, y: 60 },
]

const Butterfly = ({
  wing,
  vein,
  flapDur = 0.5,
}: {
  wing: string
  vein: string
  flapDur?: number
}) => (
  <svg
    width={70}
    height={50}
    viewBox="0 0 70 50"
    style={{ overflow: 'visible' }}
  >
    <ellipse cx="35" cy="25" rx="1.6" ry="11" fill="#3a2a2e" />
    <circle cx="35" cy="14" r="2.2" fill="#2a1a1e" />
    <path
      d="M35 13 Q33 8 30 6"
      stroke="#2a1a1e"
      strokeWidth="0.7"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M35 13 Q37 8 40 6"
      stroke="#2a1a1e"
      strokeWidth="0.7"
      fill="none"
      strokeLinecap="round"
    />
    {/* Upper L */}
    <g
      style={{
        transformOrigin: '34px 22px',
        transformBox: 'fill-box',
        animation: `hm-bf-flap-up ${flapDur}s ease-in-out infinite`,
      }}
    >
      <ellipse cx="22" cy="18" rx="13" ry="10" fill={wing} />
      <path
        d="M22 18 Q15 15 12 12 M22 18 Q14 19 11 22 M22 18 Q18 14 17 11"
        stroke={vein}
        strokeWidth="0.6"
        fill="none"
      />
    </g>
    {/* Upper R */}
    <g
      style={{
        transformOrigin: '36px 22px',
        transformBox: 'fill-box',
        animation: `hm-bf-flap-up ${flapDur}s ease-in-out infinite`,
      }}
    >
      <ellipse cx="48" cy="18" rx="13" ry="10" fill={wing} />
      <path
        d="M48 18 Q55 15 58 12 M48 18 Q56 19 59 22 M48 18 Q52 14 53 11"
        stroke={vein}
        strokeWidth="0.6"
        fill="none"
      />
    </g>
    {/* Lower L */}
    <g
      style={{
        transformOrigin: '34px 30px',
        transformBox: 'fill-box',
        animation: `hm-bf-flap-low ${flapDur + 0.08}s ease-in-out infinite`,
      }}
    >
      <ellipse cx="26" cy="34" rx="9" ry="7" fill={wing} opacity={0.85} />
      <path
        d="M26 34 Q20 36 18 39 M26 34 Q23 39 22 41"
        stroke={vein}
        strokeWidth="0.5"
        fill="none"
      />
    </g>
    {/* Lower R */}
    <g
      style={{
        transformOrigin: '36px 30px',
        transformBox: 'fill-box',
        animation: `hm-bf-flap-low ${flapDur + 0.08}s ease-in-out infinite`,
      }}
    >
      <ellipse cx="44" cy="34" rx="9" ry="7" fill={wing} opacity={0.85} />
      <path
        d="M44 34 Q50 36 52 39 M44 34 Q47 39 48 41"
        stroke={vein}
        strokeWidth="0.5"
        fill="none"
      />
    </g>
  </svg>
)

export default function ButterflyParallax() {
  const [phase, setPhase] = useState<
    'approach' | 'arrived' | 'opened' | 'leaving'
  >('approach')
  const [t, setT] = useState(0)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (phase !== 'approach') return
    const start = performance.now()
    const duration = 2500
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 2)
      setT(eased)
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setPhase('arrived')
        setTimeout(() => setShowHint(true), 1000)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  useEffect(() => {
    if (phase !== 'opened') return
    const tm = setTimeout(() => setPhase('leaving'), 8000)
    return () => clearTimeout(tm)
  }, [phase])

  return (
    <FeatureOverlay background="#1a2a18">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/home-mode/garden_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.85)',
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

      {BUTTERFLIES.map((b, i) => {
        let posX: number
        let posY: number
        let flapDur = 0.5
        let opacity = 1
        let scale = 1
        let translateY = 0

        if (phase === 'approach') {
          flapDur = 0.25
          posX = cubic(t, b.startX, b.cp1X, b.cp2X, b.endX)
          posY = cubic(t, b.startY, b.cp1Y, b.cp2Y, b.endY)
        } else {
          posX = RESTING_POSITIONS[i].x
          posY = RESTING_POSITIONS[i].y
          if (phase === 'leaving') {
            translateY = -150
            opacity = 0
            scale = 0.9
          }
        }

        return (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: `${posX}%`,
              top: `${posY}%`,
              transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
              opacity,
              transition:
                phase === 'leaving'
                  ? 'transform 3s ease-out, opacity 3s ease-out'
                  : phase === 'arrived' || phase === 'opened'
                  ? 'left 800ms ease, top 800ms ease'
                  : undefined,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <Butterfly wing={b.wing} vein={b.vein} flapDur={flapDur} />
          </div>
        )
      })}

      {phase !== 'approach' && (
        <div
          onClick={() => phase === 'arrived' && setPhase('opened')}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: phase === 'arrived' ? 'pointer' : 'default',
            zIndex: 20,
            animation: 'hm-pop-in 600ms cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        >
          <svg
            width="200"
            height="220"
            viewBox="0 0 200 220"
            style={{ overflow: 'visible' }}
          >
            {(phase === 'opened' || phase === 'leaving') && (
              <foreignObject x="22" y="-30" width="156" height="200">
                <div
                  style={{
                    width: '100%',
                    background:
                      'repeating-linear-gradient(to bottom, #fff 0, #fff 14px, rgba(0,0,0,0.04) 14px, rgba(0,0,0,0.04) 15px)',
                    borderRadius: 4,
                    boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                    padding: '14px 12px',
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 11,
                    color: '#4A3030',
                    lineHeight: 1.5,
                    textAlign: 'center',
                    animation: 'hm-pop-in 500ms ease',
                  }}
                >
                  You wandered here, so I sent these three to find you. They
                  said you looked like someone who needed to know they are
                  loved. They were right.
                  <br />
                  <strong>I LOVE YOU!!</strong>
                  <br />
                  Forever and ever.
                  <br />
                  Your smile sets my heart on fire and brightens up my life.
                  You hold the key to my heart and rule my whole world — the
                  best feeling I have ever felt.
                  <br />
                  Just another reminder of how much I love you 💐
                  <br />
                  <em>Always yours, Your Neno~</em>
                </div>
              </foreignObject>
            )}

            <rect
              x="20"
              y="90"
              width="160"
              height="110"
              rx="6"
              fill="#FEF8F0"
              stroke="#E8D0B8"
              strokeWidth="1.5"
            />
            <path
              d="M20 90 L100 145 L180 90 Z"
              fill="#FEF8F0"
              stroke="#E8D0B8"
              strokeWidth="1.5"
              style={{
                transformOrigin: '100px 90px',
                transform:
                  phase === 'opened' || phase === 'leaving'
                    ? 'rotateX(180deg) translateY(-2px)'
                    : 'rotateX(0deg)',
                transition: 'transform 400ms ease-in-out',
                transformBox: 'fill-box',
              }}
            />
            {phase === 'arrived' && (
              <g>
                <circle cx="100" cy="135" r="14" fill="#C86890" />
                <path
                  d="M100 139 c -3 -3 -6 -1 -6 2 c 0 3 6 6 6 6 s 6 -3 6 -6 c 0 -3 -3 -5 -6 -2 z"
                  fill="#A04870"
                />
              </g>
            )}
          </svg>

          {showHint && phase === 'arrived' && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 'calc(100% + 8px)',
                transform: 'translateX(-50%)',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 13,
                color: 'rgba(255,255,255,0.85)',
                whiteSpace: 'nowrap',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                animation: 'hm-pulse 1.5s ease-in-out infinite',
              }}
            >
              open it
            </div>
          )}
        </div>
      )}
    </FeatureOverlay>
  )
}
