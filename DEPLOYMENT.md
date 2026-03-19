# Deployment Guide

## Quick Start

The site is deployed to Cloudflare Pages and automatically deploys whenever you push to the `main` branch of the GitHub repository.

### Current Configuration
- **Repository**: ramonscottf/kara-toone-campaign
- **Branch**: main
- **Domain**: kara.wickowaypoint.com (via CNAME)
- **Hosting**: Cloudflare Pages
- **Build**: Static site (no build step required)
- **Publish Directory**: / (root)

## Setup Steps (Already Configured)

### 1. GitHub OAuth (Already Set Up)

The GitHub OAuth credentials are configured for DecapCMS:
- **Client ID**: Ov23lioEN5NhGom24hFh
- **Client Secret**: Set as environment variable in Cloudflare Pages
- **Redirect URI**: https://kara.wickowaypoint.com/api/callback

**Important**: The Client Secret should NEVER be committed to the repository. It's stored securely in Cloudflare Pages environment variables.

### 2. Cloudflare Pages Configuration

To verify or update Cloudflare Pages settings:

1. Log in to Cloudflare dashboard
2. Select the account and domain
3. Go to Pages
4. Find the "kara-toone-campaign" project
5. Settings → Deployments:
   - **Build command**: (leave empty - no build needed)
   - **Build output directory**: (leave empty - static site)
   - **Root directory**: / (default)

### 3. Environment Variables in Cloudflare

Set these environment variables in Cloudflare Pages:

**Production Environment**:
- `GITHUB_CLIENT_SECRET`: efe502060ab75ac3af88b6899914a0531001a4bc

To set these:
1. In Cloudflare Pages project settings
2. Go to Environment → Production
3. Add the variable
4. Save

### 4. Domain Configuration

Domain: **kara.wickowaypoint.com**

CNAME record is already configured:
- Host: kara
- Target: kara-toone-campaign.pages.dev
- TTL: Auto

## Deployment Process

### Automatic Deployment (Recommended)

1. Make changes via DecapCMS at `/admin/`
2. DecapCMS automatically commits to GitHub main branch
3. GitHub webhook notifies Cloudflare Pages
4. Cloudflare Pages deploys the new version
5. Site is live within 30-60 seconds

OR

1. Make changes locally (edit files, test)
2. Commit to GitHub main branch: `git push origin main`
3. Cloudflare Pages auto-deploys
4. Site is live within 30-60 seconds

### Manual Deployment (If Needed)

If you need to manually trigger a deployment:

1. Log in to Cloudflare dashboard
2. Go to Pages → kara-toone-campaign
3. Click the "Deployments" tab
4. Find the commit you want to deploy
5. Click the three-dot menu → "Redeploy deployment"

## Updating GitHub OAuth Secret

If you need to update the GitHub OAuth secret:

1. Generate new credentials at https://github.com/settings/developers
2. Update the environment variable in Cloudflare Pages:
   - Go to Pages settings → Environment
   - Update `GITHUB_CLIENT_SECRET`
3. Update the Client Secret in `functions/api/callback.js` if needed
4. Redeploy

## Monitoring Deployments

To monitor deployment status:

1. **GitHub**: Check the Actions tab for workflow status
2. **Cloudflare Pages**: Monitor deployments and error logs in Pages dashboard
3. **Site Health**: Visit https://kara.wickowaypoint.com to verify site is live

## Rollback

If something goes wrong:

1. In Cloudflare Pages, go to Deployments
2. Find the previous good deployment
3. Click menu → Redeploy
4. The site reverts to that version

Alternatively:
1. Push a new commit that reverts changes to GitHub
2. Wait for auto-deployment

## Troubleshooting

### Site shows 404 errors

**Problem**: Pages can't find files
**Solution**:
1. Verify files exist in the repository
2. Check that Cloudflare Pages publish directory is `/` (root)
3. Redeploy the site
4. Clear browser cache (Cmd+Shift+R)

### DecapCMS not authenticating

**Problem**: GitHub login failing
**Solution**:
1. Verify GitHub OAuth credentials in `functions/api/callback.js`
2. Check `GITHUB_CLIENT_SECRET` environment variable in Cloudflare
3. Verify redirect URI matches in GitHub OAuth app settings
4. Check browser console for error messages

### Changes not appearing

**Problem**: Committed changes not showing on site
**Solution**:
1. Verify the commit was pushed to GitHub main branch
2. Check Cloudflare Pages deployment was triggered
3. Wait 30-60 seconds for deployment to complete
4. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
5. Check browser DevTools for cached files

### Slow deployments

**Problem**: Site taking more than 60 seconds to deploy
**Solution**:
1. Check Cloudflare status page
2. Check GitHub Actions for webhook status
3. Review Cloudflare Pages error logs
4. File a support ticket with Cloudflare if persisting

## Updating the Site

### Adding New Content

1. Use DecapCMS at `/admin/` to create:
   - Blog posts
   - Events
   - Gallery images
2. Or edit directly in files:
   - `content/settings.yml`
   - `content/home.yml`
   - `content/about.yml`

### Editing Existing Pages

1. For HTML structure changes: Edit the original HTML files
2. For content changes: Use DecapCMS or edit content YAML files
3. Commit changes to GitHub
4. Site auto-deploys

### Adding New Sections

1. Edit `admin/config.yml` to add a new collection
2. Create content files/folders
3. Commit to GitHub
4. Redeploy site

## Security Best Practices

1. **Never commit secrets** to the repository
   - GitHub OAuth secret should only be in Cloudflare environment variables
   - Use `.env` files for local development (added to .gitignore)

2. **Limit CMS access**
   - Only GitHub accounts with repository access can edit via DecapCMS
   - Keep GitHub repository permissions restricted

3. **Review changes**
   - Regularly check GitHub for unexpected commits
   - Review DecapCMS changes before they're live

4. **Backup important data**
   - Content files are in GitHub (automatic backup)
   - Upload images are in Cloudflare (automatic backup)

## Maintenance

### Regular Tasks

- **Weekly**: Monitor Cloudflare Pages deployments for errors
- **Monthly**: Review content files for accuracy
- **Quarterly**: Check GitHub OAuth credentials for expiration

### Updates

- Decap CMS updates: The version is specified in `/admin/index.html`
  - Current version: ^3.0.0 (latest compatible v3.x)
  - To update: Change version in the script tag and redeploy

- Cloudflare Pages: Maintained by Cloudflare, no action needed

- Dependencies: Check `package.json` for updates (currently minimal)

## Support Contacts

- **Cloudflare Support**: https://support.cloudflare.com
- **GitHub Support**: https://support.github.com
- **Decap CMS Docs**: https://decapcms.org/docs/
- **Campaign Tech Issues**: Contact the developer

## File Reference

Key files for deployment:

- `/admin/index.html` - DecapCMS interface
- `/admin/config.yml` - CMS configuration
- `/functions/api/auth.js` - OAuth handler
- `/functions/api/callback.js` - OAuth callback
- `/wrangler.toml` - Cloudflare Pages config
- `/package.json` - Project metadata
- `/_redirects` - (if needed for URL rewrites)
- `/robots.txt` - Search engine directives (create if needed)
