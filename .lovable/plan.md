

## Home Mode — Interactive House Experience

### Overview
A self-contained, toggleable overlay that transforms the site into an explorable illustrated home with 4 scenes (entrance, bedroom, kitchen, garden). A character sprite walks around, interacts with objects, and reveals photo popups with messages.

### Assets
Copy uploaded images to `public/home-mode/`:
- `home.png` → `entrance_bg.png`
- `bedroom.png` → `bedroom_bg.png`
- `kitchen.png` → `kitchen_bg.png`
- `garden.png` → `garden_bg.png`
- `character.png` → `character.png`

Create placeholder directory: `public/home-mode/photos/`

### Dependencies
- Install `zustand` for isolated state management

### Font
- Add Cormorant Garamond Google Font link to `index.html`

### File Structure
```text
src/home-mode/
├── HomeMode.tsx           — overlay root, mounts/unmounts with fade
├── HomeModeToggle.tsx     — fixed pill button "our home" / "leave home"
├── HomeModeEngine.tsx     — scene renderer + particles + character + UI
├── useHomeMode.ts         — Zustand store (isActive, scene, popup, etc.)
├── scenes/
│   ├── EntranceScene.tsx  — 3 door navigation objects
│   ├── BedroomScene.tsx   — bed, lamp, window, wardrobe interactions
│   ├── KitchenScene.tsx   — kettle, stove, plant, window interactions
│   └── GardenScene.tsx    — flowers, bench, tree interactions
├── components/
│   ├── Character.tsx      — movable sprite with keyboard/touch controls
│   ├── PhotoPopup.tsx     — centered card with photo + message
│   ├── InteractPrompt.tsx — "E" key floating label on proximity
│   └── SceneTransition.tsx— black fade overlay between scenes
└── data/
    └── interactions.ts    — all object positions, photos, messages
```

### Integration (only change to existing files)
**`src/App.tsx`** — Add 2 imports and 2 components as last children before closing `</QueryClientProvider>`:
```tsx
import { HomeModeToggle } from './home-mode/HomeModeToggle'
import HomeMode from './home-mode/HomeMode'
// Inside JSX, after </BrowserRouter>:
<HomeModeToggle />
<HomeMode />
```

### Key Implementation Details

1. **Toggle Button**: Fixed top-right pill, z-index 99999. Cormorant Garamond font. Soft pink gradient OFF, deeper pink ON. Spring hover animation.

2. **State (Zustand)**: `isActive`, `currentScene`, `isTransitioning`, `activePopup`. No React context to avoid re-renders in existing components.

3. **Mount/Unmount**: When toggled ON, existing site fades to opacity 0 (not removed), then overlay fades in. Reverse on OFF. Site state preserved.

4. **Character**: Uses `character.png`. Moves via arrow keys/WASD + mobile D-pad. Walking bob animation. Proximity detection (110px) triggers glow ring + interact prompt on nearby objects.

5. **Scenes**: Each scene = full-screen background image + invisible hit areas positioned over painted objects. Navigation objects (entrance doors) trigger scene transitions. Other objects trigger photo popups.

6. **Photo Popup**: Centered card with photo from `/public/home-mode/photos/`, italic message below. Spring animation in, fade out. Dismisses on backdrop click, Escape, or 8s auto-timeout.

7. **Scene Transitions**: 300ms black fade out, swap scene, 300ms fade in. Back button in each room returns to entrance.

8. **Ambient Particles**: 12 floating colored dots (rose/lavender/gold), scene-specific variations. Kitchen gets steam particles.

9. **All CSS classes prefixed with `hm-`** to prevent leaking into existing styles.

### Photos Needed After Implementation
You will need **12 photos** total for the interactive objects:

**Bedroom (4):**
- `photo_bed.png` — "you deserve the softest sleep in the world"
- `photo_lamp.png` — "you light things up, always"
- `photo_window.png` — "i think about you when it rains"
- `photo_wardrobe.png` — "whatever you wear, you make it yours"

**Kitchen (4):**
- `photo_kettle.png` — "drink water. this is an order."
- `photo_stove.png` — "i'd cook for you every single morning"
- `photo_plant.png` — "did you eat today? no judgment."
- `photo_kitchen_window.png` — "morning coffee hits different when you exist"

**Garden (4):**
- `photo_flowers_a.png` — "you are softer than you think"
- `photo_flowers_b.png` — "the way you care for others is a quiet kind of magic"
- `photo_bench.png` — "this spot was saved for you"
- `photo_tree.png` — "some things grow quietly and become extraordinary"

Place them in `public/home-mode/photos/`. The entrance scene has no photo popups (only door navigation).

