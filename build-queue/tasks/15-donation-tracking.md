# TASK 15 — Donation Tracking Integration
**Priority:** LOW — Nice to have this week
**Estimated time:** 30 min
**Depends on:** 🧑 HUMAN: Anedot dashboard access

## What To Build
1. If Anedot offers webhooks or API:
   - Wire donations to create records in NocoDB Donors table
   - Show real-time donation total on internal dashboard
2. If no API available:
   - Manual entry form in War Room for logging donations
   - Running total display
3. Donation goal tracker visualization (thermometer or progress bar)
4. Donor thank-you email trigger (via Task 07 email infrastructure)

## Acceptance Criteria
- [ ] Donations appear in CRM
- [ ] Running total visible in War Room
- [ ] Goal tracker updates in real time
- [ ] Thank-you email sends (or queues) for each donation

## When Done
Commit: `build: complete task 15 — donation tracking integration`
