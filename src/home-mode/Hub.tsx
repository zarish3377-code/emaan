import { useHomeMode } from './useHomeMode'
import RoomButton from './RoomButton'
import { IconFlower, IconHouse, IconKettle } from './icons'

export default function Hub() {
  const { setView } = useHomeMode()

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
        <RoomButton
          x={22}
          y={50}
          size={120}
          color="#E07090"
          light="#FFB0C8"
          shadow="rgba(232,112,144,0.45)"
          floatAmp={10}
          floatDur={3.4}
          floatDelay={0}
          stagger={0}
          label="home"
          icon={<IconHouse size={36} />}
          onClick={() => setView('home')}
        />
        <RoomButton
          x={50}
          y={42}
          size={120}
          color="#E09A60"
          light="#FFCAA0"
          shadow="rgba(224,154,96,0.45)"
          floatAmp={12}
          floatDur={4.2}
          floatDelay={0.4}
          stagger={120}
          label="kitchen"
          icon={<IconKettle size={36} />}
          onClick={() => setView('kitchen')}
        />
        <RoomButton
          x={78}
          y={50}
          size={120}
          color="#6CAE6C"
          light="#A8D8A8"
          shadow="rgba(108,174,108,0.45)"
          floatAmp={11}
          floatDur={3.8}
          floatDelay={0.8}
          stagger={240}
          label="garden"
          icon={<IconFlower size={36} />}
          onClick={() => setView('garden')}
        />
      </div>

      {/* Welcome line */}
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
