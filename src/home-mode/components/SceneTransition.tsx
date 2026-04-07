import { useHomeMode } from '../useHomeMode'

export function SceneTransition() {
  const { isTransitioning } = useHomeMode()

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(15,10,25,0.9)',
        opacity: isTransitioning ? 1 : 0,
        transition: 'opacity 300ms ease',
        pointerEvents: isTransitioning ? 'all' : 'none',
        zIndex: 50,
      }}
    />
  )
}
