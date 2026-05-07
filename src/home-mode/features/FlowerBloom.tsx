import { useEffect, useState } from 'react'
import FeatureOverlay from './FeatureOverlay'
import { getNextMessage, showHMMessage } from '../messages'

export default function FlowerBloom() {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 7000)
    return () => clearTimeout(t)
  }, [])

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    showHMMessage(getNextMessage(), { x: e.clientX, y: e.clientY })
  }

  return (
    <FeatureOverlay background="#131b21">
      <iframe
        src="/flower-bloom/index.html"
        title="Flowers Animation"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          background: '#131b21',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Click-anywhere catcher (above iframe so clicks trigger messages) */}
      <div
        onClick={handleSceneClick}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          cursor: 'pointer',
        }}
      />

      {showText && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '6%',
            transform: 'translateX(-50%)',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.4rem',
            color: '#FCE4EC',
            textAlign: 'center',
            maxWidth: 420,
            padding: '0 24px',
            textShadow: '0 2px 16px rgba(0,0,0,0.6)',
            opacity: 0,
            animation: 'hm-welcome-line 800ms cubic-bezier(0.34,1.4,0.64,1) forwards',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          you're the most in-bloom person i know
        </div>
      )}
    </FeatureOverlay>
  )
}
