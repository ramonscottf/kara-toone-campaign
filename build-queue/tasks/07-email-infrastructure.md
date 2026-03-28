# TASK 07 — Email Infrastructure
**Priority:** HIGH — Ship this week
**Estimated time:** 30 min
**Depends on:** Nothing

## What To Build
1. Set up campaign email routing we control
2. Create sending infrastructure via Brevo (free tier: 300 emails/day) or Resend
3. Configure DNS records on the domain for email deliverability (SPF, DKIM, DMARC)
4. Build a simple email template in campaign brand (navy header, white body, burgundy CTA button)
5. Wire form submissions to send confirmation emails to submitters
6. Create a simple email blast function for volunteer coordination

## Email Template Design
- Header: Navy bar with Kara Toone logo
- Body: White background, clean sans-serif text
- CTA button: Burgundy (#8B2332) with white text
- Footer: Campaign disclaimer, unsubscribe link, social icons

## Acceptance Criteria
- [ ] Confirmation email sends on form submission
- [ ] Email template matches campaign brand
- [ ] SPF/DKIM records configured
- [ ] No emails landing in spam (test with mail-tester.com)

## When Done
Commit: `build: complete task 07 — email infrastructure and templates`
