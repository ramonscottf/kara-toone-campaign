# NEEDS FROM SCOTT — Code-a-thon, April 3, 2026

## Photos Needed (for ChatGPT editing)

### Priority Photos
1. **Professional headshot with neutral background** — needed for Open Graph / social sharing image (currently using KARA2N4UTAH.png which is a logo, not a photo)
2. **At a podium or speaking** — for "Why She's Running" section
3. **Walking through a neighborhood** — for Growth & Infrastructure priority page
4. **In a classroom or with educators** — for Education priority page
5. **With local business owners** — for Fiscal Responsibility priority page
6. **Shaking hands / meeting voters** — for events section when it goes live
7. **At the Utah Capitol** — for legislative credibility

### Current Photo Inventory on R2
- 02_Hero_Images/: Hero_YellowBlazer_FullBody.jpg, Hero_BurgundySweater_Outdoor.jpg
- 03_Headshots/: Headshot_CloseUp_38.jpg
- 04_Family_Photos/: Family_Formal.jpeg, Couple_Outdoors.jpeg, Family_Outdoor_Steps.jpeg, Family_IceCream.jpeg
- 05_Community_Involvement/: AmericanFlag_WithStudents.jpeg

### Photo Editing Guidelines
- Keep Kara's face 100% accurate
- Backgrounds can be swapped (Davis County scenes, Capitol, school hallways)
- Lighting: consistent warm natural light
- Clothing: campaign colors (navy blazer, burgundy top, or white blouse)
- Must not look AI-generated

---

## Performance Issues

### Image Dimensions
- **All 67 images across the site lack explicit width/height attributes**
- This causes Cumulative Layout Shift (CLS) — bad for Core Web Vitals
- Scott should determine actual image dimensions and add width/height attributes, OR use CSS aspect-ratio on image containers
- Priority pages (5 files) and landing pages (9+ files) each have multiple images without dimensions

---

## Mobile QA Items (visual verification needed)

- [ ] Navigation hamburger menu works on all pages
- [ ] Hero images not cropped weirdly on 375px viewport
- [ ] Text readable / no overflow on comparison section at 375px
- [ ] Buttons are tappable (min 44px touch target)
- [ ] Donation buttons prominent and accessible
- [ ] Volunteer form works and submits on mobile
- [ ] Comparison table stacks properly on mobile (CSS added, needs visual check)
- [ ] Footer links are tappable
- [ ] New district-data.html renders correctly on mobile
- [ ] Stats cards on district-data.html stack properly at 375px

---

## Content Questions

- [ ] Confirm student count is ~67,000 (used across all pages now)
- [ ] Confirm John Taylor comparison points are accurate and appropriate
- [ ] Confirm "substance over slogans" language in comparison callout
- [ ] Any specific endorsements ready to add?
- [ ] Any events confirmed to replace the placeholder section?
- [ ] Guess the Graph content — when will the interactive be ready?
- [ ] HD14 stats: need median household income and commute pattern data to complete the district data page
