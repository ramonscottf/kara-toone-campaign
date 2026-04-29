# BUILD PROGRESS — Code-a-thon, April 3, 2026

## Task 1: Update Comparison Section with John Taylor Data (P0)
**Status: COMPLETE**
- Replaced generic "THE OPPONENT" with "JOHN TAYLOR" and 6 real data points
- Updated headline to "This race is about substance."
- Updated subheadline with open seat / June 23 primary messaging
- Reordered Kara column items per spec (Chamber committee moved to position 4)
- Updated bottom callout: "substance over slogans"
- Files: index.html, home.html

## Task 2: Fix Student Count Everywhere (P0)
**Status: COMPLETE**
- Changed all instances of 73,459 / 72,000+ / 72,000 to ~67,000 / approximately 67,000
- Fixed animated counter: added data-target="67" so it animates to "67K+"
- Updated 14+ locations across: index.html, home.html, about.html, priorities/education.html, 4 landing pages, content/priorities/education.md, content/about.yml, mobile/src/data/priorities.ts
- Verified: `grep -r "73,459\|73,000\|72,000"` returns zero results

## Task 3: Replace Events Section (P0)
**Status: COMPLETE**
- Removed 3 placeholder event cards (Apr 5, 12, 22)
- Replaced with centered layout: heading, body text, "Get Event Updates" CTA (scrolls to #volunteer-form), Instagram subtext
- Files: index.html, home.html

## Task 4: Update Endorsements Section (P1)
**Status: COMPLETE**
- Removed 3 generic placeholder endorsement cards
- Replaced with centered text block about endorsements being collected
- Added "Want to endorse Kara?" mailto CTA
- Files: index.html, home.html

## Task 5: Instagram Integration on About Page (P1)
**Status: COMPLETE (no changes needed)**
- Verified all 7 images load from R2 CDN
- Verified captions present under each
- Follow button already styled as btn-primary at line 468
- Student count in caption fixed as part of Task 2

## Task 6: Mobile QA Pass (P1)
**Status: COMPLETE**
- Comparison section already had @media breakpoint at 768px (stacks to 1 column)
- Added 480px breakpoint: stats bar stacks to 1 column, card padding reduces
- Nav hamburger, hero images, buttons, footer all appear mobile-ready per CSS review
- Note: Cannot run browser in this environment — recommend visual QA on device

## Task 7: District Data Page (P2)
**Status: COMPLETE**
- Created district-data.html with HD14 stats (population ~42K, school-age 26%, median home ~$515K, ~67K students, 103 schools, per-pupil rank last)
- Added "Guess the Graph" placeholder section
- Added OLRGC data source citation
- Added "HD14 Data" / "District Data" nav link to: index.html, home.html, about.html, all 5 priority pages
- Added to footer on index/home/about pages
- Full SEO meta tags (OG, Twitter, canonical)

## Task 8: SEO and Meta Tags Check (P2)
**Status: COMPLETE**
- Added canonical URLs to all 5 priority pages
- Added og:url to all 5 priority pages
- Verified: every page has title, meta description, OG tags, Twitter cards
- Verified: one H1 per page across all main pages
- OG image uses KARA2N4UTAH.png from R2 bucket

## Task 9: Performance Optimization (P3)
**Status: COMPLETE (partial)**
- Added loading="lazy" to 2 below-fold images on homepage
- About page Instagram grid already had lazy loading on all 7 images
- All images served from R2 CDN (100% compliance)
- No base64 embedded images found
- **Outstanding**: All 67 images across site lack explicit width/height attributes (see NEEDS-FROM-SCOTT.md)
