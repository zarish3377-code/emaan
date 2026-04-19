import { useHomeMode, FeatureKey } from './useHomeMode'
import { IconClose } from './icons'

const TITLES: Record<FeatureKey, string> = {
  'particle-heart': 'particle heart',
  fireworks: 'fireworks',
  'crystal-heart': 'our song',
  'canvas-pulse': 'pulse',
  'flower-bloom': 'bloom',
  'falling-hearts': 'falling hearts',
  'particle-field': 'stardust',
  'butterfly-parallax': 'butterflies',
  'night-sky': 'night sky',
}

export default function FeaturePlaceholder() {
  const { activeFeature, closeFeature } = useHomeMode()
  if (!activeFeature) return null

  const title = TITLES[activeFeature]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99995,
        background:
          'radial-gradient(ellipse at center, rgba(40,15,40,0.97), rgba(10,5,20,0.98))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'hm-fade-in 360ms ease',
      }}
    >
      <button
        type="button"
        onClick={closeFeature}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 200ms, background 200ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
        }}
      >
        <IconClose />
      </button>

      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(2rem, 5vw, 3.4rem)',
          color: 'rgba(255,225,235,0.95)',
          textShadow: '0 4px 24px rgba(232,112,144,0.4)',
          letterSpacing: '0.02em',
          marginBottom: 18,
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'rgba(255,225,235,0.75)',
          textAlign: 'center',
          maxWidth: 380,
          padding: '0 32px',
          lineHeight: 1.5,
        }}
      >
        coming very soon, my love
        <br />
        <span style={{ opacity: 0.6, fontSize: '0.85em' }}>
          ✨ this little world is still being painted ✨
        </span>
      </div>
    </div>
  )
}
