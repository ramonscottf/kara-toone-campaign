# TASK 03 — Replace Generic Icons
**Priority:** CRITICAL — Must ship by Tuesday
**Estimated time:** 20 min
**Depends on:** Nothing

## What's Wrong
The site uses generic emoji or default icons that look unprofessional.

## What To Do
1. Replace all emoji icons (🪧 🏡 🚪 🗳️ 📣 💬) in the "Take Action" section with clean SVG icons
2. Use Lucide Icons (MIT license, available via CDN): https://unpkg.com/lucide@latest/dist/umd/lucide.min.js
3. Or use inline SVG paths — no icon font libraries needed
4. Icon style: thin line weight (stroke-width 1.5), consistent 24x24 size
5. Color: use campaign navy (#1B2A4A) or burgundy (#8B2332)
6. Replace the tab bar icons in the app if they use generic system icons

## Icon Mapping
- Yard Sign → signpost or flag icon
- Cottage Meeting → home or users icon
- Knock Doors → door-open or walking icon
- Become a Delegate → award or star icon
- Spread the Word → share-2 or megaphone icon
- Contact → mail or message-circle icon

## Acceptance Criteria
- [ ] No emoji used as icons anywhere on the site
- [ ] All icons are SVG, consistent style and size
- [ ] Icons use campaign brand colors
- [ ] Icons render crisply on retina displays

## When Done
Update BUILD-STATUS.json: task 03 = "done"
Commit: `build: complete task 03 — replace generic icons with branded SVGs`
