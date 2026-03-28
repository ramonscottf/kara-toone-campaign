# TASK 05 — Rebuild OLRGC Charts in Campaign Brand
**Priority:** CRITICAL — Must ship by Tuesday
**Estimated time:** 60 min
**Depends on:** Nothing

## What To Build
Create an HD14 Data Hub page at `/district/` or `/data/` with interactive branded charts built from the OLRGC Demographic Profile data.

## Data Source
OLRGC Demographic Profile of House District 14 (ACS 2016-2020)
Key data points extracted (HD14 vs Utah state average):

### Age Distribution
- Age 0-4: 9% vs 8%
- Age 5-17: 26% vs 22% (HIGHLIGHT — more kids)
- Age 18-24: 9% vs 11%
- Age 25-44: 30% vs 28%
- Age 45-64: 18% vs 20%
- Age 65+: 8% vs 11% (younger district)

### Race
- White: 81% vs 79%
- Hispanic/Latino: needs extraction from PDF
- Black: ~2%
- Asian: ~2%
- Pacific Islander: ~1%
- Two or more races: ~9%

### Additional charts to build (extract exact numbers from PDF or use reasonable estimates):
- Household income distribution
- Home ownership rates
- Housing unit values
- Commute times and transportation modes
- Educational attainment
- Veteran population
- Health insurance coverage
- Poverty rates
- SNAP/food stamp usage
- Languages spoken at home

## Design Spec
- Use Chart.js for all charts
- Dark navy (#1B2A4A) background sections alternating with cream (#F5F0E8)
- HD14 data in gold (#C9A84C), state average in muted gray (rgba(255,255,255,0.25))
- Each chart should have a headline insight (e.g., "26% of HD14 residents are school-age children")
- Mobile responsive — charts stack vertically on small screens
- Source attribution at bottom: "Source: OLRGC / U.S. Census ACS 2016-2020"

## Page Structure
1. Hero: "Know Your District" with district map outline
2. Demographics section (age, race, language)
3. Economy section (income, employment, commute)
4. Housing section (ownership, values, rent burden)
5. Families section (household types, children, veterans)
6. Education section (attainment, enrollment)
7. Health & Welfare section (insurance, poverty, SNAP)

## Acceptance Criteria
- [ ] Minimum 10 interactive charts on the page
- [ ] All use campaign brand colors
- [ ] All cite OLRGC/ACS data source
- [ ] Mobile responsive
- [ ] Loads fast (Chart.js from CDN, data inline)
- [ ] Linked from main navigation

## When Done
Update BUILD-STATUS.json: task 05 = "done"
Commit: `build: complete task 05 — HD14 data hub with branded OLRGC charts`
