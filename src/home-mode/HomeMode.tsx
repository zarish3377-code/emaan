import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useHomeMode } from './useHomeMode'
import HomeModeEngine from './HomeModeEngine'
import WelcomeScene from './WelcomeScene'

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
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,300;1,400&family=Dancing+Script:wght@400;500;600&family=Caveat:wght@400;500&family=DM+Sans:wght@300&display=swap'
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
@keyframes hm-lightbox-in {
  0% { transform: scale(0.9); opacity: 0; }
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
@keyframes hm-welcome-rise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  15% { opacity: 0.8; }
  50% { transform: translateY(-15vh) translateX(var(--hm-w-drift, 20px)); opacity: 0.6; }
  100% { transform: translateY(-30vh) translateX(calc(var(--hm-w-drift, 20px) * -0.6)); opacity: 0.4; }
}
@keyframes hm-welcome-pulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.4); }
}
@keyframes hm-welcome-pulse-text {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.7; }
}
@keyframes hm-welcome-line {
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes hm-bf-flap-up {
  0%, 100% { transform: rotateY(-30deg); }
  50% { transform: rotateY(30deg); }
}
@keyframes hm-bf-flap-low {
  0%, 100% { transform: rotateY(-15deg); }
  50% { transform: rotateY(15deg); }
}
@keyframes hm-petal-bloom {
  0% { transform: rotate(var(--hm-petal-rot, 0deg)) scale(0); opacity: 0; }
  100% { transform: rotate(var(--hm-petal-rot, 0deg)) scale(1); opacity: 1; }
}
@keyframes hm-flower-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
@keyframes hm-leaf-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
@keyframes hm-petal-float {
  0% { transform: translate(0, 0) rotate(0); opacity: 1; }
  100% { transform: translate(var(--hm-pf-x, 0), -80px) rotate(180deg); opacity: 0; }
}
@keyframes hm-msg-bubble {
  0% { transform: translate(-50%, 0) scale(0.6); opacity: 0; }
  20%, 80% { transform: translate(-50%, -10px) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -20px) scale(0.95); opacity: 0; }
}
.hm-room-btn:hover {
  transform: translate(-50%, -50%) scale(1.15) translateY(-3px) !important;
  z-index: 20;
}
.hm-room-btn:active {
  transform: translate(-50%, -50%) scale(0.92) !important;
}
.hm-toggle:hover {
  transform: scale(1.05) translateY(-2px);
}
.hm-back-btn:hover {
  background: rgba(255,255,255,0.22) !important;
  transform: translateX(-2px);
}
.hm-photo-wrap:hover .hm-photo-img {
  filter: brightness(1.05);
}
.hm-photo-wrap:hover .hm-photo-zoom {
  opacity: 1 !important;
}
.hm-message-toast {
  position: fixed;
  z-index: 99995;
  max-width: min(320px, 85vw);
  padding: 14px 22px;
  background: rgba(8, 4, 18, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(200, 170, 220, 0.25);
  border-radius: 16px;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #F0E8FF;
  letter-spacing: 0.015em;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 500ms ease, transform 500ms cubic-bezier(0.34,1.4,0.64,1);
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04) inset,
    0 12px 40px rgba(0,0,0,0.4),
    0 0 24px rgba(160,120,220,0.12);
}
@keyframes hm-hint-pulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.9; }
}
@keyframes hm-dialog-pop {
  0% { transform: translate(-50%, -50%) scale(0.88); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}
.hm-letter-scroll {
  scrollbar-width: thin;
  scrollbar-color: #E8C8D0 transparent;
}
.hm-letter-scroll::-webkit-scrollbar { width: 6px; }
.hm-letter-scroll::-webkit-scrollbar-track { background: transparent; }
.hm-letter-scroll::-webkit-scrollbar-thumb {
  background: #E8C8D0;
  border-radius: 3px;
}
@keyframes hm-mist-breathe {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
@keyframes hm-mist-drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(var(--mist-dx, 20px), var(--mist-dy, -15px)); }
}
@keyframes hm-petal-sway {
  0%, 100% { transform: rotate(var(--hm-petal-rot, 0deg)) scale(1); }
  50% { transform: rotate(calc(var(--hm-petal-rot, 0deg) + 4deg)) scale(1.03); }
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
    <>
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
      </div>
      <WelcomeScene />
    </>,
    getOrCreatePortalRoot()
  )
}
