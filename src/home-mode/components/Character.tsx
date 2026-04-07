import { useEffect, useRef, useState, useCallback } from 'react'
import { interactions } from '../data/interactions'
import { useHomeMode } from '../useHomeMode'

interface CharacterProps {
  onNearObject: (id: string | null) => void
  nearObjectId: string | null
}

export function Character({ onNearObject, nearObjectId }: CharacterProps) {
  const { currentScene, isActive, showPopup, setScene, setTransitioning, isTransitioning } = useHomeMode()
  const [x, setX] = useState(50) // percent
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [isWalking, setIsWalking] = useState(false)
  const keysRef = useRef<Set<string>>(new Set())
  const rafRef = useRef<number>(0)
  const xRef = useRef(50)

  // Reset position on scene change
  useEffect(() => {
    xRef.current = 50
    setX(50)
  }, [currentScene])

  const handleInteract = useCallback(() => {
    if (!nearObjectId || isTransitioning) return
    const obj = interactions.find(o => o.id === nearObjectId)
    if (!obj) return
    if (obj.navigatesTo) {
      setTransitioning(true)
      setTimeout(() => {
        setScene(obj.navigatesTo!)
        setTimeout(() => setTransitioning(false), 300)
      }, 300)
    } else if (obj.photo) {
      showPopup(obj.photo, obj.message)
    }
  }, [nearObjectId, isTransitioning, setScene, setTransitioning, showPopup])

  useEffect(() => {
    if (!isActive) return

    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase())
      if (e.key.toLowerCase() === 'e') handleInteract()
    }
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase())

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      keysRef.current.clear()
    }
  }, [isActive, handleInteract])

  // Movement loop
  useEffect(() => {
    if (!isActive) return
    const speed = 0.25 // percent per frame

    const loop = () => {
      const keys = keysRef.current
      let moving = false
      if (keys.has('arrowleft') || keys.has('a')) {
        xRef.current = Math.max(5, xRef.current - speed)
        setDirection('left')
        moving = true
      }
      if (keys.has('arrowright') || keys.has('d')) {
        xRef.current = Math.min(95, xRef.current + speed)
        setDirection('right')
        moving = true
      }
      setIsWalking(moving)
      setX(xRef.current)

      // Proximity check
      const sceneObjs = interactions.filter(o => o.scene === currentScene)
      let nearest: string | null = null
      let minDist = 999
      for (const obj of sceneObjs) {
        const dist = Math.abs(xRef.current - obj.xPercent)
        if (dist < 8 && dist < minDist) {
          minDist = dist
          nearest = obj.id
        }
      }
      onNearObject(nearest)

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, currentScene, onNearObject])

  // Mobile controls
  const startMove = (dir: 'left' | 'right') => {
    keysRef.current.add(dir === 'left' ? 'arrowleft' : 'arrowright')
    setDirection(dir)
  }
  const stopMove = (dir: 'left' | 'right') => {
    keysRef.current.delete(dir === 'left' ? 'arrowleft' : 'arrowright')
  }

  return (
    <>
      <img
        src="/home-mode/character.png"
        alt=""
        style={{
          position: 'absolute',
          left: `${x}%`,
          bottom: '28%',
          width: 72,
          height: 'auto',
          transform: `translateX(-50%) scaleX(${direction === 'left' ? -1 : 1})`,
          zIndex: 10,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          animation: isWalking ? 'hm-char-walk 400ms linear infinite' : 'none',
        }}
      />

      {/* Mobile D-pad */}
      <div className="hm-dpad" style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        display: 'flex',
        gap: 4,
        zIndex: 99998,
      }}>
        <button
          className="hm-dpad-btn"
          onTouchStart={() => startMove('left')}
          onTouchEnd={() => stopMove('left')}
          onMouseDown={() => startMove('left')}
          onMouseUp={() => stopMove('left')}
          onMouseLeave={() => stopMove('left')}
          style={dpadStyle}
        >
          ←
        </button>
        <button
          className="hm-dpad-btn"
          onTouchStart={() => startMove('right')}
          onTouchEnd={() => stopMove('right')}
          onMouseDown={() => startMove('right')}
          onMouseUp={() => stopMove('right')}
          onMouseLeave={() => stopMove('right')}
          style={dpadStyle}
        >
          →
        </button>
        <button
          className="hm-dpad-btn"
          onClick={handleInteract}
          style={{ ...dpadStyle, marginLeft: 8, fontFamily: "'Cormorant Garamond', serif", fontSize: 14 }}
        >
          E
        </button>
      </div>

      <style>{`
        @keyframes hm-char-walk {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          25% { transform: translateX(-50%) translateY(-3px); }
          75% { transform: translateX(-50%) translateY(-3px); }
        }
        @media (min-width: 641px) {
          .hm-dpad { display: none !important; }
        }
      `}</style>
    </>
  )
}

const dpadStyle: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 12,
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255,255,255,0.25)',
  color: 'white',
  fontSize: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}
