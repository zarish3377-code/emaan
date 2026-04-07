import { useEffect, useState, useRef } from 'react'
import { useHomeMode } from './useHomeMode'
import HomeModeEngine from './HomeModeEngine'

export default function HomeMode() {
  const { isActive } = useHomeMode()
  const [mounted, setMounted] = useState(false)
  const [overlayOpacity, setOverlayOpacity] = useState(0)
  const prevActive = useRef(false)

  useEffect(() => {
    const siteRoot = document.getElementById('root')
    if (!siteRoot) return

    if (isActive && !prevActive.current) {
      // Fade site out
      siteRoot.style.transition = 'opacity 0.6s ease'
      siteRoot.style.opacity = '0'
      setTimeout(() => {
        setMounted(true)
        requestAnimationFrame(() => setOverlayOpacity(1))
      }, 500)
    }

    if (!isActive && prevActive.current) {
      // Fade overlay out
      setOverlayOpacity(0)
      setTimeout(() => {
        setMounted(false)
        siteRoot.style.transition = 'opacity 0.4s ease'
        siteRoot.style.opacity = '1'
      }, 400)
    }

    prevActive.current = isActive
  }, [isActive])

  if (!mounted) return null

  return (
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
  )
}
