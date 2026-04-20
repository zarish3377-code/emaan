import { useEffect, useState } from 'react'
import { useHomeMode } from './useHomeMode'

export default function PhotoPopup() {
  const { activePopup, hidePopup } = useHomeMode()
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    if (!activePopup) {
      setLightbox(false)
      return
    }
    const t = setTimeout(() => {
      if (!lightbox) hidePopup()
    }, 12000)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (lightbox) setLightbox(false)
      else hidePopup()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [activePopup, hidePopup, lightbox])

  if (!activePopup) return null

  return (
    <>
      <div
        onClick={hidePopup}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99990,
          background: 'rgba(10,5,20,0.6)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'hm-fade-in 240ms ease',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(255,252,248,0.97)',
            borderRadius: 22,
            overflow: 'hidden',
            maxWidth: 'min(360px, 88vw)',
            boxShadow:
              '0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.5) inset',
            animation: 'hm-pop-in 320ms cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        >
          <div
            className="hm-photo-wrap"
            onClick={() => setLightbox(true)}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 3',
              cursor: 'zoom-in',
              overflow: 'hidden',
            }}
          >
            <img
              src={activePopup.photo}
              alt=""
              className="hm-photo-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
                transition: 'filter 200ms ease',
              }}
            />
            <div
              className="hm-photo-zoom"
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                fontSize: 12,
                opacity: 0.6,
                transition: 'opacity 200ms ease',
                background: 'rgba(0,0,0,0.35)',
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                pointerEvents: 'none',
              }}
            >
              🔍
            </div>
          </div>

          <div
            style={{
              padding: '18px 26px 22px',
              background: 'rgba(255,252,248,0.97)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: '#3A2A2E',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {activePopup.message}
            </p>
            <div
              style={{
                width: 36,
                height: 1,
                background: 'rgba(200,160,170,0.35)',
                margin: '12px auto 0',
              }}
            />
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(140,110,120,0.45)',
                margin: '10px 0 0',
              }}
            >
              tap photo to enlarge · esc to close
            </p>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            animation: 'hm-fade-in 250ms ease',
          }}
        >
          <img
            src={activePopup.photo}
            alt=""
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: 12,
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              animation:
                'hm-lightbox-in 250ms cubic-bezier(0.34, 1.4, 0.64, 1)',
            }}
          />
        </div>
      )}
    </>
  )
}
