import { ReactNode } from 'react'
import { IconClose } from '../icons'
import { useHomeMode } from '../useHomeMode'

interface Props {
  background?: string
  children: ReactNode
}

export default function FeatureOverlay({ background, children }: Props) {
  const { closeFeature } = useHomeMode()
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99995,
        background:
          background ??
          'radial-gradient(ellipse at center, rgba(40,15,40,0.97), rgba(10,5,20,0.98))',
        overflow: 'hidden',
        animation: 'hm-fade-in 360ms ease',
      }}
    >
      {children}
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
          zIndex: 10,
        }}
      >
        <IconClose />
      </button>
    </div>
  )
}

export const featureCaption: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: 'italic',
  color: 'rgba(255,235,240,0.9)',
  textAlign: 'center',
  pointerEvents: 'none',
  textShadow: '0 2px 16px rgba(0,0,0,0.6)',
  padding: '0 24px',
  maxWidth: 600,
}
