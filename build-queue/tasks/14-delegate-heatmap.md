# TASK 14 — Delegate List Import + Precinct Heat Map
**Priority:** MEDIUM — Ship this week
**Estimated time:** 45 min
**Depends on:** Task 09 (CRM), 🧑 HUMAN: delegate data from Kara

## What To Build
1. CSV/Excel import function for the delegate list
2. Parse and load into NocoDB Delegates table
3. Precinct heat map visualization:
   - Color-code precincts by support level (strong/lean/unknown/opposed)
   - Overlay on HD14 district map (from Task 11)
   - Show delegate count per precinct
4. Summary stats: total delegates, contacted %, support level breakdown

## Data Needed (🧑 HUMAN)
- Delegate list from Kara (CSV, Excel, or Google Sheet)
- Precinct boundary data (Davis County GIS or Utah UGRC)
- Any existing door-knock or contact data

## Acceptance Criteria
- [ ] Import function handles CSV and Excel
- [ ] Heat map renders with real precinct boundaries
- [ ] Support levels are color-coded
- [ ] Stats update as data changes

## When Done
Commit: `build: complete task 14 — delegate import and precinct heat map`
---

