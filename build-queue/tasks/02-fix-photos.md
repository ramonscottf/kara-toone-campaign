# TASK 02 — Fix Photo Alignment and Quality
**Priority:** CRITICAL — Must ship by Tuesday
**Estimated time:** 30 min
**Depends on:** Nothing

## What's Wrong
Photos are misaligned, cropped poorly, or don't fit their containers properly across the site.

## What To Fix
1. Audit every `<img>` tag on every page
2. Ensure all images use `object-fit: cover` with appropriate `object-position`
3. Hero images should fill their containers without distortion
4. Headshots should be centered on the face (use `object-position: center 20%` or similar)
5. Add proper `loading="lazy"` to below-fold images
6. Add proper `alt` text to every image (SEO + accessibility)
7. Ensure all images are served from `media.kara.fosterlabs.org` (R2 bucket)
8. Add `srcset` for responsive images where possible
9. Check mobile views — images should not overflow or create horizontal scroll

## Pages to Check
- index.html (hero, about section, endorsements, priorities cards)
- about.html (full bio page with multiple photos)
- Each priority page (growth, housing, safety, education, fiscal)
- Any event pages

## Acceptance Criteria
- [ ] No stretched or distorted images on any page
- [ ] All hero images fill containers properly on desktop AND mobile
- [ ] All headshots centered on face
- [ ] Every image has alt text
- [ ] No horizontal scroll on mobile from image overflow

## When Done
Update BUILD-STATUS.json: task 02 = "done"
Commit: `build: complete task 02 — fix all photo alignment and quality`
