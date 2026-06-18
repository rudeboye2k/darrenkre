# Darren K Real Estate, LLC — Website

A modern, mobile-friendly marketing website for **Darren K Real Estate, LLC**, a
licensed New York real estate broker and HUD-certified firm based in Brooklyn, NY.

This is a refreshed 2026 rebuild of the original darrenkre.com site — a clean,
responsive, single-page design with up-to-date branding and contact details.

## Contact

- **Address:** 92 Ralph Avenue, Brooklyn, NY 11221
- **Office:** 718.919.1612
- **Cell:** 917.709.4285
- **Fax:** 718.919.6360
- **Email:** darren@darrenkre.com
- **Web:** darrenkre.com

## Project structure

```
.
├── index.html            # Single-page site
├── CNAME                 # Custom domain for GitHub Pages
└── assets/
    ├── css/styles.css    # Styles (responsive, no build step)
    ├── js/main.js        # Mobile nav, footer year, bio modals
    ├── img/              # Hero, property, press & section imagery
    └── docs/             # Source PDFs linked from the site
```

## Content sources

The site content was rebuilt from the original `darrenkre.com` archive. Notable
items carried forward:

- **Congressional Record tribute (2001):** a U.S. House of Representatives tribute
  to Darren K. Pearson by Congressman Edolphus Towns — featured in the Recognition
  section (`assets/docs/congressional-tribute-2001.pdf`).
- **Daily News feature (1995), "Building Blocks of Future":** the press article
  that gave the firm its mission motto (`assets/docs/daily-news-feature-1995.pdf`).
- **Home valuation form** (`assets/docs/home-valuation-form.pdf`), linked from the
  "What is your home worth?" call to action.
- **1115 Herkimer** — an authentic Brooklyn property photo used in the listings.

Dated 2009-era listing PDFs (specific addresses, stale prices) from the archive
were intentionally left off the live site.

## Tech

Plain HTML, CSS and a touch of vanilla JavaScript — no build tools or
dependencies. Fonts load from Google Fonts.

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying with GitHub Pages

1. Push to the `main` branch.
2. In the repository, go to **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. The included `CNAME` file points the site at `darrenkre.com`. Update your
   domain's DNS to point at GitHub Pages to go live on the custom domain.

## Notes

- Services covered: buying & selling, rentals, property management, mortgages
  (FHA), foreclosures and consulting.
- The contact form uses a `mailto:` action for a no-backend setup. For reliable
  delivery, consider wiring it to a form service (e.g. Formspree) later.
