# DecapCMS Setup Guide

## Overview

This campaign website now includes DecapCMS (formerly Netlify CMS), a Git-backed content management system that allows Kara and campaign staff to edit website content without coding knowledge. The CMS is integrated with the existing static HTML site while keeping all original functionality intact.

## Architecture

### Keep It Simple Approach
- **Original HTML files remain unchanged** - All existing index.html, about.html, priority pages, styles.css, and main.js are untouched
- **Content files in version control** - Site content is stored as YAML and Markdown files in the `content/` directory
- **GitHub as the backend** - All changes are committed to the GitHub repository (ramonscottf/kara-toone-campaign, main branch)
- **Cloudflare Pages Functions for OAuth** - GitHub OAuth authentication happens through serverless functions

## File Structure

```
kara-toone-campaign/
├── admin/
│   ├── index.html          # CMS entry point - visit /admin/
│   └── config.yml          # CMS configuration
├── content/
│   ├── settings.yml        # Global site settings
│   ├── home.yml           # Home page content
│   ├── about.yml          # About page content
│   ├── priorities/        # Priority page content (markdown)
│   ├── blog/              # Blog posts (future feature)
│   ├── events/            # Events (future feature)
│   └── gallery/           # Gallery images (future feature)
├── functions/
│   └── api/
│       ├── auth.js        # OAuth initiation
│       └── callback.js    # OAuth callback handler
├── static/
│   └── images/
│       └── uploads/       # User-uploaded images via CMS
├── index.html             # Home page (UNCHANGED)
├── about.html             # About page (UNCHANGED)
├── priorities/            # Priority pages (UNCHANGED)
├── styles.css             # Stylesheet (UNCHANGED)
├── main.js                # JavaScript (UNCHANGED)
├── CNAME                  # Domain config (UNCHANGED)
└── package.json           # Dependencies
```

## Accessing DecapCMS

1. Visit: **https://kara.wickowaypoint.com/admin/**
2. Click "Login with GitHub"
3. Authorize the application (GitHub OAuth)
4. You'll be logged into the CMS

## GitHub Configuration

The CMS is already configured to use:
- **Repository**: ramonscottf/kara-toone-campaign
- **Branch**: main
- **Client ID**: Ov23lioEN5NhGom24hFh

The Client Secret is stored securely in Cloudflare Pages environment variables.

## Editing Content

### Collections Available

#### 1. Site Settings (`content/settings.yml`)
Edit global settings like:
- Site title and tagline
- Social media links
- Donation and Venmo URLs
- Contact email
- Logos

#### 2. Home Page (`content/home.yml`)
Edit the home page content:
- Hero section (eyebrow, title, subtitle, image, CTA)
- Ticker items
- Priorities section
- Events section
- Get Involved section
- Donate section

#### 3. About Page (`content/about.yml`)
Edit Kara's biography and background:
- Hero section
- Story section
- Education timeline
- Family section
- Career positions
- Leadership section
- Why Running section

#### 4. Priorities (5 pages in `content/priorities/`)
Edit detailed priority pages:
- **growth-infrastructure.md** - Davis County growth and infrastructure challenges
- **housing.md** - Affordable housing and housing policy
- **public-safety.md** - Law enforcement support and community safety
- **education.md** - School funding and educational support
- **fiscal-responsibility.md** - Government transparency and fiscal policy

Each priority page includes:
- Hero section with image
- Overview section
- Statistics (numbers and descriptions)
- Detailed sections with content and images
- Solution cards (key points)
- Policy lists
- Quotes

#### 5. Blog Posts (`content/blog/`)
Create new blog posts with:
- Title, date, author
- Featured image
- Excerpt
- Full markdown body

#### 6. Events (`content/events/`)
Create and manage events with:
- Title, date, end date
- Location and address
- Description
- Event image
- RSVP URL

#### 7. Gallery (`content/gallery/`)
Create photo galleries with:
- Title, date, category
- Featured image
- Multiple gallery images with captions
- Description

## Workflow

### Making Changes in DecapCMS:

1. Log in at `/admin/`
2. Select the collection you want to edit
3. Click on the item you want to edit
4. Make your changes
5. Click **Save** (creates a commit to main branch automatically)
6. The site updates within seconds (Cloudflare Pages auto-deploys on push)

### Reviewing Changes Before Publishing:

If you want to review changes before publishing:
1. Create a new Git branch
2. Make changes in DecapCMS
3. Create a pull request on GitHub
4. Review and merge when ready

(This requires configuring the CMS to use a different branch - contact developer if needed)

## Media Uploads

When you upload images through DecapCMS:
- Images are stored in `/static/images/uploads/`
- They're committed to the GitHub repository
- They're served from `https://kara.wickowaypoint.com/images/uploads/[filename]`

## Technical Details for Developers

### Decap Configuration

The CMS is configured via `admin/config.yml` with:
- **Backend**: GitHub with OAuth via Cloudflare Functions
- **Collections**: File-based (single files) and folder-based (multiple files)
- **Media folder**: `/static/images/uploads/`
- **Widgets**: Various input types (string, text, markdown, image, list, object, datetime, select)

### OAuth Flow

1. User clicks "Login with GitHub" → `/api/auth`
2. Redirects to GitHub authorization
3. GitHub redirects back to `/api/callback` with authorization code
4. Cloudflare Function exchanges code for access token
5. Token is passed to DecapCMS for authenticated GitHub API access

### Deployment

The site is deployed via **Cloudflare Pages**:
- Repo: ramonscottf/kara-toone-campaign
- Branch: main
- Build command: None (static site)
- Publish directory: / (root)

When you push to main, Cloudflare Pages automatically deploys the new version.

## Future Enhancements

Current setup provides foundation for:
- Blog posts and news updates
- Event management and calendar
- Photo galleries and media
- Team member pages
- Newsletter signup integration
- Analytics and performance tracking

## Support & Troubleshooting

### Can't log in to DecapCMS?
- Check that you have write access to ramonscottf/kara-toone-campaign on GitHub
- Make sure you're using the GitHub account authorized for the repo
- Clear browser cache and try again

### Changes not appearing on site?
- Check that the CMS shows "Published" status
- Wait 30-60 seconds for Cloudflare Pages deployment
- Do a hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Want to add a new collection?
- Edit `admin/config.yml` to add a new collection
- Create the corresponding content file(s)
- Commit and deploy

### Questions about DecapCMS?
- Official docs: https://decapcms.org/docs/
- This setup is based on Decap CMS v3.0.0

## File Paths Reference

All editable content files:
- `/content/settings.yml` - Global settings
- `/content/home.yml` - Home page
- `/content/about.yml` - About page
- `/content/priorities/growth-infrastructure.md` - Priority 1
- `/content/priorities/housing.md` - Priority 2
- `/content/priorities/public-safety.md` - Priority 3
- `/content/priorities/education.md` - Priority 4
- `/content/priorities/fiscal-responsibility.md` - Priority 5

OAuth Functions:
- `/functions/api/auth.js` - OAuth initiation
- `/functions/api/callback.js` - OAuth callback

Admin Files:
- `/admin/index.html` - CMS interface
- `/admin/config.yml` - CMS configuration

Original Static Files (unchanged):
- `/index.html` - Home page
- `/about.html` - About page
- `/priorities/*.html` - Priority pages
- `/styles.css` - Stylesheet
- `/main.js` - JavaScript
- `/CNAME` - Domain configuration
