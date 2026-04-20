import { useEffect, useState } from 'react'
import { useHomeMode, ROOM_BG } from './useHomeMode'
import Hub from './Hub'
import RoomScene from './RoomScene'
import Particles from './Particles'
import PhotoPopup from './PhotoPopup'
import FeaturePlaceholder from './FeaturePlaceholder'
import DockedHubButtons from './DockedHubButtons'

const HUB_BG = '/home-mode/entrance_bg.png'

export default function HomeModeEngine() {
  const { view } = useHomeMode()
  const bg = view === 'hub' ? HUB_BG : ROOM_BG[view]

  const [currentBg, setCurrentBg] = useState(bg)
  const [prevBg, setPrevBg] = useState<string | null>(null)
  const [prevOpacity, setPrevOpacity] = useState(0)

  useEffect(() => {
    if (bg === currentBg) return
    setPrevBg(currentBg)
    setPrevOpacity(1)
    setCurrentBg(bg)
    const t1 = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPrevOpacity(0))
    )
    const t2 = setTimeout(() => setPrevBg(null), 600)
    return () => {
      cancelAnimationFrame(t1)
      clearTimeout(t2)
    }
  }, [bg, currentBg])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        key={`bg-${currentBg}`}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${currentBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {prevBg && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${prevBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            opacity: prevOpacity,
            transition: 'opacity 500ms ease',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(10,5,20,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />

      <Particles />

      {view === 'hub' ? <Hub /> : <RoomScene room={view} />}

      <DockedHubButtons />
      <PhotoPopup />
      <FeaturePlaceholder />
    </div>
  )
}
