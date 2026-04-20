import { CSSProperties } from 'react'
import { HM_BUTTON_PNG } from './useHomeMode'

interface Props {
  /** position in % of viewport (0–100) */
  x: number
  y: number
  /** PNG render size (px) */
  size?: number
  /** CSS filter for color variation */
  cssFilter?: string
  /** float animation params */
  floatAmp?: number
  floatDur?: number
  floatDelay?: number
  label: string
  onClick: () => void
  /** entry animation stagger ms */
  stagger?: number
}

export default function RoomButton({
  x,
  y,
  size = 90,
  cssFilter = 'none',
  floatAmp = 10,
  floatDur = 4,
  floatDelay = 0,
  label,
  onClick,
  stagger = 0,
}: Props) {
  const style: CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    cursor: 'pointer',
    userSelect: 'none',
    background: 'transparent',
    border: 'none',
    padding: 0,
    color: 'white',
    ['--hm-float-amp' as string]: `${floatAmp}px`,
    ['--hm-float-dur' as string]: `${floatDur}s`,
    ['--hm-float-delay' as string]: `${floatDelay}s`,
    ['--hm-stagger' as string]: `${stagger}ms`,
    animation: `hm-btn-enter 480ms cubic-bezier(0.34, 1.4, 0.64, 1) var(--hm-stagger) backwards, hm-btn-float var(--hm-float-dur) ease-in-out var(--hm-float-delay) infinite`,
    transition:
      'transform 200ms cubic-bezier(0.34, 1.4, 0.64, 1), filter 200ms ease',
  }

  return (
    <button
      type="button"
      className="hm-room-btn"
      style={style}
      onClick={onClick}
    >
      <div
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${HM_BUTTON_PNG})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: `${cssFilter} drop-shadow(0 4px 16px rgba(0,0,0,0.3))`,
          transition: 'filter 200ms ease',
        }}
      />
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 11,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '0.04em',
          lineHeight: 1.15,
          textAlign: 'center',
          textShadow: '0 1px 4px rgba(0,0,0,0.55)',
          marginTop: 2,
          opacity: 0.9,
          maxWidth: size + 20,
        }}
      >
        {label}
      </span>
    </button>
  )
}
