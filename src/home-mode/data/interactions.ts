import type { Scene } from '../useHomeMode'

export interface InteractionObject {
  id: string
  scene: Scene
  label: string
  xPercent: number
  yPercent: number
  fromBottom: boolean
  hitWidth: number
  hitHeight: number
  photo: string
  message: string
  navigatesTo?: Scene
}

export const interactions: InteractionObject[] = [
  // ── ENTRANCE ──
  {
    id: 'door-bedroom',
    scene: 'entrance',
    label: 'Bedroom →',
    xPercent: 25, yPercent: 35, fromBottom: true,
    hitWidth: 80, hitHeight: 120,
    photo: '',
    message: '',
    navigatesTo: 'bedroom',
  },
  {
    id: 'door-kitchen',
    scene: 'entrance',
    label: 'Kitchen →',
    xPercent: 50, yPercent: 35, fromBottom: true,
    hitWidth: 80, hitHeight: 120,
    photo: '',
    message: '',
    navigatesTo: 'kitchen',
  },
  {
    id: 'door-garden',
    scene: 'entrance',
    label: 'Garden →',
    xPercent: 75, yPercent: 35, fromBottom: true,
    hitWidth: 80, hitHeight: 120,
    photo: '',
    message: '',
    navigatesTo: 'garden',
  },

  // ── BEDROOM ──
  {
    id: 'bedroom-bed',
    scene: 'bedroom',
    label: 'Bed',
    xPercent: 38, yPercent: 28, fromBottom: true,
    hitWidth: 200, hitHeight: 100,
    photo: 'photo_bed.png',
    message: 'you deserve the softest sleep in the world',
  },
  {
    id: 'bedroom-lamp',
    scene: 'bedroom',
    label: 'Lamp',
    xPercent: 62, yPercent: 35, fromBottom: true,
    hitWidth: 60, hitHeight: 90,
    photo: 'photo_lamp.png',
    message: 'you light things up, always',
  },
  {
    id: 'bedroom-window',
    scene: 'bedroom',
    label: 'Window',
    xPercent: 18, yPercent: 45, fromBottom: true,
    hitWidth: 90, hitHeight: 110,
    photo: 'photo_window.png',
    message: 'i think about you when it rains',
  },
  {
    id: 'bedroom-wardrobe',
    scene: 'bedroom',
    label: 'Wardrobe',
    xPercent: 80, yPercent: 40, fromBottom: true,
    hitWidth: 100, hitHeight: 140,
    photo: 'photo_wardrobe.png',
    message: 'whatever you wear, you make it yours',
  },

  // ── KITCHEN ──
  {
    id: 'kitchen-kettle',
    scene: 'kitchen',
    label: 'Kettle',
    xPercent: 82, yPercent: 38, fromBottom: true,
    hitWidth: 65, hitHeight: 75,
    photo: 'photo_kettle.png',
    message: 'drink water. this is an order.',
  },
  {
    id: 'kitchen-stove',
    scene: 'kitchen',
    label: 'Stove',
    xPercent: 70, yPercent: 32, fromBottom: true,
    hitWidth: 130, hitHeight: 100,
    photo: 'photo_stove.png',
    message: "i'd cook for you every single morning",
  },
  {
    id: 'kitchen-plant',
    scene: 'kitchen',
    label: 'Plant',
    xPercent: 43, yPercent: 25, fromBottom: true,
    hitWidth: 60, hitHeight: 80,
    photo: 'photo_plant.png',
    message: 'did you eat today? no judgment.',
  },
  {
    id: 'kitchen-window',
    scene: 'kitchen',
    label: 'Window',
    xPercent: 22, yPercent: 48, fromBottom: true,
    hitWidth: 140, hitHeight: 130,
    photo: 'photo_kitchen_window.png',
    message: 'morning coffee hits different when you exist',
  },

  // ── GARDEN ──
  {
    id: 'garden-flowers-left',
    scene: 'garden',
    label: 'Flowers',
    xPercent: 18, yPercent: 22, fromBottom: true,
    hitWidth: 80, hitHeight: 80,
    photo: 'photo_flowers_a.png',
    message: 'you are softer than you think',
  },
  {
    id: 'garden-flowers-center',
    scene: 'garden',
    label: 'Flowers',
    xPercent: 50, yPercent: 20, fromBottom: true,
    hitWidth: 80, hitHeight: 80,
    photo: 'photo_flowers_b.png',
    message: 'the way you care for others is a quiet kind of magic',
  },
  {
    id: 'garden-bench',
    scene: 'garden',
    label: 'Bench',
    xPercent: 35, yPercent: 28, fromBottom: true,
    hitWidth: 100, hitHeight: 65,
    photo: 'photo_bench.png',
    message: 'this spot was saved for you',
  },
  {
    id: 'garden-tree',
    scene: 'garden',
    label: 'Tree',
    xPercent: 80, yPercent: 50, fromBottom: true,
    hitWidth: 90, hitHeight: 180,
    photo: 'photo_tree.png',
    message: 'some things grow quietly and become extraordinary',
  },
]
