import { create } from 'zustand'

export type Room = 'bedroom' | 'kitchen' | 'garden'
export type View = 'hub' | Room

export type FeatureKey =
  | 'particle-heart'
  | 'fireworks'
  | 'crystal-heart'
  | 'canvas-pulse'
  | 'flower-bloom'
  | 'falling-hearts'
  | 'particle-field'
  | 'butterfly-parallax'
  | 'night-sky'

interface ActivePopup {
  photo: string
  message: string
}

interface HomeModeStore {
  isActive: boolean
  view: View
  showWelcome: boolean
  activePopup: ActivePopup | null
  activeFeature: FeatureKey | null
  toggle: () => void
  setView: (v: View) => void
  setShowWelcome: (b: boolean) => void
  showPopup: (photo: string, message: string) => void
  hidePopup: () => void
  openFeature: (k: FeatureKey) => void
  closeFeature: () => void
}

export const useHomeMode = create<HomeModeStore>((set) => ({
  isActive: false,
  view: 'hub',
  showWelcome: false,
  activePopup: null,
  activeFeature: null,
  toggle: () =>
    set((s) => ({
      isActive: !s.isActive,
      view: 'hub',
      showWelcome: !s.isActive, // turning ON shows welcome
      activePopup: null,
      activeFeature: null,
    })),
  setView: (view) => set({ view }),
  setShowWelcome: (showWelcome) => set({ showWelcome }),
  showPopup: (photo, message) => set({ activePopup: { photo, message } }),
  hidePopup: () => set({ activePopup: null }),
  openFeature: (activeFeature) => set({ activeFeature }),
  closeFeature: () => set({ activeFeature: null }),
}))

export const HM_CONFIG = {
  photos: {
    home_01: '/home-mode/photos/home_01.jpg',
    home_02: '/home-mode/photos/home_02.png',
    kitchen_01: '/home-mode/photos/kitchen_01.jpeg',
    kitchen_02: '/home-mode/photos/kitchen_02.jpeg',
    garden_01: '/home-mode/photos/garden_01.jpeg',
    garden_02: '/home-mode/photos/garden_02.jpeg',
  },
  messages: {
    home_01: 'you make every place feel like home just by being in it',
    home_02: 'i built this little world thinking of you the whole time',
    kitchen_01: 'morning coffee tastes better when you exist',
    kitchen_02: 'did you eat today? drink water? rest a little? good.',
    garden_01: 'you are softer than you think, and twice as strong',
    garden_02:
      'the way you care for others quietly is the most beautiful thing i know',
  },
} as const

export const ROOM_BG: Record<Room, string> = {
  bedroom: '/home-mode/bedroom_bg.png',
  kitchen: '/home-mode/kitchen_bg.png',
  garden: '/home-mode/garden_bg.png',
}

// PNG asset used by every floating room button
export const HM_BUTTON_PNG = '/home-mode/button.png'

// Filter variations to differentiate buttons (5 per room)
export const BUTTON_FILTERS = [
  'none',
  'hue-rotate(40deg) brightness(1.1)',
  'hue-rotate(90deg) saturate(1.2)',
  'hue-rotate(180deg) brightness(0.9)',
  'hue-rotate(270deg) saturate(0.8) brightness(1.15)',
]
