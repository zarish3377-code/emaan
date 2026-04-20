import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useHomeMode } from './useHomeMode'
import HomeModeEngine from './HomeModeEngine'

function getOrCreatePortalRoot() {
  let el = document.getElementById('hm-root')
  if (!el) {
    el = document.createElement('div')
    el.id = 'hm-root'
    document.body.appendChild(el)
  }
  return el
}

const HM_FONTS_ID = 'hm-fonts-link'
function ensureFonts() {
  if (document.getElementById(HM_FONTS_ID)) return
  const l = document.createElement('link')
  l.id = HM_FONTS_ID
  l.rel = 'stylesheet'
  l.href =
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,300;1,400&family=DM+Sans:wght@300&display=swap'
  document.head.appendChild(l)
}

const HM_GLOBAL_CSS = `
@keyframes hm-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes hm-pop-in {
  0% { transform: scale(0.85); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes hm-btn-enter {
  0% { transform: translate(-50%, -50%) translateY(20px) scale(0.5); opacity: 0; }
  100% { transform: translate(-50%, -50%) translateY(0) scale(1); opacity: 1; }
}
@keyframes hm-btn-float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(0deg); }
  25% { transform: translate(-50%, -50%) translateY(calc(-1 * var(--hm-float-amp, 10px))) rotate(0.6deg); }
  75% { transform: translate(-50%, -50%) translateY(calc(-0.4 * var(--hm-float-amp, 10px))) rotate(-0.4deg); }
}
@keyframes hm-particle-rise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.5; }
  50% { transform: translateY(-50vh) translateX(var(--hm-p-drift, 0px)); }
  90% { opacity: 0.3; }
  100% { transform: translateY(-100vh) translateX(calc(var(--hm-p-drift, 0px) * -0.5)); opacity: 0; }
}
@keyframes hm-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.92; }
  50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
}
@keyframes hm-flap {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.18); }
}
@keyframes hm-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
@keyframes hm-bloom {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes hm-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes hm-wish {
  0% { opacity: 0; transform: translate(-50%, -50%) translateY(10px); }
  20%, 70% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
  100% { opacity: 0; transform: translate(-50%, -50%) translateY(-10px); }
}
.hm-room-btn:hover {
  transform: translate(-50%, -50%) scale(1.1) translateY(-3px) !important;
  z-index: 20;
}
.hm-room-btn:active {
  transform: translate(-50%, -50%) scale(0.96) !important;
}
.hm-toggle:hover {
  transform: scale(1.05) translateY(-2px);
}
`

let injected = false
function injectGlobalCss() {
  if (injected) return
  injected = true
  const s = document.createElement('style')
  s.id = 'hm-global-css'
  s.textContent = HM_GLOBAL_CSS
  document.head.appendChild(s)
}

export default function HomeMode() {
  const { isActive } = useHomeMode()
  const [mounted, setMounted] = useState(false)
  const [overlayOpacity, setOverlayOpacity] = useState(0)
  const prevActive = useRef(false)

  useEffect(() => {
    ensureFonts()
    injectGlobalCss()
  }, [])

  useEffect(() => {
    const siteRoot = document.getElementById('root')
    if (!siteRoot) return

    if (isActive && !prevActive.current) {
      siteRoot.style.transition = 'opacity 500ms ease, filter 500ms ease'
      siteRoot.style.opacity = '0'
      siteRoot.style.filter = 'blur(3px)'
      setTimeout(() => {
        setMounted(true)
        requestAnimationFrame(() => setOverlayOpacity(1))
      }, 480)
    }

    if (!isActive && prevActive.current) {
      setOverlayOpacity(0)
      setTimeout(() => {
        setMounted(false)
        siteRoot.style.transition = 'opacity 400ms ease, filter 400ms ease'
        siteRoot.style.opacity = '1'
        siteRoot.style.filter = ''
      }, 400)
    }

    prevActive.current = isActive
  }, [isActive])

  if (!mounted) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        opacity: overlayOpacity,
        transition: 'opacity 500ms ease',
        background: '#0a0514',
      }}
    >
      <HomeModeEngine />
    </div>,
    getOrCreatePortalRoot()
  )
}
