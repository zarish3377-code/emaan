import { Room, useHomeMode } from './useHomeMode'
import RoomButton from './RoomButton'

interface HubBtnDef {
  room: Room
  label: string
  filter: string
  floatAmp: number
  floatDur: number
  floatDelay: number
}

export const HUB_BUTTONS: HubBtnDef[] = [
  {
    room: 'bedroom',
    label: 'bedroom',
    filter: 'hue-rotate(300deg) saturate(1.05)',
    floatAmp: 10,
    floatDur: 3.4,
    floatDelay: 0,
  },
  {
    room: 'kitchen',
    label: 'kitchen',
    filter: 'none',
    floatAmp: 12,
    floatDur: 4.2,
    floatDelay: 0.4,
  },
  {
    room: 'garden',
    label: 'garden',
    filter: 'hue-rotate(80deg) saturate(1.1)',
    floatAmp: 11,
    floatDur: 3.8,
    floatDelay: 0.8,
  },
]

export default function Hub() {
  const { setView } = useHomeMode()

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
        {HUB_BUTTONS.map((b, i) => (
          <RoomButton
            key={b.room}
            x={[22, 50, 78][i]}
            y={[50, 42, 50][i]}
            size={130}
            cssFilter={b.filter}
            floatAmp={b.floatAmp}
            floatDur={b.floatDur}
            floatDelay={b.floatDelay}
            stagger={i * 120}
            label={b.label}
            onClick={() => setView(b.room)}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: 'rgba(255,240,245,0.92)',
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          letterSpacing: '0.02em',
          textAlign: 'center',
          animation: 'hm-fade-in 800ms ease 200ms backwards',
        }}
      >
        welcome home, my love
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '14%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
          color: 'rgba(255,240,245,0.7)',
          textShadow: '0 1px 8px rgba(0,0,0,0.5)',
          textAlign: 'center',
          animation: 'hm-fade-in 800ms ease 600ms backwards',
        }}
      >
        choose a room to wander into ✨
      </div>
    </div>
  )
}
