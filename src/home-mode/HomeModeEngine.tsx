import { useState, useMemo, useCallback } from 'react'
import { useHomeMode, type Scene } from './useHomeMode'
import { Character } from './components/Character'
import { PhotoPopup } from './components/PhotoPopup'
import { InteractPrompt } from './components/InteractPrompt'
import { SceneTransition } from './components/SceneTransition'
import { EntranceScene, BedroomScene, KitchenScene, GardenScene } from './scenes/Scenes'
import { interactions } from './data/interactions'

const bgMap: Record<Scene, string> = {
  entrance: '/home-mode/entrance_bg.png',
  bedroom: '/home-mode/bedroom_bg.png',
  kitchen: '/home-mode/kitchen_bg.png',
  garden: '/home-mode/garden_bg.png',
}

function Particles({ scene }: { scene: Scene }) {
  const count = scene === 'garden' ? 18 : scene === 'bedroom' ? 8 : 12
  const particles = useMemo(() => {
    const colors = ['rgba(255,200,220,0.4)', 'rgba(210,190,255,0.4)', 'rgba(255,230,180,0.4)']
    if (scene === 'garden') colors.push('rgba(200,232,208,0.4)')
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 85,
      size: 4 + Math.random() * 4,
      color: colors[i % colors.length],
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 6,
      drift: -30 + Math.random() * 60,
    }))
  }, [scene, count])

  return (
    <>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.left}%`,
          bottom: 0,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: p.color,
          // @ts-ignore
          '--drift': `${p.drift}px`,
          animation: `hm-particle-float ${p.duration}s linear infinite`,
          animationDelay: `${p.delay}s`,
          pointerEvents: 'none',
          zIndex: 1,
        } as React.CSSProperties} />
      ))}
      {scene === 'kitchen' && [0, 0.8, 1.6].map((d, i) => (
        <div key={`steam-${i}`} style={{
          position: 'absolute',
          left: '75%',
          bottom: '40%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.35)',
          animation: `hm-steam 2.5s ease-out infinite`,
          animationDelay: `${d}s`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      ))}
    </>
  )
}

export default function HomeModeEngine() {
  const { currentScene } = useHomeMode()
  const [nearObjectId, setNearObjectId] = useState<string | null>(null)

  const handleNearObject = useCallback((id: string | null) => {
    setNearObjectId(id)
  }, [])

  const nearObj = nearObjectId ? interactions.find(o => o.id === nearObjectId) : null

  const SceneComponent = {
    entrance: EntranceScene,
    bedroom: BedroomScene,
    kitchen: KitchenScene,
    garden: GardenScene,
  }[currentScene]

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bgMap[currentScene]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        transition: 'opacity 400ms ease',
      }} />

      {/* Particles */}
      <Particles scene={currentScene} />

      {/* Interactive objects */}
      <SceneComponent nearObjectId={nearObjectId} />

      {/* Character */}
      <Character onNearObject={handleNearObject} nearObjectId={nearObjectId} />

      {/* Interact Prompt */}
      {nearObj && !nearObj.navigatesTo && (
        <InteractPrompt
          label={nearObj.label}
          x={nearObj.xPercent}
          y={nearObj.yPercent}
          fromBottom={nearObj.fromBottom}
        />
      )}

      {/* Scene Transition overlay */}
      <SceneTransition />

      {/* Photo Popup */}
      <PhotoPopup />

      {/* Back button (not on entrance) */}
      {currentScene !== 'entrance' && (
        <BackButton />
      )}

      <style>{`
        @keyframes hm-glow-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes hm-particle-float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(-40vh) translateX(var(--drift)) rotate(120deg); }
          90% { opacity: 0.4; }
          100% { transform: translateY(-90vh) translateX(calc(var(--drift, 0px) * -0.3)) rotate(240deg); opacity: 0; }
        }
        @keyframes hm-steam {
          0% { transform: translateY(0); opacity: 0.4; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function BackButton() {
  const { setScene, setTransitioning } = useHomeMode()
  const goBack = () => {
    setTransitioning(true)
    setTimeout(() => {
      setScene('entrance')
      setTimeout(() => setTransitioning(false), 300)
    }, 300)
  }
  return (
    <button
      onClick={goBack}
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
        fontSize: 14,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 100,
        padding: '8px 16px',
        color: 'white',
        cursor: 'pointer',
        zIndex: 20,
      }}
    >
      ← home
    </button>
  )
}
