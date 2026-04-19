import { useMemo } from 'react'

export default function Particles() {
  const particles = useMemo(() => {
    const colors = [
      'rgba(255,200,220,0.4)',
      'rgba(210,190,255,0.4)',
      'rgba(255,230,180,0.4)',
    ]
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 85,
      size: 4 + Math.random() * 4,
      color: colors[i % colors.length],
      duration: 9 + Math.random() * 6,
      delay: Math.random() * 5,
      drift: -25 + Math.random() * 50,
    }))
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={
            {
              position: 'absolute',
              left: `${p.left}%`,
              bottom: 0,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              ['--hm-p-drift' as string]: `${p.drift}px`,
              animation: `hm-particle-rise ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
