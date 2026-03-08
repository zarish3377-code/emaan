

# Plan: Elevate Love Mode to an Extraordinary Experience

## Current Issues
The current Love Mode has the right structure (4 rooms, toggle, petals, bubbles, easter egg) but feels flat and lifeless because:
- Rooms are mostly empty dark rectangles with small SVG objects floating in space
- No sense of depth, atmosphere, or layered ambience within rooms
- Interactions are minimal — click → bubble, that's it
- No emotional progression or surprise moments
- Missing rich ambient layers (fireflies, dust motes, light rays, etc.)

## Plan — Make It Extraordinary

### 1. Rich Ambient Atmosphere Per Room
- **Garden**: Add fireflies (8-10 tiny glowing dots with randomized float paths + opacity pulse), a shooting star that crosses the sky every ~15s, moonlight rays (diagonal semi-transparent gradient strips), and gentle grass shimmer particles rising from ground
- **Bedroom**: Add floating dust motes in the lamplight (tiny particles drifting in the warm glow area), a book on the nightstand that glows faintly, breathing light effect on the lamp (slow warm pulse that illuminates the whole room subtly)
- **Kitchen**: Add warm candlelight flicker on the table (a small flame SVG with flicker animation), visible warmth haze rising from the table area, a clock on the wall with a slowly ticking second hand
- **Play Corner**: Add more magical particles — tiny glowing orbs that drift and leave faint trails, constellation lines that briefly connect stars when you hover near them

### 2. Enhanced Click Interactions
- **Flowers**: On click, petals briefly scatter outward (each petal translates out 15px) then reassemble, with a soft light burst from the center
- **Hearts (play)**: Current particle explosion is good — add a brief screen-wide rose glow flash (opacity 0→0.08→0 on the room, 400ms)
- **Stars (play)**: Add a brief constellation effect — thin lines draw between nearby stars for 800ms then fade
- **Lamp**: On click, the entire bedroom briefly brightens (room bg lightens for 600ms) as if the lamp flared
- **Mug**: Steam briefly forms a heart shape (swap SVG path for 600ms)
- **Window**: Stars briefly streak across the glass (1-2 shooting star lines)

### 3. Hover Micro-interactions
- All clickable elements get a subtle scale(1.08) + glow intensification on hover
- Room labels fade to full opacity on room hover
- Flowers: individual petals subtly rotate toward cursor direction

### 4. Atmospheric Overlay Effects
- Add a slow-moving light caustic effect — a very subtle (opacity 0.04) animated gradient that shifts across the entire house, like underwater light patterns
- Add occasional random "sparkle" — a tiny star that appears at random position in the house, twinkles for 1s, then fades (every 3-5s)

### 5. Entrance Ceremony Enhancement
- After rooms assemble, add a "welcome ripple" — a radial gradient pulse that expands from house center outward (opacity 0.1, 800ms)
- Add a brief welcome text that fades in at the bottom of the house: *"welcome home"* in Cormorant Garamond italic, stays 2s then fades

### 6. Secret Star Enhancement
- After finding the secret, the entire house briefly shimmers with gold light
- Add a third line to the reveal: *"this world was always here, waiting for you."*

## Technical Approach

### Files to modify:
1. **`src/components/LoveMode.tsx`** — Add new ambient elements (fireflies, dust motes, sparkles, welcome text), enhance click handlers with visual feedback effects, add constellation hover effect
2. **`src/styles/lovemode.css`** — Add keyframes for fireflies, dust motes, caustic overlay, sparkle pop, room brightening flash, welcome text fade, shooting star, candle flicker

### Key new CSS animations:
- `lm-firefly` — randomized float + glow pulse for garden
- `lm-dust-mote` — slow drift in lamplight area
- `lm-shooting-star` — diagonal translate + opacity burst, 15s delay
- `lm-caustic` — slow gradient position shift across house
- `lm-room-flash` — brief background-color lighten
- `lm-welcome-fade` — fade in, hold 2s, fade out
- `lm-sparkle-pop` — scale 0→1→0 with glow, random positioning
- `lm-candle-flicker` — rapid subtle scale/opacity oscillation

### Key new React additions:
- `Fireflies` component — 10 absolute-positioned glowing dots in garden
- `DustMotes` component — 6 particles in bedroom lamp zone
- `CausticOverlay` — a single div on the house with shifting gradient
- `RandomSparkle` — useEffect with setInterval spawning sparkles
- `WelcomeText` — shown during entry sequence, auto-fades
- Enhanced click handlers that add temporary CSS classes to rooms for flash effects

All additions use only CSS transforms/opacity for GPU acceleration. No new dependencies.

