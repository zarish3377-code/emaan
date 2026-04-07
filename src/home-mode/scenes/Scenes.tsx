import { interactions, InteractionObject } from '../data/interactions'
import { useHomeMode } from '../useHomeMode'

interface SceneProps {
  nearObjectId: string | null
}

function HitArea({ obj, isNear }: { obj: InteractionObject; isNear: boolean }) {
  const { showPopup, setScene, setTransitioning } = useHomeMode()

  const handleClick = () => {
    if (obj.navigatesTo) {
      setTransitioning(true)
      setTimeout(() => {
        setScene(obj.navigatesTo!)
        setTimeout(() => setTransitioning(false), 300)
      }, 300)
    } else if (obj.photo) {
      showPopup(obj.photo, obj.message)
    }
  }

  const posStyle: React.CSSProperties = obj.fromBottom
    ? { left: `${obj.xPercent}%`, bottom: `${obj.yPercent}%` }
    : { left: `${obj.xPercent}%`, top: `${obj.yPercent}%` }

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        ...posStyle,
        width: obj.hitWidth,
        height: obj.hitHeight,
        transform: 'translateX(-50%)',
        cursor: 'pointer',
        zIndex: 5,
      }}
    >
      {isNear && (
        <div style={{
          position: 'absolute',
          inset: -8,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,210,180,0.25) 0%, rgba(255,180,160,0.1) 50%, transparent 70%)',
          animation: 'hm-glow-pulse 2s ease-in-out infinite',
        }} />
      )}
      {/* Navigation label for doors */}
      {obj.navigatesTo && (
        <div style={{
          position: 'absolute',
          bottom: -24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13,
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.8)',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}>
          {obj.label}
        </div>
      )}
    </div>
  )
}

export function EntranceScene({ nearObjectId }: SceneProps) {
  const objs = interactions.filter(o => o.scene === 'entrance')
  return <>{objs.map(o => <HitArea key={o.id} obj={o} isNear={nearObjectId === o.id} />)}</>
}

export function BedroomScene({ nearObjectId }: SceneProps) {
  const objs = interactions.filter(o => o.scene === 'bedroom')
  return <>{objs.map(o => <HitArea key={o.id} obj={o} isNear={nearObjectId === o.id} />)}</>
}

export function KitchenScene({ nearObjectId }: SceneProps) {
  const objs = interactions.filter(o => o.scene === 'kitchen')
  return <>{objs.map(o => <HitArea key={o.id} obj={o} isNear={nearObjectId === o.id} />)}</>
}

export function GardenScene({ nearObjectId }: SceneProps) {
  const objs = interactions.filter(o => o.scene === 'garden')
  return <>{objs.map(o => <HitArea key={o.id} obj={o} isNear={nearObjectId === o.id} />)}</>
}
