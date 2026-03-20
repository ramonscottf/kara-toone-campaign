# Kara Toone Campaign — Full Site Map

**Domain:** kara.wickowaypoint.com
**Stack:** Cloudflare Pages + Workers | Google Sheets | Resend | Twilio

---

## Public Pages (13)

| Path | Title | Purpose |
|------|-------|---------|
| `/` | Kara Toone — Utah House District 14 | Main homepage: hero, video, priorities, endorsements, events, volunteer, donate |
| `/about.html` | About Kara Toone | Full biography, education journey, family, career, why she's running |
| `/priorities/education.html` | Education & Schools | Policy: education funding, student support (her expertise) |
| `/priorities/fiscal-responsibility.html` | Fiscal Responsibility | Policy: transparency, budgets, local control |
| `/priorities/growth-infrastructure.html` | Growth & Infrastructure | Policy: transportation, housing, land-use planning |
| `/priorities/housing.html` | Housing Affordability | Policy: first-time homebuyer solutions |
| `/priorities/public-safety.html` | Safe Communities | Policy: law enforcement, community policing |

---

## Landing Pages (12)

All under `/landing/` — mobile-first, targeted audience pages.

| Path | Target Audience |
|------|----------------|
| `/landing/` | Directory/index of all landing pages |
| `/landing/meet-kara.html` | General intro — "Your Neighbor for HD14" |
| `/landing/delegate-overview.html` | Convention delegates — overview |
| `/landing/delegate-education.html` | Delegates interested in education |
| `/landing/delegate-fiscal.html` | Delegates interested in fiscal policy |
| `/landing/delegate-growth.html` | Delegates interested in growth |
| `/landing/delegate-housing.html` | Delegates interested in housing |
| `/landing/delegate-public-safety.html` | Delegates interested in public safety |
| `/landing/community-roots.html` | Community connections |
| `/landing/homeowners.html` | Homeowners — housing & property issues |
| `/landing/parents.html` | Parents — education & family |
| `/landing/veterans-first-responders.html` | Veterans & first responders |
| `/landing/young-families.html` | Young families — affordability |

---

## Internal / Admin Pages (3)

| Path | Title | Purpose |
|------|-------|---------|
| `/admin/` | Content Manager | Decap CMS for blog/event content (GitHub OAuth) |
| `/connect/` | Campaign Connect | Legacy internal dashboard |
| `/war-room/` | Campaign Connect (War Room) | New campaign command center — contacts, blasts, forms, stats |

---

## API Endpoints (14)

All under `/api/` — Cloudflare Pages Functions (serverless).

### Authentication
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/auth` | Start GitHub OAuth flow (for Decap CMS) |
| GET | `/api/callback` | GitHub OAuth callback handler |

### Contacts
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/contacts` | List contacts (filters: `search`, `support`, `type`, `precinct`, `priority`) |
| POST | `/api/contacts` | Create new contact |
| GET | `/api/contacts/:id` | Get single contact |
| PATCH | `/api/contacts/:id` | Update contact fields |
| DELETE | `/api/contacts/:id` | Delete contact |
| POST | `/api/contacts/import` | Bulk CSV/JSON import with deduplication |

### Forms
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/forms/submit` | Handle form submissions (volunteer, yardsign, contact, donate) + welcome email |

### Messaging
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/messages/email` | Email blast via Resend (merge fields, tracking pixels, batching) |
| POST | `/api/messages/sms` | SMS blast via Twilio (merge fields, opt-in check, batching) |
| GET | `/api/messages/log` | Communication log (filters: `contact_id`, `channel`, `since`) |

### Webhooks
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/webhooks/resend` | Resend events: delivered, opened, clicked, bounced |
| POST | `/api/webhooks/twilio` | Twilio incoming SMS replies, delivery status |

---

## Environment Variables (Cloudflare Pages Settings)

| Variable | Service | Required |
|----------|---------|----------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google Sheets API (full JSON key) | Yes |
| `GOOGLE_SHEETS_ID` | Spreadsheet ID from URL | Yes |
| `RESEND_API_KEY` | Resend email service | Yes |
| `RESEND_FROM_EMAIL` | Sender address (e.g. noreply@kara.wickowaypoint.com) | Yes |
| `RESEND_WEBHOOK_SECRET` | Webhook signature verification | Optional |
| `TWILIO_ACCOUNT_SID` | Twilio SMS | For SMS |
| `TWILIO_AUTH_TOKEN` | Twilio SMS | For SMS |
| `TWILIO_PHONE_NUMBER` | Twilio sender number | For SMS |
| `GITHUB_CLIENT_SECRET` | Decap CMS OAuth | For CMS |

---

## Google Sheets Structure

**Service Account:** `campaign-connect@campaign-connect-490820.iam.gserviceaccount.com`

### Contacts Tab (columns A-Y)
```
id, first_name, last_name, email, phone, address, city, zip, precinct,
type, source, confirmed, support_level, priority, contacted,
contact_attempts, last_contact_date, email_opened, phone_answered,
opt_email, opt_text, notes, tags, created_at, updated_at
```

### CommLog Tab (columns A-E)
```
contact_id, channel, message_preview, sent_at, status
```

---

## Data Flow

```
Website Form  -->  /api/forms/submit  -->  Google Sheet + Resend welcome email
Email Blast   -->  /api/messages/email -->  Resend API  -->  Webhook  -->  Sheet updated
SMS Blast     -->  /api/messages/sms   -->  Twilio API  -->  Webhook  -->  Sheet updated
CSV Import    -->  /api/contacts/import -->  Google Sheet (deduplicated)
War Room UI   -->  /api/contacts (CRUD) -->  Google Sheet
```
