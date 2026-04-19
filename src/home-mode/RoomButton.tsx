import { CSSProperties, ReactNode } from 'react'

interface Props {
  /** position in % of viewport (0–100) */
  x: number
  y: number
  /** circle diameter px */
  size?: number
  /** main color (used for radial gradient) */
  color: string
  /** lighter highlight (defaults to white-tinted color) */
  light?: string
  /** soft glow color (rgba) */
  shadow: string
  /** float animation params */
  floatAmp?: number
  floatDur?: number
  floatDelay?: number
  label: string
  icon: ReactNode
  onClick: () => void
  /** entry animation stagger */
  stagger?: number
}

export default function RoomButton({
  x,
  y,
  size = 80,
  color,
  light,
  shadow,
  floatAmp = 10,
  floatDur = 4,
  floatDelay = 0,
  label,
  icon,
  onClick,
  stagger = 0,
}: Props) {
  const lightColor = light ?? `${color}cc`
  const style: CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    width: size,
    height: size,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    cursor: 'pointer',
    userSelect: 'none',
    border: '2px solid rgba(255,255,255,0.28)',
    background: `radial-gradient(circle at 35% 30%, ${lightColor}, ${color})`,
    boxShadow: `0 8px 32px ${shadow}, 0 0 0 6px rgba(255,255,255,0.06), inset 0 -8px 14px rgba(0,0,0,0.12)`,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    color: 'white',
    // CSS variables for the float keyframes
    ['--hm-float-amp' as string]: `${floatAmp}px`,
    ['--hm-float-dur' as string]: `${floatDur}s`,
    ['--hm-float-delay' as string]: `${floatDelay}s`,
    ['--hm-stagger' as string]: `${stagger}ms`,
    animation: `hm-btn-enter 480ms cubic-bezier(0.34, 1.4, 0.64, 1) var(--hm-stagger) backwards, hm-btn-float var(--hm-float-dur) ease-in-out var(--hm-float-delay) infinite`,
    transition:
      'transform 200ms cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 200ms ease',
  }

  return (
    <button
      type="button"
      className="hm-room-btn"
      style={style}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.zIndex = '10'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.zIndex = ''
      }}
    >
      <div
        style={{
          width: size * 0.42,
          height: size * 0.42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: size > 100 ? 13 : 11,
          color: 'rgba(255,255,255,0.95)',
          letterSpacing: '0.03em',
          lineHeight: 1.15,
          maxWidth: size - 12,
          textAlign: 'center',
          textShadow: '0 1px 2px rgba(0,0,0,0.35)',
          padding: '0 4px',
        }}
      >
        {label}
      </span>
    </button>
  )
}
