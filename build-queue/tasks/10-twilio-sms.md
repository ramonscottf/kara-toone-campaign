# TASK 10 — Twilio SMS Integration
**Priority:** HIGH — Ship this week
**Estimated time:** 45 min
**Depends on:** Twilio API keys (🧑 HUMAN: Scott to provide)

## What To Build
1. Cloudflare Worker function for sending SMS via Twilio
2. Endpoints:
   - POST /api/sms/send — send single SMS
   - POST /api/sms/blast — send to a list (volunteers, delegates)
3. SMS templates:
   - Volunteer confirmation: "Thanks for signing up to help Kara's campaign! We'll be in touch soon."
   - Event reminder: "Reminder: [event] tomorrow at [time] at [location]. See you there!"
   - Ballot reminder: "Have you returned your ballot yet? Drop it off at [location] by [date]."
4. Simple SMS dashboard in the app War Room showing sent/pending/failed

## Acceptance Criteria
- [ ] Test SMS sends successfully
- [ ] Volunteer signup triggers confirmation SMS
- [ ] SMS templates stored and editable
- [ ] Blast function can send to multiple numbers

## When Done
Commit: `build: complete task 10 — Twilio SMS integration`
---

