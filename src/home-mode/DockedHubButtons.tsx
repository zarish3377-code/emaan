import { useHomeMode, HM_BUTTON_PNG, Room } from './useHomeMode'
import { HUB_BUTTONS } from './Hub'

export default function DockedHubButtons() {
  const { view, setView } = useHomeMode()
  if (view === 'hub') return null

  return (
    <div
      style={{
        position: 'absolute',
        left: 28,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        zIndex: 25,
        animation: 'hm-fade-in 400ms ease',
      }}
    >
      {HUB_BUTTONS.map((b) => {
        const active = view === b.room
        return (
          <button
            key={b.room}
            type="button"
            onClick={() => setView(b.room as Room)}
            title={b.label}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              opacity: active ? 1 : 0.65,
              transition:
                'opacity 200ms ease, transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = active ? '1' : '0.65'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${HM_BUTTON_PNG})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: `${b.filter} drop-shadow(0 4px 12px rgba(0,0,0,0.4))`,
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
