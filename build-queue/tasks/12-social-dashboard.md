# TASK 12 — Social Media Content Dashboard
**Priority:** MEDIUM — Ship this week
**Estimated time:** 45 min
**Depends on:** Nothing

## What To Build
An internal dashboard page (behind auth) showing the content calendar and social media status.

### Features:
1. Calendar view showing all planned posts (Mar 30 — Jun 23)
2. Each post shows: date, series name, topic, status (drafted/approved/posted)
3. Asset library — thumbnails of all graphics created
4. Quick-create form to draft a new post
5. Export to CSV for use with scheduling tools (Buffer, Later, etc.)

### Calendar Data Structure:
```json
{
  "date": "2026-03-30",
  "series": "Why I'm Running",
  "platform": ["facebook", "instagram"],
  "status": "draft",
  "caption": "",
  "graphic": "",
  "notes": ""
}
```

### Prepopulate with Kara's content calendar (all dates from her document)

## Acceptance Criteria
- [ ] Calendar view renders all planned posts
- [ ] Status tracking works (draft → approved → posted)
- [ ] Mobile accessible
- [ ] Only visible in authenticated app mode

## When Done
Commit: `build: complete task 12 — social media content dashboard`
---

