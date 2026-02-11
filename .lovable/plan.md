okay here’s the short, high-precision version u can give an agent so it generates clean structured code without overcomplicating it:

HIGH-PRECISION BUILD PROMPT

Build a responsive interactive flower bloom menu using pure HTML, CSS, and vanilla JavaScript only.

Core Layout:

One main circular menu button positioned at the top center of a relative container.

On click, 7 petal PNG buttons bloom downward in a semi-arc (120–140 degree spread).

Do NOT use top/left repositioning for animation. Use CSS transform only.

Positioning Logic:

All petals must share the same radius from the center.

Use transform pattern:
rotate(angle) translateY(radius) rotate(-angle)

Angles should be evenly spaced (example: -50deg to +70deg range).

Text must remain visually upright.

Petal Design:

Use transparent PNG images.

3 center petals slightly larger.

4 outer petals slightly smaller.

Text centered over each petal with absolute positioning.

Add subtle drop-shadow to PNG.

Animation:
Closed state:
opacity: 0
scale: 0.3
slight inward rotation

Open state:
opacity: 1
scale: 1
rotated to assigned angle
translated outward to fixed radius

Transition:
0.4s cubic-bezier(0.22, 1, 0.36, 1)

Stagger:
60ms incremental delay per petal.

Extra Interactions:

Main button rotates 45deg when open.

Clicking outside closes menu.

Add subtle radial glow behind petals when open.

Add slight hover scale effect on petals.

Keep animation smooth and organic (not robotic).

Constraints:

No frameworks.

Clean structured CSS.

No unnecessary libraries.

Fully centered layout.

Must work on desktop and mobile.

Visual Style:
Soft romantic pastel aesthetic.
Elegant, balanced, organic bloom effect.