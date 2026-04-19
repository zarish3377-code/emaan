import { HM_CONFIG, Room, useHomeMode } from './useHomeMode'
import RoomButton from './RoomButton'
import { ROOM_BUTTONS } from './roomConfig'

export default function RoomScene({ room }: { room: Room }) {
  const { setView, showPopup, openFeature } = useHomeMode()
  const buttons = ROOM_BUTTONS[room]

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {buttons.map((b, i) => (
        <RoomButton
          key={b.id}
          x={b.x}
          y={b.y}
          size={88}
          color={b.color}
          light={b.light}
          shadow={b.shadow}
          floatAmp={b.floatAmp}
          floatDur={b.floatDur}
          floatDelay={b.floatDelay}
          stagger={i * 80}
          label={b.label}
          icon={b.icon}
          onClick={() => {
            if (b.action.kind === 'popup') {
              showPopup(
                HM_CONFIG.photos[b.action.photoKey],
                HM_CONFIG.messages[b.action.photoKey]
              )
            } else {
              openFeature(b.action.feature)
            }
          }}
        />
      ))}

      {/* Back button */}
      <button
        type="button"
        onClick={() => setView('hub')}
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 14,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 100,
          padding: '8px 18px',
          color: 'white',
          cursor: 'pointer',
          zIndex: 30,
          animation: 'hm-fade-in 400ms ease 200ms backwards',
        }}
      >
        ← back
      </button>
    </div>
  )
}
