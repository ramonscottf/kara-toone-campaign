# TASK 06 — App: Separate Internal vs Public Content
**Priority:** CRITICAL — Must ship by Tuesday
**Estimated time:** 30 min
**Depends on:** Task 04 (app rebrand)

## What's Wrong
The app mixes internal campaign operations (War Room, delegate data) with public-facing content (priorities, volunteer signup). A random voter shouldn't see the War Room.

## What To Do
1. Add a simple auth gate for internal sections:
   - Simple password protection (use Cloudflare Access or a basic pin code)
   - Password for internal: set via environment variable
   - Public sections remain open

2. PUBLIC sections (no auth required):
   - Home (priority overview cards)
   - Priorities (all 5 priority detail pages)
   - Connect (volunteer form, social links, contact)
   - Events (public events calendar)
   - About Kara

3. INTERNAL sections (auth required):
   - War Room (strategy, opponent research)
   - Delegate List (when imported)
   - Canvass Data (door-knock results)
   - Donor Dashboard (when connected)
   - Settings (campaign admin)

4. Bottom nav update:
   - Public mode: Home | Priorities | Events | Connect | About
   - Logged-in mode: Home | Priorities | War Room | Connect | Settings
   - The "War Room" tab only appears when authenticated

## Auth Implementation (simplest viable)
```javascript
// Simple pin gate — not Fort Knox, just keeps public out
const CAMPAIGN_PIN = '2026';  // or pull from env
function checkAuth() {
  return localStorage.getItem('kara-auth') === 'true';
}
function promptAuth() {
  const pin = prompt('Enter campaign access code:');
  if (pin === CAMPAIGN_PIN) {
    localStorage.setItem('kara-auth', 'true');
    return true;
  }
  return false;
}
```

## Acceptance Criteria
- [ ] Public users see Home, Priorities, Events, Connect, About
- [ ] Internal tabs hidden until pin entered
- [ ] War Room only accessible after auth
- [ ] Pin code works on mobile
- [ ] Logging out clears auth state

## When Done
Update BUILD-STATUS.json: task 06 = "done"
Commit: `build: complete task 06 — separate internal vs public app content`
