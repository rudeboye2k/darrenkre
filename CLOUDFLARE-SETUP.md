# Cloudflare Worker + Resend — Setup

The site is served by a Cloudflare Worker that also handles the contact and home
valuation forms. Form submissions are emailed to the office via [Resend](https://resend.com).

## How it works

- `wrangler.toml` — Worker config. Serves the repo root as static assets and runs `src/index.js`.
- `src/index.js` — serves the site, and on `POST /api/valuation` (and `/api/contact`)
  emails the submission via the Resend API.
- The browser form (`#valuationForm`) posts JSON to `/api/valuation`.

## One-time setup

1. **Install deps** (in the project folder):
   ```bash
   npm install
   ```

2. **Create a Resend account** at https://resend.com and make an **API key**
   (Dashboard → API Keys).

3. **Add the key as a Worker secret** (never commit it):
   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```

4. **Deploy:**
   ```bash
   npx wrangler deploy
   ```

## Where submissions go

Set in `src/index.js` (or override via `[vars]` in `wrangler.toml`):

| Var          | Current value                         | Notes                                            |
|--------------|---------------------------------------|--------------------------------------------------|
| `TO_EMAIL`   | `edward.weir@weirenot.com`            | **Testing recipient.** Change to `darren@darrenkre.com` when ready. |
| `FROM_EMAIL` | `Darren K Real Estate <onboarding@resend.dev>` | Resend's test sender. Replace with a verified `darrenkre.com` address for production. |

## Testing notes (important)

Resend's test sender `onboarding@resend.dev` will **only deliver to the email
address that owns the Resend account**. So to receive test emails at
`edward.weir@weirenot.com`, either:

- **Sign up for Resend with `edward.weir@weirenot.com`** (simplest for testing), **or**
- **Verify a domain** in Resend (Dashboard → Domains), then set `FROM_EMAIL`
  to an address on that domain — after which you can send to anyone.

For production on `darrenkre.com`, verify the `darrenkre.com` domain in Resend,
set `FROM_EMAIL` to something like `noreply@darrenkre.com`, and set
`TO_EMAIL` to `darren@darrenkre.com`.

## Local development

```bash
echo "RESEND_API_KEY=your_key_here" > .dev.vars   # git-ignored
npx wrangler dev
```

Then open the local URL and submit the valuation form.
