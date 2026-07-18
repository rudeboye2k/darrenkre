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
- **Two live domains** (confirmed): 
  - **darrenkre.com** — GoDaddy hosting via **Plesk**. Has PHP + email hosting. Updates only when Plesk **re-pulls from GitHub** — so it can lag behind `main` and serves **cached CSS/JS/images**. If a recent change (e.g., a CSS filter) doesn't appear on darrenkre.com, it's almost always stale Plesk cache, not a code bug. Server-side form work (PHP handler) would live here.
  - **darrenkrealestate.com** — **Cloudflare** (Worker, `wrangler.jsonc`, `assets.directory: "."`). Auto-updates from GitHub. Preview: `https://darrenkre.edward-weir.workers.dev/`.
- **Host-independence lesson:** don't rely on CSS/JS alone for a visual that must look identical on both hosts while Plesk may be stale — bake it into the asset when practical (e.g., Darren's bio photo is a **grayscale image file**, not a CSS `grayscale()` filter, so it's B&W even on cached Plesk CSS).
- `git` default branch is **`main`**. Users sometimes upload images straight to GitHub ("Add files via upload" commits) — `git pull --rebase origin main` before working if a file is "missing" locally.

## Design system (luxury editorial)

- **Palette (CSS vars in `assets/css/styles.css`):** `--ink #14130f`, `--cream #f5f2ec`, `--cream-2`, `--paper`, `--accent #9a7b4f` (brass), `--muted #6c665d` (warm grey text), `--line #d9d3c7` (warm hairline), `--line-soft #e7e2d8`. Monochrome + brass accent.
- **Type:** Cormorant Garamond (serif headings) + Inter (body).
- **Motifs:** thin hairline rules, generous whitespace, grayscale-to-color hover on photos, subtle fade/pop modals, IntersectionObserver scroll-reveal.
- **Modal pattern:** `body.modal-open { overflow: hidden }`, `@keyframes fade`, `@keyframes pop`; reused by bio modals, gallery lightbox, and the contact pop-up (`.bio-dialog`/`.bio-backdrop`/`.bio-close` styles are shared).

## Key files

- `index.html` — home (hero, services, about, why, home-value CTA, featured listing, portfolio, contact section, footer).
- `about.html`, `articles.html`, `resources.html` — interior pages.
- `30West13thStreet.html` — dedicated listing page (short URL, no hyphens; one page per listing going forward). **Section order (use for every listing):** Hero (address + price) → **Overview** (`.listing-overview`: stats bar + `.listing-loc` Google Maps link + Inquire button) → **Gallery** (photos + floor plan) → **Description** (collapsible) → **Estimate My Mortgage** (`.mortgage`, at the bottom) → Contact CTA → footer. Photos come before the writeup; the mortgage estimator sits last. Each listing must include the mortgage estimator (`.mortgage` with `data-price="<price>"`, no `$`/commas), the collapsible description, and the Google Maps location link — see Features.
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
- **Cache-busting:** `styles.css` and `main.js` are linked with a `?v=N` query on every page (currently `?v=2`). **Bump `N` on all pages whenever CSS/JS changes** so browsers (and the stale Plesk cache) fetch the new file instead of an old cached one. This does NOT fix Plesk serving stale HTML — that still needs a Plesk re-pull from GitHub.
- **Do not** put the AI model identifier in commits, PRs, or any repo artifact.

## Features implemented

- **Listing gallery** on `30West13thStreet.html`: centered flex grid (no tan empty cells), photos open an in-page **lightbox/carousel** (prev/next arrows, keyboard ←/→/Esc, counter, backdrop close, focus management). A **floor plan** (`.floorplan`) sits under the gallery, click-to-enlarge.
- **Collapsible description** (`.reveal-toggle` + `.reveal-panel[hidden]`, wired in `main.js` via `[data-reveal]`/`aria-controls`): the listing shows the headline + intro, then a brass **"Read the full description +"** toggle expands the rest (The Residence, Features & Finishes, Why This Home Resonates, The Building, Neighborhood & Transit); flips to "Show less ×". Same copy is kept in sync with Darren's **StreetEasy** listing — StreetEasy caps the description at **4,000 characters**, so keep the shared text under that. The agent-only "Co-broking welcome…" line is **not** on the public site (StreetEasy only).
- **Mortgage estimator** (`.mortgage` block, wired in `main.js`): collapsible "Estimate My Mortgage" panel with a brass donut (Principal & Interest / Property Taxes / Maintenance) + Total Monthly, and inputs for home price, down payment ($/% synced with a slider), term (30/15), interest, and monthly taxes/maintenance. **Reusable — reads the price from `data-price`.** P&I uses the standard amortization formula (verified: $2.225M, 20% down, 30yr @ 6.99% → $11,830, matches industry calculators). **Add this block to every listing page**, with that listing's price. **Maintenance/common charges are provided by Darren per property** (30 W 13th, 4A = **$2,979/mo** → total $14,809); for co-ops leave Property Taxes at `$0` (the tax is bundled into maintenance). All inputs stay editable.
- **Location link** on each listing: `.listing-loc` — a brass map pin, the address/neighborhood, and a **View on Google Maps ↗** link (`https://www.google.com/maps/search/?api=1&query=<url-encoded address>`, opens in a new tab). Prefer Google Maps. Add to every listing.
- **Open house pop-up** (`main.js`): elegant site-wide modal (listing photo + date/time/CTAs), shown once per session and auto-expiring after the event date (`OH_KEY` + `deadline` in code). Update or remove for future events.
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
