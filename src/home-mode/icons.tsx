// Inline white SVG icons for Home Mode buttons.
const stroke = {
  fill: 'none',
  stroke: 'white',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconHouse = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
  </svg>
)

export const IconBed = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    {/* moon over bed */}
    <path d="M3 18v-7h11a4 4 0 0 1 4 4v3" />
    <path d="M3 18h18" />
    <path d="M6 11V8h4v3" />
    <path d="M17 6a3 3 0 1 0 3 3 2.4 2.4 0 0 1-3-3z" />
  </svg>
)

export const IconKettle = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M5 10h12v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" />
    <path d="M17 12h2a2 2 0 0 1 0 4h-2" />
    <path d="M9 7c0-1.5 1-2.5 2.5-2.5S14 5.5 14 7" />
  </svg>
)

export const IconFlower = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="9" r="2.2" />
    <path d="M12 6.8c0-2 1-3.5 2.5-3.5S17 4.5 17 6.5c0 1.4-1.2 2.4-2.5 2.4" />
    <path d="M12 6.8c0-2-1-3.5-2.5-3.5S7 4.5 7 6.5c0 1.4 1.2 2.4 2.5 2.4" />
    <path d="M14.2 9c1.7 0 3.3 1 3.3 2.7s-1.6 2.7-3.3 2.7" />
    <path d="M9.8 9c-1.7 0-3.3 1-3.3 2.7s1.6 2.7 3.3 2.7" />
    <path d="M12 11.2v9" />
    <path d="M12 16c-2-1-4-1-5 1" />
    <path d="M12 16c2-1 4-1 5 1" />
  </svg>
)

export const IconClose = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
