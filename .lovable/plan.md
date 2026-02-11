

# Consolidate Navigation: Single Menu Button with Expandable Panel

## Overview
Replace the 7 scattered fixed buttons with a single floating menu button. Tapping it opens a full-screen overlay displaying all features as round, labeled buttons in a clean grid layout.

## What Changes

### 1. New Component: `NavMenuButton.tsx`
- A single fixed floating button (bottom-right corner) with a soft, rounded design
- Shows a small icon (like a flower or grid icon)
- On tap, opens a full-screen overlay panel

### 2. New Component: `NavMenuPanel.tsx`
- Full-screen overlay with a blurred backdrop (matching the site's romantic aesthetic)
- Displays all 7 features as **round circular buttons** arranged in a grid (2-3 columns)
- Each button has:
  - A round gradient background (unique soft color per feature)
  - An emoji or icon in the center
  - A label underneath
- Features listed:
  - Ur Neno
  - Secret Garden
  - Happy New Year
  - Collection
  - My Valentine
  - Countdown
  - Just Say It
- Staggered fade-in animation for each button
- Tapping a feature button closes the menu and opens the corresponding panel

### 3. Remove Individual Button Components
- Delete the individual fixed-position button components:
  - `NenoButton.tsx`
  - `SecretGardenButton.tsx`
  - `NewYearButton.tsx`
  - `CollectionButton.tsx`
  - `CountdownButton.tsx`
  - `ValentineButton.tsx`
  - `JustSayItButton.tsx`
- Remove their imports and usage from `Index.tsx`

### 4. Update `Index.tsx`
- Replace all 7 button components with a single `NavMenuButton` + `NavMenuPanel`
- Pass all the panel open handlers to the menu panel

## Technical Details

- The menu button will be `fixed bottom-6 right-6 z-40` -- a single round 56px button
- The panel uses `fixed inset-0 z-50` with backdrop blur
- Grid layout: `grid grid-cols-3 gap-6` on mobile, centered
- Each feature button: `w-20 h-20 rounded-full` with gradient backgrounds
- Animations: staggered `animate-scale-in` with increasing delays per button
- Close on backdrop tap or X button

