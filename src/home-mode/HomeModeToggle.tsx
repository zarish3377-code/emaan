import { createPortal } from 'react-dom'
import { useHomeMode } from './useHomeMode'

function getOrCreateToggleRoot() {
  let el = document.getElementById('hm-toggle-root')
  if (!el) {
    el = document.createElement('div')
    el.id = 'hm-toggle-root'
    document.body.appendChild(el)
  }
  return el
}

export function HomeModeToggle() {
  const { isActive, toggle } = useHomeMode()

  return createPortal(
    <button
      onClick={toggle}
      className="hm-toggle"
      style={{
        position: 'fixed',
        top: 22,
        right: 26,
        zIndex: 99999,
        background: isActive
          ? 'linear-gradient(135deg, #FCE4EC, #F8BBD9)'
          : 'linear-gradient(135deg, #FFFBFE, #FCE4EC)',
        border: `1px solid ${isActive ? 'rgba(240,130,170,0.5)' : 'rgba(240,180,200,0.4)'}`,
        borderRadius: 100,
        padding: '10px 20px',
        boxShadow: isActive
          ? '0 0 0 3px rgba(240,150,180,0.15), 0 4px 16px rgba(240,130,170,0.25)'
          : '0 2px 12px rgba(240,150,180,0.2), 0 1px 3px rgba(0,0,0,0.06)',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1rem',
        fontWeight: 600,
        color: isActive ? '#5D2D42' : '#7B5263',
        letterSpacing: '0.02em',
        transition: 'all 300ms ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(240,150,180,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = isActive
          ? '0 0 0 3px rgba(240,150,180,0.15), 0 4px 16px rgba(240,130,170,0.25)'
          : '0 2px 12px rgba(240,150,180,0.2), 0 1px 3px rgba(0,0,0,0.06)'
      }}
    >
      {isActive ? '✕ Leave' : '🏠 Our Home'}
    </button>,
    getOrCreateToggleRoot()
  )
}
