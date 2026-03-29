

## Problem

The `growFlowers` function only adds **one flower pair per call** and sets `lastGrowthDate` to today. So if the garden wasn't opened for 40 days, it only catches up by 1 day instead of all 40 missed days.

The garden started around Dec 10, 2025. Today is March 29, 2026 = ~110 days. But it's stuck at 63 because the user didn't open the garden every single day.

## Solution

Modify `growFlowers` in `src/hooks/useSecretGarden.ts` to **catch up on all missed days at once**:

1. Calculate the number of missed days between `lastGrowthDate` and today
2. Loop through each missed day, creating a flower pair for each
3. Update the database with all new flowers, the correct counts, and today as `lastGrowthDate`
4. Cap the catch-up to prevent performance issues (e.g., max 100 days at once)

### Changes

**File: `src/hooks/useSecretGarden.ts`**

Replace the `growFlowers` function:
- Calculate `missedDays` = difference between `lastGrowthDate` (or `startDate`) and today
- For each missed day, call `createFlowerPair` and accumulate flowers
- Update DB once with all new flowers and correct counts
- Update state accordingly

This ensures the garden reflects the true number of days since it started, regardless of how often it's opened.

