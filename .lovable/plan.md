

## Problem

Day counting is off by 1. Currently:
- Day 1 = Dec 10, so Day 101 = March 20, Day 137 = April 25
- Day 101 says "37 days left" but March 20 → April 25 is only **36 days**
- "1 day left" shows on April 25 (the birthday itself) instead of April 24

## Fix

In `src/data/nenoMessages.ts`, adjust messages at indices 100-136 (days 101-137):

1. **Days 101-136**: Decrease each countdown number by 1
   - Day 101: "37 days left" → "36 days left"
   - Day 102: "36 days left" → "35 days left"
   - ...continuing pattern...
   - Day 136: "2 days left" → "1 day left"

2. **Day 137 (April 25)**: Replace "1 day left" message with a **birthday message** since that IS the birthday. The user should provide the birthday message text, or I can write a celebratory one.

This way "1 day left" correctly falls on Day 136 (April 24), and the birthday itself gets a proper birthday greeting.

### Technical Detail
- Only file changed: `src/data/nenoMessages.ts` (lines 101-137)
- No logic changes needed — just text content fixes

