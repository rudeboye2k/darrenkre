# CLAUDE.md — Darren K Real Estate website

Project memory for this repo. Keep this current when conventions, architecture, or open items change.

## The project

Website for **Darren K Real Estate, LLC** — a Brooklyn-based, licensed New York real estate broker (HUD certified; sales, rentals, management). Built/maintained by developer **Edward Weir** (edward.weir@gmail.com) for the client.

- **NYS broker license #:** 49PE1014348 (New York State **only** — do not add other states)
- **Office:** 92 Ralph Avenue, Brooklyn, NY 11221 · Office 718.919.1612 · Cell 917.709.4285 · Fax 718.919.6360
- **Email:** darren@darrenkre.com · **Domain:** darrenkre.com
- **Principals:** Darren K. Pearson (broker) and Lydia (leadership)

## Architecture & deploy

- **Static HTML/CSS/JS. No build step, no framework.** Plain files served as-is.
- Deployed two ways:
  - **Cloudflare Worker** — `wrangler.jsonc` (`assets.directory: "."`). Preview at `https://darrenkre.edward-weir.workers.dev/`.
  - **GoDaddy / Plesk** — `.htaccess` present; Plesk can pull from GitHub. Has PHP + email hosting.
- **Open question:** which host serves production `darrenkre.com` (Plesk vs Cloudflare). This gates any server-side form work.
- `git` default branch is **`main`**. Users sometimes upload images straight to GitHub ("Add files via upload" commits) — `git pull --rebase origin main` before working if a file is "missing" locally.

## Design system (luxury editorial)

- **Palette (CSS vars in `assets/css/styles.css`):** `--ink #14130f`, `--cream #f5f2ec`, `--cream-2`, `--paper`, `--accent #9a7b4f` (brass), `--muted #6c665d` (warm grey text), `--line #d9d3c7` (warm hairline), `--line-soft #e7e2d8`. Monochrome + brass accent.
- **Type:** Cormorant Garamond (serif headings) + Inter (body).
- **Motifs:** thin hairline rules, generous whitespace, grayscale-to-color hover on photos, subtle fade/pop modals, IntersectionObserver scroll-reveal.
- **Modal pattern:** `body.modal-open { overflow: hidden }`, `@keyframes fade`, `@keyframes pop`; reused by bio modals, gallery lightbox, and the contact pop-up (`.bio-dialog`/`.bio-backdrop`/`.bio-close` styles are shared).

## Key files

- `index.html` — home (hero, services, about, why, home-value CTA, featured listing, portfolio, contact section, footer).
- `about.html`, `articles.html`, `resources.html` — interior pages.
- `30West13thStreet.html` — dedicated listing page (short URL, no hyphens; one page per listing going forward).
- `fair-housing.html` — Fair Housing & Compliance (notices, SOP, licensing).
- `404.html` — uses **absolute** (`/path`) links; other pages use relative.
- `assets/css/styles.css` — all styles (single file). `assets/js/main.js` — all JS (single IIFE, vanilla, ES5-style `var`).
- `assets/img/` — site imagery; `assets/img/portfolio/` — building exterior WebPs; `assets/listings/<Address>/` — per-listing photos.
- `sitemap.xml`, `robots.txt`, favicons in `assets/img/`.

## Conventions

- **Images → WebP.** Convert uploads with Pillow (`quality` ~72–82, `method=6`); name with clean slugs; remove the original JPG/PNG after converting. Keep files small.
- **Match surrounding style** in HTML/CSS/JS; no new dependencies or frameworks.
- **JS:** one IIFE in `main.js`, `var`, feature-guarded (`if (el) {…}`), ES5-compatible.
- **Footer is duplicated across all pages** and must stay in sync (nav links, legal block, license #). When editing the footer, apply to every page (`index, about, articles, resources, 30West13thStreet, fair-housing, 404`).
- **Do not** put the AI model identifier in commits, PRs, or any repo artifact.

## Features implemented

- **Listing gallery** on `30West13thStreet.html`: centered flex grid (no tan empty cells), photos open an in-page **lightbox/carousel** (prev/next arrows, keyboard ←/→/Esc, counter, backdrop close, focus management).
- **Portfolio**: photo-card grid of 10 buildings — **grayscale, turns full color on hover** (5-across desktop / 3 tablet / 2 mobile). 92 Ralph = "Head Office".
- **Fair Housing & Compliance page** + site-wide footer legal block: official **government** notice links (NYS DOS, NYS DHR, NYC CCHR — always linked to source, never a third-party PDF), Darren's own **Standard Operating Procedure** (plus a link to the official NYS DOS SOP page), NYS license #, data-source/verification disclaimer, and anti-scam consumer notice. Adapted for **NY only** (no multi-state list, no machine-translation disclaimer).
- **Equal Housing Opportunity** logo (`assets/img/equal-housing.svg`, `currentColor`) + "Fair Housing & Equal Opportunity" line near listings on home + listing page.
- **Contact pop-up** (`main.js`): one modal injected site-wide, opened by any `[data-contact]` button with a `data-subject`. Subjects: **Website Inquiry, Financing, Foreclosures, Leasing / Building Inquiry, Listing — 30 West 13th St, 4A**. Submits via **`mailto:`**, then **resets the form and closes** the pop-up. Inline home contact form also resets after send. Built so the send step can later be swapped for a real backend in one place.
- **Contact = `mailto:` for now** (client chose this; Outlook users — no Google Forms). Footer/nav "Contact" links still scroll to the home contact section.

## Open items / awaiting client

- **Darren to review the SOP** wording (ID / pre-approval / exclusive-agreement answers) — it's a draft using standard NYS defaults.
- **Secure form submission** (free, self-hosted, no third party): recommended path is a **PHP handler on Plesk** using the domain mailbox — pending confirmation that production runs on Plesk. Cloudflare can't send email free.
- Still needed from client: testimonials, business hours, social links. Optional: monochrome OG banner regen.
- Housekeeping: leftover `CNAME` file; a redundant `cloudflare/workers-autoconfig` branch could be deleted via GitHub UI.

## Workflow / validation

- Validate before committing: `node --check assets/js/main.js`; CSS brace balance `awk '{o+=gsub(/{/,"{");c+=gsub(/}/,"}")} END{print o,c}' assets/css/styles.css` (must match); grep counts to confirm edits landed on every page.
- Commit with a clear message; `git pull --rebase origin main`; `git push -u origin main` (retry with backoff on network errors; commit-signing 503s → retry loop).
- **Do not create a PR unless explicitly asked.** GitHub MCP scope is `rudeboye2k/darrenkre`.
