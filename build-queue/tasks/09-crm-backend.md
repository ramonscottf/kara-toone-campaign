# TASK 09 — CRM Backend (NocoDB or Baserow)
**Priority:** HIGH — Ship this week
**Estimated time:** 90 min
**Depends on:** Task 01 (forms must work first)

## What To Build
Set up NocoDB (open-source Airtable) as the campaign CRM. Can run via Docker on Mac Studio or use NocoDB Cloud free tier for immediate access.

### Option A: NocoDB Cloud (fastest — do this first)
1. Sign up at nocodb.com (free tier, unlimited records)
2. Create a base called "Kara Toone Campaign"
3. Create tables:
   - **Contacts** (firstName, lastName, email, phone, source, dateAdded, notes, status)
   - **Volunteers** (linked to Contacts, helpType, availability, assigned, doorKnockCount)
   - **Donors** (linked to Contacts, amount, date, method, recurring)
   - **Events** (name, date, location, type, rsvpCount, notes)
   - **DoorKnocks** (address, precinct, date, volunteer, result, voterName, notes)
   - **Delegates** (name, precinct, phone, email, supportLevel, contacted, notes)
   - **Communications** (linked to Contact, type, date, content, response)
4. Create Form Views for each table (NocoDB generates embeddable forms)
5. Set up the NocoDB API key
6. Wire website form submissions to create rows in the Contacts table via API

### Option B: Docker on Mac Studio (do after Option A is working)
```bash
docker run -d --name nocodb \
  -p 8080:8080 \
  -v nocodb-data:/usr/app/data/ \
  nocodb/nocodb:latest
```

## Acceptance Criteria
- [ ] NocoDB instance running and accessible
- [ ] All 7 tables created with proper fields
- [ ] Website form submissions create Contact records
- [ ] API connection tested and working
- [ ] Kara can log in and view/edit records

## When Done
Commit: `build: complete task 09 — CRM backend with NocoDB`
---

