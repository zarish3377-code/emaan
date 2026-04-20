import { ReactNode, useEffect, useState } from 'react'
import { IconClose } from '../icons'
import { useHomeMode } from '../useHomeMode'

interface Props {
  background?: string
  children: ReactNode
}

export default function FeatureOverlay({ background, children }: Props) {
  const { closeFeature } = useHomeMode()
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    if (closing) return
    setClosing(true)
    setTimeout(() => closeFeature(), 300)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        opacity: closing ? 0 : 1,
        transition: 'opacity 300ms ease',
        animation: closing ? undefined : 'hm-fade-in 360ms ease',
      }}
    >
      {children}

      {/* ← back (top-left) */}
      <button
        type="button"
        onClick={handleClose}
        className="hm-back-btn"
        style={{
          position: 'fixed',
          top: 20,
          left: 24,
          zIndex: 99999,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 100,
          padding: '8px 18px',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: '0.95rem',
          color: 'rgba(255,255,255,0.9)',
          cursor: 'pointer',
          letterSpacing: '0.04em',
          transition: 'all 200ms ease',
        }}
      >
        ← back
      </button>

      {/* × close (top-right) */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close"
        style={{
          position: 'fixed',
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
          zIndex: 99999,
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
