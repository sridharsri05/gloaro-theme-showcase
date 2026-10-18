# Test Report — GLOARO Theme Showcase MVP

Tested in headless Chromium (animations rendered at their end states with a local Framer Motion stand-in, because the package registry was unavailable in the build sandbox) at 1366×860 (desktop) and 390×844 (mobile), and against the API handler directly.

| # | Check | Result |
|---|---|---|
| 1 | Landing page renders with GLOARO logo, hero, categories, featured themes, CTA | Pass |
| 2 | Category filter on `/themes` updates the list and URL (`?category=`) | Pass |
| 3 | All 4 demo URLs open the correct theme; "Back to gallery" returns to that category | Pass |
| 4 | Unknown theme URL shows a branded 404 with a link back to the gallery | Pass |
| 5 | "Create Your Website" opens `/enquire/<id>` with category, theme and theme ID pre-filled | Pass |
| 6 | Empty submit shows an inline error per required field and a summary alert | Pass |
| 7 | API rejects invalid name/phone/email and theme/category mismatch with `422` and field messages | Pass |
| 8 | API rejects non-POST with `405` | Pass |
| 9 | Valid submission (with Sheets mocked) appends **exactly one** row with all 14 columns, status `New` | Pass |
| 10 | Resubmitting the same enquiry ID, or the same email + theme within 10 min, returns `409` and adds no row | Pass |
| 11 | Formula-like input (`=cmd()`) is neutralised and phone numbers are left intact | Pass |
| 12 | UTM params on landing (`?utm_source=google&utm_medium=cpc`) carried through to the form and API payload | Pass |
| 13 | Email step (mocked SMTP) reported `accepted` only when recipient accepted | Pass |
| 14 | Demo mode (no credentials): success screen clearly says nothing was stored or sent | Pass |
| 15 | Mobile: no horizontal scroll (scrollWidth = 390), menu toggles, demo bar condenses | Pass |
| 16 | No runtime JS errors in console (only blocked font requests in the sandbox) | Pass |
| 17 | Home page: hero, statement, sideways theme scroller (01→04 counter and progress), bento, timeline, counters, FAQ and CTA all render | Pass |
| 18 | Navbar hides on scroll down; mobile menu opens and closes; demo pages hide the site navbar | Pass |
| 19 | Mobile home page has no horizontal overflow; the sideways scroller works with vertical touch scrolling | Pass |

## Still to verify after deployment (needs real credentials)

- A real row appears in the "GLOARO Business Enquiries" sheet.
- The notification email arrives in the configured inbox (check spam on first send).
- WhatsApp, Facebook and LinkedIn share dialogs open correctly with the deployed URL. Facebook and LinkedIn previews need a public URL.

## Known limitations

- Run `npm install && npm run build` once locally or on Vercel to confirm the real Framer Motion animations. The local test used a stand-in.
- The 10-minute duplicate check reads columns A:I of the sheet on each submit. That is fine for MVP volumes; at scale, use a datastore or index.
- Email has no automatic retry queue. Failures are logged in Vercel and the lead is still saved in the sheet.
- No rate limiting beyond the honeypot and duplicate check. Add Vercel WAF or Upstash rate-limit for production.
- Theme demos use illustrative CSS art and emoji instead of photography. Real client photos replace these during customisation.
- Gallery previews are live scaled iframes of each demo, so the first gallery load does a little more work than static screenshots would.
- Three categories (Real Estate, Retail & E-commerce, Education) are listed as "Coming soon", as the MVP scope allows.
