# UniHub — Development Status

_Last updated: 2026-11-16_

## Summary

| Phase | Status |
|---|---|
| 1. Architecture & docs | ✅ Done |
| 2. Foundation (API core, auth, RBAC, seed, web shell, design system, i18n) | ✅ Done and verified |
| 3. Public website | 🟡 Homepage, login and register done; about, contact, FAQ and pricing pending |
| 4. Marketplace | 🟡 Catalog, search, filters and service pages done; provider service CRUD and favorites pending |
| 5–12 | ⏳ Not started |

## Product decision: showcase site with WhatsApp contact (2026-11-16)

The owner decided the website is a **showcase only**: no online orders, payments or money transfer.
- Prices stay visible. Each service's package box has a **"Contact us on WhatsApp"** button that opens `wa.me/<number>` with a pre-filled message naming the service, package, price and link. A floating WhatsApp button appears on every public page.
- The number is stored in `SystemSetting` key `contact.whatsapp` (digits only, international format) and exposed by `GET /settings/public`. While it is empty, the box shows "number coming soon" and the floating button is hidden.
- All payment wording was replaced in templates, FAQs and the homepage. Phase 9 (payments) and the order/escrow flow from Phase 6 are **out of scope** unless the owner reverses this decision.
- Catalog edits made at the owner's request:
  - 12 services removed: programming Node.js, Testing, System Architecture, UML, API, Debugging, iOS; database PostgreSQL, SQL Server, MongoDB; graduation System Architecture, System Design.
  - Database systems limited to MySQL and Oracle.
  - The phrase "clean, commented source code" was removed.
  - The catalog now has **135 services**.
- The seed now **syncs** service text on every run and **retires** platform services removed from the data files. Prices are only set on creation.
- Web catalog fetches are no longer cached (`cache: 'no-store'`), so removals and edits show immediately.

## Blue palette, no login, closest-match search (2026-11-16, latest)

- **Accent is now blue** (light: blue-600, dark: blue-500 with blue-400 text), replacing gold. Only the CSS variables in `globals.css` plus a few illustration and glow colours changed.
- **Login removed from the header** (desktop and mobile). The site is a showcase, so visitors need no account. The `/login` and `/register` routes still exist but nothing links to them.
- **The search never shows "no results".** When nothing matches exactly, `GET /services` loosens the request step by step and returns `relaxed: true`. The steps are: individual words (with and without «ال»), then dropping price/time limits (sorted by the nearest price or delivery time), then the whole category, then the category without the text, then the whole catalog. The services page then shows a "closest services" notice.

## Redesign to owner's mockup + light/dark mode (2026-11-16)

- **Theme system:** every colour is a CSS variable (`globals.css`: `:root` = light, `[data-theme='dark']` = dark), mapped in `tailwind.config.ts` (`page`, `surface`, `surface-soft`, `surface-raised`, `ink`, `ink-muted`, `line`, `brand` gold + `brand-fg`/`brand-on`/`brand-light`).
  - The theme is stored in the `uh_theme` cookie and applied server-side on `<html data-theme>` (no flash). The default is **dark**.
  - Toggle: `components/layout/theme-toggle.tsx`. Category tones, badges and alerts have `dark:` variants.
- **Brand accent is now gold (#F5B82E)**, following the owner's mockup. Gold text on white uses `brand-fg` (#B45309) for contrast. The logo is a gold "U" square.
- **Header:** Services · How we work · FAQ · Contact us (anchor links on the homepage), theme + language toggles, Log in, "Start your request".
  - This replaces links to unbuilt pages (Projects, Library, About). The footer is simplified to match.
- **Homepage rebuilt** to the mockup:
  - Hero with a gold highlight, search, "most requested" chips, two CTAs, and an original desk illustration (`hero-illustration.tsx`) with floating mono chips and an animated "in progress" card.
  - A technologies strip, service-area cards for all 8 categories, a 3-step "How we work", FAQ (`#faq`), and a WhatsApp contact block (`#contact`).
  - Removed at the owner's request: featured services, open requests, research/graduation promos, featured providers, why-us and testimonials. The standing-character hero was replaced by this design.

## Visual refresh & catalog trim (2026-11-16, later)

- **Categories removed at owner's request:** Academic Tools and Networking & Cybersecurity (13 services). The `/academic-tools` nav/footer links, the homepage "Document Analysis Tools" box and the AI-checker FAQ were removed. The catalog is now **8 categories / 122 services**. The seed retires categories that are no longer in the data files.
- **Service logos:** each card and detail header shows the technology's logo (`public/logos`, 44 Devicon SVGs, MIT licence included), mapped per service in `src/lib/service-logos.ts`.
  - Excel, Power BI, Tableau and Cisco use an icon in the brand colour, because Devicon doesn't ship those logos.
  - Research, report and tutoring services use a matching Lucide icon.
- **Motion:** staggered card entrance (`animate-uh-rise`); hover lift with logo tilt, colour glow and a light sweep; a gently floating logo on the detail header. `prefers-reduced-motion` disables all of it.
- **New homepage hero** (`components/home/hero-section.tsx`):
  - Navy backdrop, cyan-to-blue organic shape and an original SVG student character (`hero-character.tsx`).
  - Floating technology chips, amber CTA, WhatsApp CTA when configured, and glass cards for Programming, Graduation Projects and Research with live service counts.
- **Reliability fix:** pages intermittently returned 500 because the API's per-IP rate limit (120/min) also applied to the Next.js server (one IP for all visitors).
  - The web server now sends `INTERNAL_API_KEY` (`x-internal-key` header), which `AppThrottlerGuard` exempts. Browser traffic is still limited.
  - Server-side GETs retry once on transient socket errors.
  - Verified with 200/200 page loads.

## Phase 4 progress (2026-11-16)

- **147 services** (every subcategory in the spec) published under the official **UniHub Academic Team** provider account (`academic-team@unihub.platform`, which cannot log in).
  - Bilingual content is built from per-category templates (`prisma/data/service-templates.ts`) plus per-service summaries and technologies (`prisma/data/service-details.ts`).
  - Each service has 3 packages with **suggested** JOD prices, an FAQ and an academic-integrity FAQ where relevant.
  - The catalog is created once and never overwritten, so admin edits survive re-seeding. It is real platform content and also runs in production; only demo accounts are dev-only.
- **API:**
  - `GET /services`: search (EN/AR plus Arabic transliterations like «بايثون»), category, subcategory, max price, max days, featured, 6 sort orders, pagination.
  - `GET /services/:slug` (detail + related), `GET /providers/featured`, `GET /providers/:slug`.
- **Web:**
  - `/services` and `/services/[category]` (with `?sub=` subcategory chips) use server-rendered GET-form filters, so they work without JavaScript and every result page has a shareable URL.
  - `/service/[slug]` has the full detail page, a sticky package selector (inline on mobile), and provider, portfolio, reviews and related sections.
- **Migration** `provider_arabic_fields`: `titleAr`, `bioAr`, `displayNameAr` on `ProviderProfile`.
- **Verified:** API filter/sort/search/404 checks, and Playwright screenshots (EN/AR desktop, AR mobile) with 0 console errors.
- **Pending:**
  - "Request this service" currently explains that ordering arrives in the next update; it is wired in Phase 6.
  - Favorites, the provider service editor, and the admin price editor.

## Verified in this phase

All of the following were run against the real local PostgreSQL. None of it is mocked.

- **Database:** the `init` migration applies cleanly. The seed loads 24 permissions, 7 roles, 4 academic levels, 15 Jordanian universities, 10 categories, 147 subcategories, 14 resource categories, 5 settings and 7 demo accounts. Arabic text is stored correctly in a UTF-8 cluster.
- **Auth API (curl):**
  - register and login work;
  - validation errors are structured (`VALIDATION_ERROR` with details);
  - duplicate email returns `EMAIL_TAKEN`, a wrong password returns `INVALID_CREDENTIALS`, and an anonymous `/auth/me` returns 401;
  - refresh rotation works, and reusing an old token returns `SESSION_REVOKED` and revokes the whole family;
  - a foreign Origin on cookie endpoints returns 403.
- **Unit tests:** shared state machine 7/7 passing; API `AccessGuard` 5/5 passing.
- **Web (Playwright, Chromium):**
  - The homepage renders in EN/LTR and AR/RTL on desktop, and in AR on a 390px mobile viewport, with zero console errors.
  - Category cards and counts come from the API.
  - UI registration with client-side validation creates an account and redirects to `/student/dashboard`.
- **Type checks:** `apps/api` and `apps/web` both pass `tsc --noEmit`.

## Known gaps / bugs

1. Header and footer links to `/services`, `/projects`, `/library`, `/academic-tools`, `/about`, `/pricing`, `/faq` and `/contact` currently return the styled 404. They are built in Phases 3–4.
2. The post-login destinations `/student/dashboard`, `/provider/dashboard` and `/admin/dashboard` don't exist yet (Phase 5/10). Login and registration succeed, but land on the 404.
3. The homepage calls `/services?featured`, `/requests/public`, `/providers/featured` and `/reviews/featured`. Those endpoints don't exist yet, so the sections show their empty states.
4. All category service counts are 0 because no services are seeded yet. Demo services are planned for Phase 4 and will be clearly marked as demo data.
5. The language switcher stores the choice in a cookie. It does not yet sync to `UserProfile.preferredLocale` for logged-in users; that needs a profile endpoint (Phase 5).
6. The dev database contains a few test accounts created during verification (`t1@example.com`, `pw…@example.com`).
7. Nothing is committed to git yet (the repository is initialised).

## Exact next steps

1. **Phase 3:**
   - `(public)/about`, `faq` (reuse `faq.*` messages), `pricing` (describe the commission model, read the rate from `GET /settings/public`) and `contact`.
   - The contact page persists to a new `ContactMessage` model or to `SupportTicket` with `userId` null. The latter needs a schema change: make `SupportTicket.userId` optional.
2. **Phase 4 API:**
   - A `services` module: `GET /services` with filters (`q`, `category`, `subcategory`, `minPrice`, `maxPrice`, `maxDays`, `sort`, `page`, `limit`, `featured`), `GET /services/:slug`, and provider CRUD under `/provider/services`.
   - Endpoints for `providers/:slug` and `providers/featured`.
   - Postgres full-text search: add a generated `tsvector` column through a SQL migration.
3. **Phase 4 web:** `/services`, `/services/[category]`, `/service/[slug]` (all 17 sections), and the provider profile.
4. **Seed:** add demo services (2 per category from the 2 demo providers, marked `[Demo]`) so the catalog can be exercised.
5. **Phase 5:** route groups `student/`, `provider/` and `admin/`, each with a role-guarded layout: a client guard plus server-side checks on every API call.

## How to resume

```bash
npm run db:start          # terminal 1
npm run dev:api           # terminal 2
npm run dev:web           # terminal 3
```
