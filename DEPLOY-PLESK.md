# Deploying to GoDaddy / Plesk via GitHub

This site is **static** (HTML/CSS/JS + assets) — no build step. Plesk can pull
straight from GitHub and deploy on every push. It can run alongside the
Cloudflare Worker deployment without any conflict.

## One-time setup in Plesk

1. **Websites & Domains → Git → Add Repository.**
2. **Remote Git hosting** → repository URL:
   `https://github.com/rudeboye2k/darrenkre`
   - **Private repo?** Plesk shows an SSH **deploy key** — copy it, then add it in
     GitHub: **repo → Settings → Deploy keys → Add deploy key** (read-only is fine).
   - Public repo: no key needed.
3. **Branch:** `main`.
4. **Deployment path:** the domain's document root (usually `httpdocs`).
   The site's `index.html` is at the repo root, so it lands directly in the docroot.
5. **Deployment mode:** turn on **Automatic** so a webhook redeploys on every push.
   (Or leave it manual and click **Pull & Deploy** when you want to publish.)

## After the first deploy

- **SSL:** Websites & Domains → **SSL/TLS Certificates** → install a free
  **Let's Encrypt** cert for `darrenkre.com` and `www.darrenkre.com` (still needed —
  the domain now redirects to darrenkrealestate.com, and the redirect itself
  needs to happen over HTTPS).
- **Force HTTPS:** enable **"Permanent SEO-safe 301 redirect from HTTP to HTTPS"**
  (Hosting & DNS → Hosting Settings, or the SSL/TLS screen). Do this in the panel
  rather than `.htaccess` to avoid redirect loops.
- **404 page:** `.htaccess` already sets `ErrorDocument 404 /404.html`. If your
  Plesk serves static files via nginx (bypassing Apache/.htaccess), set the custom
  error document in **Apache & nginx Settings** instead.

## Notes

- `.htaccess` (caching, security headers, 404) applies on Apache/Plesk and is
  **ignored by the Cloudflare Worker** — safe for both.
- The `CNAME` file in the repo is a leftover GitHub-Pages artifact; Plesk and
  Cloudflare both ignore it functionally. It now reads `darrenkrealestate.com`
  for consistency with the rest of the site.
- **Domain update:** darrenkrealestate.com is now the canonical live site.
  All absolute URLs (Open Graph, Twitter, `sitemap.xml`, `robots.txt`, JSON-LD,
  and the business email addresses) have been switched to it. `darrenkre.com`
  is expected to become a 301 redirect to darrenkrealestate.com shortly — once
  that's confirmed live, consider adding `rel="canonical"` tags pointing at
  darrenkrealestate.com so search engines consolidate on the right domain.
