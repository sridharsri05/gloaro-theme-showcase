# GLOARO — Business Theme Showcase & Lead Generation Platform (MVP)

A responsive, light-themed, animated showcase where visitors browse business website themes, open
**live demos** on unique shareable URLs, and submit a **"Create Your Website"** enquiry that is
validated server-side, appended to **Google Sheets**, and emailed to the GLOARO inbox.

**MVP scope:** 2 live categories × 2 themes each (4 visually distinct themes), with 3 more categories
shown as "Coming soon".

| Category | Theme | Theme ID | Demo URL |
|---|---|---|---|
| Restaurant & Food | Saffron & Smoke — Premium Restaurant | `restaurant-premium-dining` | `/themes/restaurant-premium-dining` |
| Restaurant & Food | Crumb & Co. — Bakery & Cafe | `restaurant-bakery-cafe` | `/themes/restaurant-bakery-cafe` |
| Business & Services | Meridian Corp — Corporate Website | `business-corporate` | `/themes/business-corporate` |
| Business & Services | Pulse Studio — Digital Agency | `business-digital-agency` | `/themes/business-digital-agency` |

## Tech stack

- **Frontend:** React 18 + Vite 5, React Router 6, **Framer Motion 11** for animation, plain CSS (no UI library)
- **Backend:** Vercel Node.js serverless function `api/enquiry.js`
- **Lead storage:** Google Sheets API v4 via a service account (`google-auth-library`)
- **Email:** Authenticated SMTP via `nodemailer` (Gmail App Password, Zoho, SendGrid SMTP, etc.)
- **Hosting:** Vercel (SPA rewrites in `vercel.json`)

## Home page and motion design

The home page (`src/pages/home/`) is built with Framer Motion:

- **Hero:** word-by-word headline reveal, an SVG underline that draws itself, cursor-parallax background orbs,
  a fan of 4 mini theme previews that deal in and tilt with the mouse, magnetic CTA buttons, and a scroll-linked fade/scale.
- **Statement:** each word lights up as you scroll.
- **Live themes:** a sticky section that scrolls the 4 live theme demos **sideways** as you scroll down, with an animated counter and progress bar.
- **Categories bento:** staggered entrance, spring hover, cursor spotlight glow, and mini previews of each category's themes.
- **How it works:** a timeline whose line fills as you scroll.
- **Stats:** numbers count up when they come into view.
- **FAQ:** animated accordion.
- **CTA:** the logo mark rotates with scroll.

Across the site:

- Page transitions between routes (`AnimatePresence`).
- Navbar hides on scroll down and reappears on scroll up, with a sliding active-link pill.
- Animated mobile menu.
- Top scroll-progress bar.
- Gallery filters with a shared-layout pill, and cards that re-flow with layout animation.

Everything respects the OS **reduced-motion** setting (`MotionConfig reducedMotion="user"`).

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page: hero, categories, featured themes, how it works, CTA |
| `/themes?category=<id>` | Theme gallery with category filter (filter is in the URL, shareable) |
| `/themes/:themeId` | Full-screen **live demo**, with GLOARO bar: Back to gallery · Share · Create Your Website |
| `/enquire/:themeId` | Enquiry form with category, theme name and theme ID **pre-filled** |
| `/enquire` | General enquiry (choose a category and theme) |
| `POST /api/enquiry` | Validates, de-duplicates, appends to Sheets, sends email |

## Run locally

```bash
npm install
npm run dev          # frontend only at http://localhost:5173 (form submit needs the API)
# or, with the API:
npm i -g vercel
vercel dev           # frontend + /api at http://localhost:3000
```

Copy `.env.example` → `.env.local` and fill in the values to test Sheets/email locally with `vercel dev`.

> **Demo mode:** if the Google/SMTP environment variables are **not** set, the API still validates
> and returns a success with `mode: "demo"`, and the success screen states that nothing was stored or
> sent. That way the UI can be demoed before credentials exist, without claiming anything was delivered.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `vercel` from this folder).
2. In Vercel: **Add New → Project → Import** the repo. The framework preset is auto-detected as **Vite**
   (build `npm run build`, output `dist`).
3. Add the environment variables below under **Settings → Environment Variables**, then **Redeploy**.
4. Open `https://<your-project>.vercel.app`.

## Google Sheets setup

1. In Google Cloud Console, create a project and **enable the Google Sheets API**.
2. Create a **Service Account** → Keys → **Add key → JSON**. Keep this file private (it's git-ignored).
3. Create a spreadsheet named **"GLOARO Business Enquiries"** with a tab named **`Enquiries`** and this
   header row in row 1:

   `Enquiry ID | Submitted Date & Time | Customer Name | Business Name | Phone Number | Email Address | Business Category | Theme Name | Theme ID | Theme URL | Lead Source | Campaign / UTM Details | Lead Status | Additional Requirements`

4. **Share** the sheet with the service-account email as **Editor**. Do not make it public.
5. Set the env vars:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `client_email` from the JSON
   - `GOOGLE_PRIVATE_KEY` = `private_key` from the JSON (keep the `\n` sequences; paste as-is in Vercel)
   - `GOOGLE_SHEET_ID` = the ID in the sheet URL `…/spreadsheets/d/<ID>/edit`
   - `GOOGLE_SHEET_TAB` = `Enquiries`

Each accepted enquiry appends one row with a unique `GLR-YYYYMMDD-XXXXXX` ID, ISO timestamp and
Lead Status `New`. The team can later change the status to Contacted or Converted.

## Email setup (SMTP)

| Variable | Example |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` (SSL) or `587` (STARTTLS) |
| `SMTP_USER` | `leads@gloaro.com` |
| `SMTP_PASS` | Gmail **App Password** (not the account password) |
| `MAIL_FROM` | `GLOARO Leads <leads@gloaro.com>` |
| `NOTIFY_EMAIL` | the GLOARO business inbox |
| `SITE_URL` | `https://<your-project>.vercel.app` (used for the Theme URL column) |

The email contains customer details, category, theme name, ID and URL, lead source, UTM details and
requirements, and sets **Reply-To** to the customer. It is only reported as `accepted` when the SMTP
server accepts the recipient. Failures are logged (Vercel → Project → **Logs**) and the lead is
still kept, because the sheet row is written first.

## How the requirements are met

- **Pre-filled form:** "Create Your Website" goes to `/enquire/<themeId>`. Category, theme and theme ID are set from the URL.
- **Validation:** client-side (inline messages, focus on the first error) **and** server-side (`422` with per-field messages).
  Checks name, business, phone (7–15 digits, optional `+`), email format, and that the theme belongs to the category.
- **Duplicate protection:** the submit button locks while a request is in flight. The client sends a stable enquiry ID
  for the form session, and the server rejects (`409`) a repeated ID **or** the same email + theme within 10 minutes.
- **Sanitisation:** control characters stripped, lengths capped, values written with `valueInputOption=RAW`,
  formula-like text (`=`, `@`, …) prefixed to block CSV/Sheets formula injection, and HTML-escaped in emails. Includes a honeypot field against bots.
- **Source / campaign tracking:** `utm_*` parameters and external referrer are captured on landing (sessionStorage) and sent with the enquiry.
  If there is no UTM or referrer, the source is `Direct`.
- **Social sharing:** Copy link, WhatsApp, Facebook and LinkedIn. Shared links keep the theme URL and add
  `utm_source=<network>&utm_medium=social_share&utm_campaign=theme_showcase`.
- **Secrets:** only read in `api/enquiry.js` from server env vars. Nothing sensitive is bundled into the frontend.
- **Accessibility:** semantic landmarks, labelled inputs, `aria-invalid`/`role=alert` errors, visible focus rings,
  keyboard-operable controls, and `prefers-reduced-motion` support.

## Project structure

```
api/enquiry.js            serverless API (validation, Sheets, email)
public/                   GLOARO logo + icon mark
src/data/themes.js        categories + themes registry (shared by UI and API)
src/themes/*              4 independent theme demos (each with its own CSS)
src/pages/home/*          Home page sections (Hero, Sections, motion-kit, home.css)
src/pages/*               Home, Gallery, ThemeDemo, Enquire, NotFound
src/components/*          Navbar/Footer, ThemeCard (live iframe preview), ShareBar, Icon
src/lib/tracking.js       UTM capture, share URLs, enquiry IDs
```

## Adding a new theme

1. Add an entry to `THEMES` in `src/data/themes.js` (set `live: true` on its category).
2. Create `src/themes/MyTheme.jsx` + CSS and register it in `src/themes/index.js` under the same ID.

## Third-party libraries & services

React, React DOM, React Router, Framer Motion, Vite, @vitejs/plugin-react, google-auth-library, nodemailer,
Google Fonts (Cinzel, Plus Jakarta Sans, Playfair Display, Fraunces, Space Grotesk), Google Sheets API, SMTP provider, Vercel.

See `TEST_REPORT.md` for the test summary and known limitations.
