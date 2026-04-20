import { FeatureKey, HM_CONFIG, Room } from './useHomeMode'

export interface RoomBtn {
  id: string
  x: number
  y: number
  label: string
  floatAmp: number
  floatDur: number
  floatDelay: number
  /** action on click */
  action:
    | { kind: 'popup'; photoKey: keyof typeof HM_CONFIG.photos }
    | { kind: 'feature'; feature: FeatureKey }
}

export const ROOM_BUTTONS: Record<Room, RoomBtn[]> = {
  bedroom: [
    {
      id: 'b-note',
      x: 20,
      y: 30,
      label: 'a note',
      floatAmp: 10,
      floatDur: 4,
      floatDelay: 0,
      action: { kind: 'popup', photoKey: 'home_01' },
    },
    {
      id: 'b-foryou',
      x: 75,
      y: 25,
      label: 'for you',
      floatAmp: 12,
      floatDur: 4.6,
      floatDelay: 0.4,
      action: { kind: 'popup', photoKey: 'home_02' },
    },
    {
      id: 'b-particle',
      x: 50,
      y: 48,
      label: 'particle heart',
      floatAmp: 9,
      floatDur: 3.4,
      floatDelay: 0.2,
      action: { kind: 'feature', feature: 'particle-heart' },
    },
    {
      id: 'b-wish',
      x: 18,
      y: 70,
      label: 'make a wish',
      floatAmp: 13,
      floatDur: 5,
      floatDelay: 0.8,
      action: { kind: 'feature', feature: 'fireworks' },
    },
    {
      id: 'b-song',
      x: 78,
      y: 65,
      label: 'our song',
      floatAmp: 11,
      floatDur: 4.2,
      floatDelay: 1.2,
      action: { kind: 'feature', feature: 'crystal-heart' },
    },
  ],
  kitchen: [
    {
      id: 'k-remember',
      x: 22,
      y: 28,
      label: 'remember this?',
      floatAmp: 10,
      floatDur: 4,
      floatDelay: 0,
      action: { kind: 'popup', photoKey: 'kitchen_01' },
    },
    {
      id: 'k-check',
      x: 72,
      y: 30,
      label: 'just checking',
      floatAmp: 12,
      floatDur: 4.4,
      floatDelay: 0.5,
      action: { kind: 'popup', photoKey: 'kitchen_02' },
    },
    {
      id: 'k-pulse',
      x: 48,
      y: 50,
      label: 'feel this',
      floatAmp: 9,
      floatDur: 3.6,
      floatDelay: 0.3,
      action: { kind: 'feature', feature: 'canvas-pulse' },
    },
    {
      id: 'k-bloom',
      x: 20,
      y: 68,
      label: 'watch this',
      floatAmp: 13,
      floatDur: 4.8,
      floatDelay: 0.9,
      action: { kind: 'feature', feature: 'flower-bloom' },
    },
    {
      id: 'k-magic',
      x: 75,
      y: 70,
      label: 'touch it',
      floatAmp: 11,
      floatDur: 4.2,
      floatDelay: 1.3,
      action: { kind: 'feature', feature: 'falling-hearts' },
    },
  ],
  garden: [
    {
      id: 'g-justbecause',
      x: 20,
      y: 30,
      label: 'just because',
      floatAmp: 10,
      floatDur: 4,
      floatDelay: 0,
      action: { kind: 'popup', photoKey: 'garden_01' },
    },
    {
      id: 'g-iseeyou',
      x: 74,
      y: 32,
      label: 'i see you',
      floatAmp: 12,
      floatDur: 4.4,
      floatDelay: 0.5,
      action: { kind: 'popup', photoKey: 'garden_02' },
    },
    {
      id: 'g-stardust',
      x: 50,
      y: 48,
      label: 'touch the sky',
      floatAmp: 9,
      floatDur: 3.6,
      floatDelay: 0.3,
      action: { kind: 'feature', feature: 'particle-field' },
    },
    {
      id: 'g-wander',
      x: 18,
      y: 68,
      label: 'follow me',
      floatAmp: 13,
      floatDur: 4.8,
      floatDelay: 0.9,
      action: { kind: 'feature', feature: 'butterfly-parallax' },
    },
    {
      id: 'g-night',
      x: 76,
      y: 67,
      label: 'look up',
      floatAmp: 11,
      floatDur: 4.2,
      floatDelay: 1.3,
      action: { kind: 'feature', feature: 'night-sky' },
    },
  ],
}
