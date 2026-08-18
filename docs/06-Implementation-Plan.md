# Choose Property — Implementation Plan

| | |
|---|---|
| **Product** | Choose Property |
| **Doc version** | 1.0 |
| **Status** | Draft for review |
| **Depends on** | PRD v1.0, TRD v1.0, AppFlow, UI/UX Brief, Backend Schema |

---

## 1. Overview

Delivery is organised into **7 phases**, each with a shippable outcome. The order prioritises: (0) foundation, (1) data + measurement engine (the differentiator), (2) a public read-only site that looks complete, (3) enquiry capture, (4) the admin property wizard, (5) lead management + analytics, (6) SEO + launch hardening.

Rough total: **6–8 weeks** for one developer (part-time client input on content/media).

---

## 2. Phases & Tasks

### Phase 0 — Foundation (Days 1–3)
| # | Task | Est. | Done when |
|---|---|---|---|
| 0.1 | Init repo (`choose-property`), git, branch `main` + PR workflow | 0.5 d | CI green on first PR |
| 0.2 | Scaffold Next.js 14 + TS + Tailwind; design tokens per UI brief | 1 d | `npm run dev` renders styled starter |
| 0.3 | Env setup: Vercel project + Supabase project, buckets, `.env.example` | 0.5 d | local build runs with env |
| 0.4 | Apply DB migration (`supabase/migrations/0001_init.sql`) | 0.5 d | tables + RLS live |
| 0.5 | CI: lint, typecheck, build on PR (Vercel preview) | 0.5 d | pipeline green |

### Phase 1 — Data layer & measurement engine (Days 4–8)
| # | Task | Est. | Done when |
|---|---|---|---|
| 1.1 | Supabase clients (`client`, `server`, `admin`) + row types | 1 d | typed fetches compile |
| 1.2 | Measurement engine (`lib/measurements`): all units, custom standards | 1.5 d | unit tests pass (incl. 1361 default) |
| 1.3 | Converter page UI wired to engine | 1 d | `/converter` converts correctly |
| 1.4 | ID generators (`CP-BR-0001`, `CP-LEAD-0045`) | 0.5 d | no collisions under load |
| 1.5 | Query helpers: published listing filters + detail bundle | 1 d | RLS-safe queries used everywhere |
| 1.6 | Analytics `track()` + event helpers | 0.5 d | events insert; no client key leaks |

### Phase 2 — Public site (read-only) (Days 9–17)
| # | Task | Est. | Done when |
|---|---|---|---|
| 2.1 | Header/Footer/MobileNav + layout shell | 1 d | sticky nav + slide-over menu |
| 2.2 | Homepage (hero, search, featured, why-us, tools, contact CTA) | 2 d | matches UI brief §5.3 |
| 2.3 | Property card + listing pages with URL-serialised filters | 2.5 d | filters work; cards lazy-load |
| 2.4 | Filter bottom sheet (mobile) + desktop panel | 1.5 d | FR-LIST-02/03 |
| 2.5 | Property detail page — all 10 sections incl. disclaimers | 4 d | every buyer question answered (PRD §5) |
| 2.6 | Gallery (swipe, fullscreen, zoom, captions) + video posters | 2 d | FR-DET-12, FR-MED-03 |
| 2.7 | Plot diagram component + disclaimer | 1 d | FR-DET-21/22 |
| 2.8 | Local units display on property page | 0.5 d | FR-DET-30/31 |
| 2.9 | Static pages: About, Contact, FAQ, Privacy, Terms | 1.5 d | content live |

### Phase 3 — Enquiry & WhatsApp (Days 18–21)
| # | Task | Est. | Done when |
|---|---|---|---|
| 3.1 | WhatsApp link builder + buttons (property, card, contact) | 0.5 d | pre-filled messages per PRD 7.7 |
| 3.2 | Enquiry form (modal + page) with zod validation, honeypot, rate limit | 2 d | leads created; FR-ENQ-01…06 |
| 3.3 | UTM + source capture on leads | 0.5 d | FR-LEAD-05/06 |
| 3.4 | Call clicks + analytics wiring on public CTAs | 0.5 d | events fire |

### Phase 4 — Admin: auth, wizard, media (Days 22–31)
| # | Task | Est. | Done when |
|---|---|---|---|
| 4.1 | Admin auth (Supabase Auth + middleware guard + login page) | 1.5 d | /admin protected (SEC-01) |
| 4.2 | Admin layout + sidebar + dashboard stats | 1.5 d | FR-ADM-01/02 |
| 4.3 | Properties list (statuses, search, actions) | 1 d | manage listings |
| 4.4 | **Add/Edit property wizard (11 steps)** — the biggest task | 5 d | FR-WIZ-01a…k, transactional save |
| 4.5 | Preview step (renders real public view) | 1 d | WYSIWYG publish |
| 4.6 | Media upload (gallery/camera/multiple/progress/retry, categories, primary, reorder) | 2.5 d | FR-MED-01/02 |
| 4.7 | Media optimisation pipeline (posters, WebP/AVIF, responsive) | 1.5 d | FR-MED-03 |
| 4.8 | Documents module (private bucket, checklist flags, admin share links) | 1.5 d | FR-DET-50/51 |
| 4.9 | Settings: measurement standards CRUD + contact info | 1 d | FR-MEAS-02/05 |

### Phase 5 — Leads, analytics, BI (Days 32–38)
| # | Task | Est. | Done when |
|---|---|---|---|
| 5.1 | Leads list + filters + lead detail + status workflow | 2 d | FR-LEAD-01…04 |
| 5.2 | Lead activity timeline + notes | 1.5 d | FR-LEAD-04 |
| 5.3 | Buyers module (convert lead) | 0.5 d | |
| 5.4 | Analytics dashboard (website + lead + property) | 2.5 d | FR-ANA-01…03 |
| 5.5 | BI reports (location/plot-size/road-width demand, funnel, sources) | 2 d | FR-ANA-04 |

### Phase 6 — SEO, quality, launch (Days 39–45)
| # | Task | Est. | Done when |
|---|---|---|---|
| 6.1 | Metadata/OG/Twitter, JSON-LD, sitemap, robots, canonical | 1.5 d | FR-SEO-01…05 |
| 6.2 | OG image generation per property | 1 d | WhatsApp preview correct |
| 6.3 | Performance pass (LCP/CLS budgets, image audit) | 1.5 d | NFR-PERF-02 met |
| 6.4 | Accessibility audit + fixes | 1 d | AA passes |
| 6.5 | E2E tests (Playwright): browse→enquiry; admin login→wizard→publish | 2 d | critical paths green |
| 6.6 | Content load: real properties, photos, drone media, documents | 2 d | client supplies |
| 6.7 | Launch: domain, DNS, analytics check, monitoring | 1 d | production live |

---

## 3. Dependencies

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3
                              └─────► Phase 4 ──► Phase 5
Phase 4 (wizard) and Phase 5 (leads) need Phase 3 enquiry capture.
Phase 6 needs Phases 2–5 complete.
```
- **Client input needed** (can run in parallel): property photos/drone media, document scans, WhatsApp/phone number, real property data, final copy + FAQ answers.

---

## 4. Testing Plan

| Level | What | Tool |
|---|---|---|
| Unit | measurement engine, IDs, WhatsApp builder | Vitest/Jest |
| Integration | server actions (create property tx, lead pipeline), RLS policies | Vitest + Supabase local |
| E2E | browse→filter→detail→enquiry; admin login→wizard→publish→public visible; lead workflow | Playwright |
| Manual | Android/iPhone, slow-4G throttle, WhatsApp share preview, admin on phone | checklist |
| Security | RLS policy review, private bucket check, service-role key absence in bundle | review + `next build` audit |

**Acceptance gate per phase**: typecheck + lint + relevant tests green; key flows verified manually on mobile.

---

## 5. Deployment & Operations

- **Vercel**: automatic previews per PR; production on `main`; env vars per environment.
- **Supabase**: migrations applied in order; storage buckets; RLS verified after each migration.
- **Domain**: `chooseproperty.in` → Vercel; `www` redirect; TLS.
- **Monitoring**: Vercel analytics/status, error tracking (e.g. Sentry — optional), periodic RLS audit.
- **Backups**: Supabase daily backups enabled.

---

## 6. Milestones & Acceptance Criteria

| Milestone | Target | Acceptance |
|---|---|---|
| M1 — Foundation | Day 3 | CI green; DB migrated; design tokens in place |
| M2 — Measurement engine | Day 8 | Converter accurate; unit tests pass |
| M3 — Public site | Day 17 | All public pages live; mobile-first; disclaimers present |
| M4 — Enquiries live | Day 21 | Leads created from WhatsApp + form; sources tracked |
| M5 — Admin complete | Day 31 | Wizard publishes a property end-to-end; media upload works from phone |
| M6 — Leads & analytics | Day 38 | Lead pipeline + dashboards answer BI questions |
| M7 — Launch | Day 45 | SEO + performance + E2E green; production live |

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Wizard scope creep | 11 steps fixed at Phase 4; per-step validation; core fields only for publish |
| Media upload complexity on phones | Simpler: native file input (multiple), progress per file, retry, reorder optional |
| Katha/Bigha standard disputes | Standards configurable; defaults documented; disclaimers everywhere |
| Slow Supabase queries on listings | Indexes on status/type/slug; pagination; materialised counts for dashboard |
| Client content delays | Placeholder demo data; site shippable without real media |
| Service-role key exposure | Server-only import; eslint rule; bundle audit in CI |

---

## 8. Team & Roles

- **Developer** — full-stack implementation (this plan).
- **Client (admin)** — supplies content, media, documents, approves copy; provides WhatsApp/phone numbers and domain access.
- **Reviewer** — UAT on phone: browse, enquiry, admin publish, lead follow-up.
