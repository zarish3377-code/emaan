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

export const IconEnvelope = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 8l9 6 9-6" />
  </svg>
)

export const IconStar = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3l2.6 5.6 6 .7-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.4 9.3l6-.7z" />
  </svg>
)

export const IconHeart = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
  </svg>
)

export const IconSparkle = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
)

export const IconNote = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M9 18V5l11-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
  </svg>
)

export const IconCamera = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M3 8h3l2-2h8l2 2h3v11H3z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
)

export const IconChat = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M4 5h16v11H8l-4 4z" />
  </svg>
)

export const IconHeartFilled = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white" stroke="none">
    <path d="M12 21s-7.5-4.7-7.5-10.4A4.6 4.6 0 0 1 12 7.2a4.6 4.6 0 0 1 7.5 3.4C19.5 16.3 12 21 12 21z" />
  </svg>
)

export const IconPetal = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3c-3 4-3 9 0 14 3-5 3-10 0-14z" />
    <path d="M5 12c4-2 8-2 14 0-4 2-8 2-14 0z" />
  </svg>
)

export const IconSnowHeart = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 4v16M4 12h16M6 6l12 12M18 6L6 18" />
  </svg>
)

export const IconButterfly = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 6v12" />
    <path d="M12 9c-1-3-4-5-7-4-1 3 1 7 4 8 1.5.5 3 .5 3-1" />
    <path d="M12 9c1-3 4-5 7-4 1 3-1 7-4 8-1.5.5-3 .5-3-1" />
    <path d="M12 14c-1.5 2-4 3-6 2 1 2 3.5 3 6 1" />
    <path d="M12 14c1.5 2 4 3 6 2-1 2-3.5 3-6 1" />
  </svg>
)

export const IconMoon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M20 14a8 8 0 1 1-10-10 6 6 0 0 0 10 10z" />
  </svg>
)

export const IconMusic = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M9 18V5l10-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="16" cy="16" r="3" />
  </svg>
)

export const IconClose = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
