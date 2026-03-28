# TASK 01 — Fix All Broken Forms
**Priority:** CRITICAL — Must ship by Tuesday
**Estimated time:** 30 min
**Depends on:** Nothing

## What's Wrong
The volunteer/contact forms on kara.wickowaypoint.com submit to nowhere. They need working backend handlers.

## What To Build
1. Create a Cloudflare Pages Function at `/functions/api/form-submit.js`
2. Accept POST requests with fields: firstName, lastName, email, phone, helpType
3. Store submissions in one of:
   - A JSON file in R2 (simplest)
   - A Google Sheet via API (if credentials available)
   - A local JSON append (fallback)
4. Send a confirmation email to the submitter (or log it for now)
5. Return a success response that triggers the "Thank you!" message on the form
6. Wire EVERY form on the site to this endpoint:
   - Homepage volunteer form
   - Contact page form
   - Any RSVP forms on event pages

## Acceptance Criteria
- [ ] Submit a test form on the homepage — data is stored
- [ ] Submit from contact page — data is stored
- [ ] "Thank you" message appears after submission
- [ ] No console errors
- [ ] Mobile form submission works

## Files to Touch
- `/functions/api/form-submit.js` (create)
- `index.html` — update form action/JS
- `contact.html` — update form action/JS (if exists)

## When Done
Update BUILD-STATUS.json: task 01 = "done"
Commit: `build: complete task 01 — wire all forms to working backend`
