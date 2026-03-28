# TASK 04 — App Rebrand: Unified Color Palette
**Priority:** CRITICAL — Must ship by Tuesday
**Estimated time:** 45 min
**Depends on:** Nothing

## What's Wrong
The app uses multiple bright colors for priority cards (blue, orange, red, green, purple) that look like a children's toy. It needs to feel like a serious campaign tool.

## The Brand Palette (use ONLY these)
- Navy: #1B2A4A (primary background, headers)
- Burgundy: #8B2332 (accent, CTAs, alerts)
- Gold: #C9A84C (highlights, data points, emphasis)
- Green: #2D8F6F (education, success indicators)
- Cream: #F5F0E8 (backgrounds, cards)
- White: #FFFFFF (text on dark, card backgrounds)
- Dark text: #1E293B (body text on light backgrounds)
- Muted text: #64748B (secondary text, labels)

## What To Do
1. Redesign the Home screen priority cards:
   - All cards should use a consistent style — NOT five different bright colors
   - Option A: All navy cards with colored left-border accent (burgundy for safety, green for education, gold for fiscal, etc.)
   - Option B: Cream/white cards with navy headers and subtle colored tags
   - The current rainbow approach must go
2. Bottom navigation: Navy background, white icons, gold active indicator
3. Hero/header areas: Navy with white text (consistent with website)
4. Stat badges inside cards: Gold text on navy, or navy text on cream
5. Back buttons, navigation elements: Consistent navy/burgundy
6. Education deep-dive page: Green accent but navy primary
7. All text must pass WCAG AA contrast requirements

## App Pages to Update
- Home (priority cards dashboard)
- Each priority detail page
- War Room (internal — can be darker/more dramatic)
- Connect page
- Settings page
- Navigation bar (all pages)

## Acceptance Criteria
- [ ] No more than 3 colors visible on any single screen (navy + one accent + cream/white)
- [ ] Bottom nav uses navy background consistently
- [ ] All cards use the same visual pattern
- [ ] Text is readable on all backgrounds (contrast check)
- [ ] App feels like it belongs with the website — same brand

## When Done
Update BUILD-STATUS.json: task 04 = "done"
Commit: `build: complete task 04 — rebrand app to unified campaign palette`
