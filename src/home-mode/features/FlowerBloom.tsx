import { useEffect, useState } from 'react'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'

// SVG flower bloom using stroke-dasharray (no paid GSAP DrawSVG) + CSS keyframes.
const STEMS = [
  'M300 580 C 290 480, 270 380, 280 280',
  'M300 580 C 320 470, 360 360, 360 240',
  'M300 580 C 285 500, 240 440, 200 360',
]

const BRANCHES = [
  'M285 420 C 260 410, 235 400, 215 395',
  'M295 360 C 320 355, 345 350, 365 360',
  'M340 330 C 360 320, 380 305, 395 290',
  'M275 320 C 250 312, 230 305, 215 300',
  'M290 260 C 270 245, 255 225, 245 205',
  'M320 280 C 345 270, 365 255, 380 240',
]

const Flower = ({
  cx,
  cy,
  size,
  delay,
  petalColor,
}: {
  cx: number
  cy: number
  size: number
  delay: number
  petalColor: string
}) => {
  const petals = 8
  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animation: `hm-bloom 1100ms cubic-bezier(0.34,1.4,0.64,1) ${delay}ms both`,
      }}
    >
      {Array.from({ length: petals }).map((_, i) => {
        const a = (i / petals) * Math.PI * 2
        const px = cx + Math.cos(a) * size * 0.55
        const py = cy + Math.sin(a) * size * 0.55
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={size * 0.45}
            ry={size * 0.22}
            fill={petalColor}
            opacity={0.92}
            transform={`rotate(${(a * 180) / Math.PI} ${px} ${py})`}
          />
        )
      })}
      <circle cx={cx} cy={cy} r={size * 0.28} fill="#fff3a8" />
      <circle cx={cx} cy={cy} r={size * 0.16} fill="#e8b04a" />
    </g>
  )
}

const Leaf = ({
  cx,
  cy,
  rot,
  size,
  delay,
}: {
  cx: number
  cy: number
  rot: number
  size: number
  delay: number
}) => (
  <ellipse
    cx={cx}
    cy={cy}
    rx={size}
    ry={size * 0.4}
    fill="#7ec890"
    opacity={0.85}
    transform={`rotate(${rot} ${cx} ${cy})`}
    style={{
      transformOrigin: `${cx}px ${cy}px`,
      animation: `hm-bloom 800ms cubic-bezier(0.34,1.4,0.64,1) ${delay}ms both`,
    }}
  />
)

export default function FlowerBloom() {
  const [showText, setShowText] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <FeatureOverlay background="#131b21">
      <svg
        viewBox="0 0 600 600"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        {STEMS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#7ec890"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 800,
              strokeDashoffset: 800,
              animation: `hm-draw 1500ms ease-out ${i * 200}ms forwards`,
            }}
          />
        ))}
        {BRANCHES.map((d, i) => (
          <path
            key={`b${i}`}
            d={d}
            stroke="#88c490"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 400,
              strokeDashoffset: 400,
              animation: `hm-draw 900ms ease-out ${800 + i * 150}ms forwards`,
            }}
          />
        ))}

        <Leaf cx={245} cy={400} rot={-30} size={28} delay={1000} />
        <Leaf cx={355} cy={355} rot={30} size={26} delay={1150} />
        <Leaf cx={215} cy={330} rot={-50} size={22} delay={1300} />
        <Leaf cx={385} cy={290} rot={40} size={24} delay={1450} />
        <Leaf cx={250} cy={220} rot={-20} size={20} delay={1600} />

        <Flower cx={280} cy={280} size={68} delay={1800} petalColor="#f2a4b8" />
        <Flower cx={360} cy={240} size={58} delay={2000} petalColor="#c4b0e8" />
        <Flower cx={200} cy={360} size={50} delay={2200} petalColor="#ffd1dd" />
        <Flower cx={395} cy={290} size={42} delay={2400} petalColor="#ffe89a" />
        <Flower cx={215} cy={395} size={38} delay={2600} petalColor="#f0a0c0" />

        {Array.from({ length: 22 }).map((_, i) => {
          const x = 80 + Math.random() * 440
          const y = 80 + Math.random() * 440
          return (
            <circle
              key={`d${i}`}
              cx={x}
              cy={y}
              r={2}
              fill="#fce4ec"
              opacity={0.6}
              style={{
                animation: `hm-fade-in 800ms ease ${2800 + i * 60}ms both`,
              }}
            />
          )
        })}
      </svg>
      {showText && (
        <div
          style={{
            ...featureCaption,
            bottom: '8%',
            fontSize: 'clamp(1.2rem, 2.6vw, 1.7rem)',
            color: '#fce4ec',
            animation: 'hm-fade-in 800ms ease',
          }}
        >
          you're the most in-bloom person i know
        </div>
      )}
    </FeatureOverlay>
  )
}
