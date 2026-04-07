import { useEffect, useRef, useState } from 'react'
import { useHomeMode } from '../useHomeMode'

export function PhotoPopup() {
  const { activePopup, hidePopup } = useHomeMode()
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const timerRef = useRef<number>(0)

  useEffect(() => {
    if (activePopup) {
      setVisible(true)
      setClosing(false)
      timerRef.current = window.setTimeout(() => dismiss(), 8000)
    }
    return () => clearTimeout(timerRef.current)
  }, [activePopup])

  useEffect(() => {
    if (!activePopup) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activePopup])

  const dismiss = () => {
    setClosing(true)
    clearTimeout(timerRef.current)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
      hidePopup()
    }, 240)
  }

  if (!activePopup || !visible) return null

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,5,20,0.55)',
        backdropFilter: 'blur(8px)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: closing ? 'hm-popup-fade-out 240ms ease-in forwards' : 'hm-popup-fade-in 320ms ease forwards',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(255,252,248,0.97)',
          borderRadius: 20,
          overflow: 'hidden',
          maxWidth: 'min(380px, 88vw)',
          width: '100%',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.6) inset',
          animation: closing
            ? 'hm-card-out 240ms ease-in forwards'
            : 'hm-card-in 320ms cubic-bezier(0.34,1.4,0.64,1) forwards',
        }}
      >
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#F5EBE8', position: 'relative' }}>
          <img
            src={`/home-mode/photos/${activePopup.photo}`}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
            background: 'linear-gradient(transparent, rgba(255,252,248,0.6))',
          }} />
        </div>
        <div style={{ padding: '20px 28px 24px', textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#3A2A2E',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
            margin: 0,
          }}>
            {activePopup.message}
          </p>
          <div style={{
            width: 40, height: 1,
            background: 'rgba(200,160,170,0.4)',
            margin: '12px auto 0',
          }} />
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(140,110,120,0.5)',
            marginTop: 10,
          }}>
            tap anywhere to close
          </p>
        </div>
      </div>

      <style>{`
        @keyframes hm-popup-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hm-popup-fade-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes hm-card-in { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes hm-card-out { from { transform: scale(1); opacity: 0.99; } to { transform: scale(0.94); opacity: 0; } }
      `}</style>
    </div>
  )
}
