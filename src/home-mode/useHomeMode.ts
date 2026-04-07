import { create } from 'zustand'

export type Scene = 'entrance' | 'bedroom' | 'kitchen' | 'garden'

interface ActivePopup {
  photo: string
  message: string
}

interface HomeModeStore {
  isActive: boolean
  currentScene: Scene
  isTransitioning: boolean
  activePopup: ActivePopup | null
  toggle: () => void
  setScene: (scene: Scene) => void
  setTransitioning: (v: boolean) => void
  showPopup: (photo: string, message: string) => void
  hidePopup: () => void
}

export const useHomeMode = create<HomeModeStore>((set) => ({
  isActive: false,
  currentScene: 'entrance',
  isTransitioning: false,
  activePopup: null,
  toggle: () => set((s) => ({
    isActive: !s.isActive,
    currentScene: 'entrance',
    activePopup: null,
  })),
  setScene: (scene) => set({ currentScene: scene }),
  setTransitioning: (v) => set({ isTransitioning: v }),
  showPopup: (photo, message) => set({ activePopup: { photo, message } }),
  hidePopup: () => set({ activePopup: null }),
}))
