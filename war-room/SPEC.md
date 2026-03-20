# Campaign Connect — Product Spec & Technical Architecture

**Version:** 0.1 (Brainstorm → Build)
**Date:** March 19, 2026
**Author:** Scott Foster
**Stack:** Cloudflare Pages/Workers • Google Sheets API • Resend • Twilio • Claude API
**Repo:** TBD (recommend `ramonscottf/campaign-connect`)
**First Client:** Kara Toone, Utah House District 14, ~93 delegates, convention mid-April 2026

-----

## 1. PRODUCT VISION

A political connection tool for candidates. Not a CRM — a **connection platform**. The core insight: campaigns are won by making 93 people (or 5,000, or 50,000) feel like they are the candidate's best friend. Every feature exists to help a candidate remember, reach, and relate to every person they interact with.

### Core Value Proposition

- Candidates connect with people better, faster, and with more context than any opponent
- Every interaction (call, text, email, door knock, convention handshake) is captured and surfaces at the right moment
- AI augments the candidate's memory and relationship intelligence — not replacing human connection, but supercharging it

### Target Market

- Local/state candidates (Utah first, then expand)
- Political consultants who manage multiple candidates
- White-label ready: rebrandable per consultant or firm

### Revenue Model

- Per-campaign subscription ($97-$297/month depending on tier)
- Consultant tier: manage multiple campaigns under one account ($497-$997/month)
- Infrastructure cost per campaign: ~$25-50/month (Cloudflare free tier + Twilio + Resend)

-----

## 2. DATA LANDSCAPE — What's Available

### 2.1 Utah Voter File (Primary Source)

- **Source:** Utah Lieutenant Governor's Office (elections.utah.gov)
- **Cost:** $1,050 for statewide file; county-level files available cheaper through county clerks
- **Format:** Tab-delimited CSV
- **Fields available publicly:** Name, address, precinct, party affiliation, districts, vote history (2016+)
- **Fields available to candidates/parties:** Year of birth, private voter records (requires documentation proving candidate status per Utah Code 20A-2-104)
- **Protected (never available):** SSN, driver's license, email, full DOB, phone, signature
- **Update frequency:** Static file with one-time purchase; daily early-vote reports available during election windows ($35/election)
- **Key limitation:** No email or phone numbers in the file. These must be gathered through outreach.

### 2.2 L2 Data (Enhanced Voter File)

- **What it is:** Commercial voter data vendor with 600+ demographic/psychographic/behavioral attributes appended to voter records
- **What it adds beyond state file:** Modeled ethnicity, religion, income, education, consumer data, issue preferences, social media presence, phone numbers, emails (modeled/appended)
- **Pricing:** Contact-based; typically $0.03-0.10 per record depending on attributes
- **Integration:** API available; works with NationBuilder natively
- **Best for:** Enriching the base voter file with contact info and demographic modeling
- **Website:** l2-data.com

### 2.3 TargetSmart

- **What it is:** Democratic-leaning voter data vendor with 263M+ individual database
- **What it adds:** Voter registration status verification, voter scores (partisanship, turnout likelihood, issue scores), phone/email append
- **Pricing:** Sales-driven, custom quotes
- **Best for:** Campaigns that need predictive modeling and voter scoring
- **Note:** Primarily used by Democratic campaigns; may have perception issue for Republican-leaning races

### 2.4 NationBuilder (CRM + Free Voter File)

- **What it is:** Political CRM with free voter file access
- **Free tier includes:** District/county voter files with basic info (name, address, party, vote history)
- **Paid tiers:** $39-$119+/month based on contact count
- **Key feature:** Integrates with L2 for enhanced data append
- **Limitation:** It's a full CRM — we're building a competitor, not integrating with it

### 2.5 TurboVote / Democracy Works

- **What it is:** Voter engagement platform (registration assistance, election reminders)
- **NOT a campaign tool** — it's a nonpartisan voter registration/reminder service
- **Relevant for us:** Their data pipeline (powered by TargetSmart) shows what's possible; their webhook/API approach is a good architecture model
- **Not directly useful for delegate tracking**

### 2.6 Utah Republican Party Delegate Lists

- **Source:** County GOP parties publish delegate lists after caucus
- **Timing:** Official lists typically available ~1 week after caucus night (March 17 was caucus; expect list by ~March 24-26)
- **Format:** Usually PDF or spreadsheet distributed to candidates
- **Fields:** Name, precinct, sometimes phone/email
- **Access:** Available to declared Republican candidates

### 2.7 Public Records / Social Media

- **Voter search:** votesearch.utah.gov (individual lookup, not bulk)
- **Property records:** County assessor sites (link address to property owner)
- **Social media:** LinkedIn, Facebook, X — manual or API-based enrichment
- **Church/community directories:** Common in Utah GOP politics (informal but powerful)

-----

## 3. FEATURE SPECIFICATION

### 3.1 Delegate Tracker (MVP — Build First)

**Purpose:** Track every delegate, their support level, and every interaction.

**Core features:**

- Delegate roster with confirmed/projected status
- Support level tracking (Strong Support → Strong Opponent → No Contact)
- Win number calculator (auto-calculates majority threshold)
- Priority queue (auto-sorts who to call next based on support level + contact attempts)
- Precinct heat map (visual support distribution by geography)
- Interactive map (Mapbox GL JS or Leaflet with precinct boundaries)
- Bulk import (paste from spreadsheet or CSV upload when official list drops)

**Data model (per delegate):**

```
id, first_name, last_name, email, phone, address, city, zip,
precinct, confirmed (bool), support_level (enum), priority (enum),
contacted (bool), contact_attempts (int), last_contact_date,
email_sent (bool), email_opened (bool), phone_answered (bool),
notes (text), tags (array), created_at, updated_at
```

### 3.2 Messaging Engine (Core Differentiator)

**Purpose:** Segmented, tracked communications from one interface.

**Channels:**

- **Email blasts** via Resend API (3,000/month free, then $20/month for 50K)
- **SMS blasts** via Twilio ($0.0079/segment outbound)
- **Group texts** — segmented by support level, precinct, tags, custom filters
- **Individual texts** — quick send from contact detail view

**Tracking:**

- Email: open tracking (pixel), click tracking (link wrapping)
- SMS: delivery confirmation, reply capture
- All messages logged to contact timeline automatically

**Merge fields:** `{first_name}`, `{last_name}`, `{precinct}`, `{city}`, custom fields

**Templates:** Save and reuse message templates (initial outreach, follow-up, thank-you, GOTV)

### 3.3 Interaction Timeline (The Memory Layer)

**Purpose:** Every touchpoint with every person, in chronological order.

**Auto-captured:**

- Emails sent/received (via Resend webhooks + Gmail API read)
- Texts sent/received (via Twilio webhooks)
- Form submissions from website
- Email opens and link clicks

**Manually captured:**

- Quick-note button (convention mode: tap, type 30 seconds of context, save)
- Door-knock log (address visited, response, support level, notes)
- Phone call log (duration, outcome, notes)
- Meeting/event interaction notes

**AI-enhanced:**

- Call recording + transcription (see 3.5)
- AI summary of conversation highlights
- Auto-extraction of commitments ("said they'd put up a yard sign," "wants to talk about education funding")
- Suggested follow-up actions based on conversation content

### 3.4 Convention Quick-Capture Mode

**Purpose:** At convention, Kara is shaking 93 hands in 3 hours. She needs to log interactions in seconds.

**UI:** Full-screen mobile interface

- Search delegate by name (fuzzy match)
- One-tap support level update
- Voice-to-text note (hold button, speak, release — transcribed and saved)
- Photo capture (take photo with delegate, auto-linked to their profile)
- Swipe to next delegate

### 3.5 AI Audio Capture & Transcription

**Purpose:** Record and transcribe conversations, extract insights automatically.

**Implementation options (ranked by practicality):**

1. **Otter.ai / Fireflies.ai integration** — Phone calls and meetings auto-transcribed. Otter has API access. ~$8-16/month.
1. **Whisper API (OpenAI)** — Self-hosted transcription. Upload audio → get transcript. $0.006/minute. Can run on Cloudflare Workers with audio chunking.
1. **Claude API for analysis** — Feed transcripts to Claude for: summary extraction, commitment tracking, sentiment analysis, follow-up suggestion generation.
1. **Plaud.ai / Limitless pendant** — Wearable AI recorders. Plaud NotePin ($169) clips to clothing, records all day, transcribes via app. Limitless Pendant ($99) similar concept. Both have API/export options.
1. **AI glasses (future)** — Meta Ray-Ban smart glasses with AI. Currently can see and hear but limited API access. Could theoretically provide real-time delegate info overlay. Experimental/aspirational for now.

**Recommended MVP approach:** Plaud NotePin for field recording + Whisper API for transcription + Claude API for analysis. Total: ~$169 hardware + pennies per conversation.

**Privacy note:** Utah is a one-party consent state for recording. Kara can legally record any conversation she is part of without notifying the other party. However, for political optics, visible recording (like a phone on the table) may be preferable to covert recording.

### 3.6 Relationship Intelligence (The "Best Friend" Feature)

**Purpose:** Before Kara talks to anyone, she should know everything relevant about them.

**Contact enrichment sources:**

- Voter file data (party, vote history, precinct, age range)
- Social media profiles (LinkedIn, Facebook — manual link or API scrape)
- Property records (homeowner? Renter? Property value?)
- Interaction history from our system (every email, text, call, note)
- Donation history (if applicable)
- Family connections (spouse? Kids? Same-household voters?)
- Church/ward (extremely relevant in Utah GOP politics)
- Occupation/employer (from L2 data or manual entry)

**AI briefing card:** Before a phone call or meeting, generate a one-paragraph briefing:

> "John Smith, FG-03, Farmington. Registered Republican since 2010, voted in every primary since 2014. Homeowner, estimated age 45-50. You texted him March 19 — he opened but didn't reply. His wife Mary is also a delegate in the same precinct. Works at Hill AFB (per LinkedIn). Education and property taxes are likely hot buttons. No prior campaign involvement found."

### 3.7 Door-Knocking Mode

**Purpose:** Mobile-optimized canvassing interface.

**Features:**

- Walk list (ordered by address for efficient routing)
- Map view with pins (color-coded by support level)
- At-the-door quick form: response (support level), notes, yard sign request, follow-up needed
- GPS tracking (optional: log which houses visited, generate coverage heat map)
- Offline mode (syncs when back online — critical for areas with poor cell coverage)

### 3.8 Campaign Dashboard

**Purpose:** At-a-glance overview of campaign health.

**Widgets:**

- Win number vs. safe votes gauge
- Support level distribution (heat bar)
- Contact rate (% of delegates reached)
- Communication volume (emails sent, texts sent, calls made this week)
- Upcoming events/deadlines
- Recent activity feed
- Delegate leaderboard (most engaged supporters)

-----

## 4. TECHNICAL ARCHITECTURE

### 4.1 Stack

```
Frontend:    React (Vite) → Cloudflare Pages
Backend:     Cloudflare Workers (serverless functions)
Database:    Google Sheets API (MVP) → migrate to D1 (Cloudflare SQLite) or Turso
Auth:        Cloudflare Access (simple email-based auth)
Email:       Resend API
SMS:         Twilio API
AI:          Claude API (Anthropic) for analysis/briefings
Transcribe:  Whisper API or Deepgram
Maps:        Mapbox GL JS or Leaflet + OpenStreetMap
Storage:     Cloudflare R2 (photos, recordings)
CDN:         Cloudflare (automatic)
Repo:        GitHub (ramonscottf/campaign-connect)
CI/CD:       GitHub Actions → Cloudflare Pages
```

### 4.2 Worker Routes

```
/api/contacts          GET, POST, PATCH — contact CRUD
/api/contacts/:id      GET, PATCH, DELETE — individual contact
/api/contacts/import   POST — bulk CSV import
/api/messages/email    POST — send email blast via Resend
/api/messages/sms      POST — send SMS blast via Twilio
/api/messages/log      GET — communication history
/api/webhooks/resend   POST — email open/click tracking
/api/webhooks/twilio   POST — SMS delivery/reply capture
/api/forms/submit      POST — website form handler
/api/ai/briefing       POST — generate AI briefing card
/api/ai/transcribe     POST — audio upload → transcript
/api/ai/analyze        POST — transcript → insights
/api/sheets/sync       POST — sync to/from Google Sheet
```

### 4.3 Environment Variables

```
GOOGLE_SHEETS_ID=...
GOOGLE_SERVICE_ACCOUNT_KEY=...
RESEND_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
ANTHROPIC_API_KEY=...
MAPBOX_TOKEN=...
```

### 4.4 Data Flow

```
Website Form → Cloudflare Worker → Google Sheet + Resend welcome email
Email Blast → Worker → Resend API → Webhook → Open/click tracked → Sheet updated
SMS Blast → Worker → Twilio API → Webhook → Delivery/reply → Sheet updated
Phone Call → Recording → Whisper transcription → Claude analysis → Timeline entry
Convention → Quick-capture UI → Worker → Sheet + AI note processing
Door Knock → Mobile UI → Worker (queued if offline) → Sheet + map update
```

### 4.5 Migration Path (MVP → Production)

1. **Phase 1 (NOW):** Google Sheets as database. Fast to build. Kara can still see/edit raw data.
1. **Phase 2 (Post-convention):** Migrate to Cloudflare D1 (SQLite at edge). Keep Sheets as optional sync/export.
1. **Phase 3 (Product):** Full D1 + R2 + Durable Objects. Multi-tenant. White-label dashboard.

-----

## 5. COMPETITIVE LANDSCAPE

|Tool                |Price          |Strengths                                                                |Gaps We Fill                                                 |
|--------------------|---------------|-------------------------------------------------------------------------|-------------------------------------------------------------|
|NationBuilder       |$39-$119+/mo   |Full CRM, free voter file, website builder                               |Generic, no AI, no conversation capture, not delegate-focused|
|NGP VAN             |Custom ($$)    |Industry standard for Dems, VoteBuilder                                  |Expensive, Dem-leaning, no AI, enterprise-only               |
|CallHub             |$99-$599/mo    |Phone/text banking, canvassing                                           |No CRM, no AI, no relationship intelligence                  |
|Ecanvasser          |$99-$599/mo    |Canvassing/field ops                                                     |No AI, no messaging, no convention tools                     |
|GoodParty.org       |Free           |AI campaign assistant                                                    |Focused on independents, limited CRM                         |
|GoHighLevel         |$97-$497/mo    |White-label marketing platform                                           |Not political-specific, no voter data, no delegate tracking  |
|**Campaign Connect**|**$97-$297/mo**|**AI-powered, delegate-focused, conversation capture, white-label ready**|**This is us**                                               |

**Our moat:** AI conversation capture + relationship intelligence + convention quick-capture. Nobody else does this. The big platforms track voters as data points. We help candidates track voters as *people they know*.

-----

## 6. BUILD SEQUENCE

### Sprint 1: Foundation (This Week)

- [ ] Create GitHub repo (campaign-connect)
- [ ] Cloudflare Pages project setup
- [ ] Google Sheets API integration (read/write contacts)
- [ ] Delegate tracker UI (React, from war room prototype)
- [ ] Remove all non-Kara-specific content (Spencer, Karen, etc.)
- [ ] Basic auth via Cloudflare Access

### Sprint 2: Messaging (Week 2)

- [ ] Resend integration (email blasts with merge fields)
- [ ] Twilio integration (SMS blasts with merge fields)
- [ ] Email open/click tracking via webhooks
- [ ] SMS delivery/reply capture via webhooks
- [ ] Communication log (auto-populated timeline)

### Sprint 3: Maps & Import (Week 3)

- [ ] Interactive precinct map (Mapbox or Leaflet)
- [ ] Color-coded delegate pins by support level
- [ ] CSV bulk import for official delegate list
- [ ] Website forms (volunteer, yard sign, contact, donate)
- [ ] Form → Sheet → welcome email pipeline

### Sprint 4: AI Layer (Week 4)

- [ ] Claude API integration for AI briefing cards
- [ ] Audio upload → Whisper transcription pipeline
- [ ] Transcript → Claude analysis (summary, commitments, follow-ups)
- [ ] Convention quick-capture mode (mobile UI)
- [ ] Voice-to-text notes

### Sprint 5: Polish & Convention Prep (Pre-Convention)

- [ ] Offline support for mobile (service worker)
- [ ] Door-knocking mode
- [ ] Campaign dashboard with live stats
- [ ] Push notifications for delegate replies
- [ ] Load testing with real delegate data

### Post-Convention: Productize

- [ ] Multi-tenant architecture
- [ ] White-label theming system
- [ ] Onboarding flow for new campaigns
- [ ] Stripe billing integration
- [ ] Marketing site

-----

## 7. IMMEDIATE NEXT STEPS

1. **Create the repo** — `ramonscottf/campaign-connect`, private
1. **Bootstrap Cloudflare Pages project** — React + Vite
1. **Port the delegate war room UI** into the repo (remove mock data, wire to Sheets API)
1. **Set up Google Sheets API** service account for votekaratoone@gmail.com's spreadsheet
1. **Deploy to Cloudflare** — campaign-connect.pages.dev (or custom domain)
1. **Wire up Resend** — first email blast capability
1. **Wire up Twilio** — first text blast capability
1. **Import delegate list** when it drops (~March 26)

-----

## 8. BRAINSTORM IDEAS (Captured for Future)

These are ideas from the initial brainstorm session. Not all will be built, but all are recorded:

- AI glasses (Meta Ray-Ban) that display delegate info in real-time during conversations
- Covert wearable audio recorder that auto-transcribes and analyzes all conversations
- Auto-crawl candidate's email/text history to build interaction timeline retroactively
- Poll tracking integration (if polling data becomes available for local races)
- Predictive support modeling (based on voter file demographics + interaction patterns)
- Auto-generated follow-up messages based on conversation transcripts
- Delegate "warmth score" — composite metric combining: opened emails, answered calls, replied to texts, attended events, social media engagement
- Real-time convention floor tracker — live-updating support count as Kara talks to delegates
- AI-generated talking points customized per delegate based on their likely concerns
- Integration with SignupGenius (Kara already uses it) for volunteer coordination
- Donor tracking with Venmo/Zelle receipt matching
- Family tree mapping (spouse/children who are also delegates or voters)
- Church ward mapping (who goes to church with whom — powerful in Utah politics)

-----

*This document is the source of truth for building Campaign Connect. Ship it to the repo as `SPEC.md` and reference it in every PR.*
