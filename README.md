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
    ├── js/main.js        # Mobile nav + footer year
    └── img/              # Hero & section imagery
```

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
