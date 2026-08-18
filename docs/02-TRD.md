# Choose Property — Technical Requirements Document (TRD)

| | |
|---|---|
| **Product** | Choose Property — Land & Plot Selling Website |
| **Doc version** | 1.0 |
| **Status** | Draft for review |
| **Applies to** | PRD v1.0 |

---

## 1. Overview

This document defines the technical architecture and requirements for implementing the Choose Property platform as specified in the PRD. It covers stack choice, architecture, data layer, key modules, security, performance, SEO, and testing.

---

## 2. Recommended Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend / Backend | **Next.js 14 (App Router)** + **TypeScript** | SSR/ISR for SEO, server actions for admin writes, one codebase |
| Styling | **Tailwind CSS** | Mobile-first utility styling, fast iteration |
| Database | **Supabase (PostgreSQL)** | Managed Postgres, RLS security, realtime option |
| Auth | **Supabase Auth** | Email/password admin auth, JWT sessions |
| Storage | **Supabase Storage** | Media + private documents, CDN-backed, resize on the fly |
| Maps | **Google Maps Platform** | Interactive map + "Get Directions" deep link (Embed API, no key required for basic embed) |
| Hosting | **Vercel** | Native Next.js hosting, preview deployments |
| Analytics | **Application-level events** (own `analytics_events` table) + optional privacy-conscious provider (e.g. Plausible) | Full control over funnel data; no cookie wall needed |
| Icons | **lucide-react** | Lightweight tree-shakeable icon set |
| Validation | **zod** | Shared validation between forms and server actions |
| Utilities | `clsx` + `tailwind-merge` | Class composition |

---

## 3. Architecture

### 3.1 Rendering model
- **Public pages**: Server Components rendered on demand (dynamic, `force-dynamic` for listings so new properties appear immediately) with ISR where acceptable.
- **Property detail**: dynamic `[slug]` route; server-side fetch via Supabase; generates full OG metadata.
- **Admin pages**: Server Components + Client Components for interactive forms; all mutations via **Server Actions**.
- **Client components** only where interactivity is needed (gallery, filter sheet, wizard, converter, enquiry form).

### 3.2 Data access
- **Public reads**: Supabase **anon key** with **RLS** — the database itself enforces "published only".
- **Admin reads/writes**: Server-side **service role key** (never exposed to the browser), or anon key + RLS when the session is an admin. Writes always go through server actions.
- **Auth**: `@supabase/ssr` cookie-based sessions; `middleware.ts` guards `/admin/*`.

### 3.3 Folder structure
```
src/
  app/                  # App Router routes (public + /admin)
  components/
    ui/                 # Button, Input, Select, Card, Badge, Modal, Sheet…
    layout/             # Header, Footer, MobileNav, AdminSidebar
    property/           # PropertyCard, PropertyGallery, PlotDiagram, WhatsAppButton…
    filter/             # FilterSheet (bottom sheet)
    converter/          # MeasurementConverter
    enquiry/            # EnquiryForm
  lib/
    supabase/           # client.ts, server.ts, admin.ts
    measurements/       # conversion engine + standards
    constants.ts        # enums/options
    ids.ts              # CP-BR-0001 / CP-LEAD-0045 generators
    analytics.ts        # track() helper
    validation.ts       # zod schemas
  types/                # database.ts (row types)
  middleware.ts         # admin auth guard
```

### 3.4 Server Actions (mutation surface)
| Action | Purpose |
|---|---|
| `createProperty` / `updateProperty` | Wizard save/publish, all child tables |
| `deleteProperty` / `setPropertyStatus` | Manage listing lifecycle |
| `submitEnquiry` | Public → creates lead + analytics event |
| `updateLeadStatus` / `addLeadActivity` | Lead pipeline |
| `createStandard` / `updateStandard` | Measurement standards (settings) |
| `trackEvent` (internal) | Analytics inserts |

---

## 4. Data Layer (Supabase)

### 4.1 Database
PostgreSQL with tables per the **Backend Schema document** (`docs/05-Backend-Schema.md`) and the migration `supabase/migrations/0001_init.sql`:
`admins`, `measurement_standards`, `properties`, `property_measurements`, `property_locations`, `nearby_places`, `property_utilities`, `property_classifications`, `property_media`, `property_documents`, `leads`, `lead_activities`, `buyers`, `analytics_events`.

### 4.2 Security model
- **RLS enabled on every table** (see Backend Schema for policies).
- Public can **only read** published properties + related rows; can **insert** leads and analytics events.
- Admin access gated by `is_admin()` (membership in `admins` joined to `auth.uid()`).
- Private documents and hidden coordinates are excluded from public policies entirely.

### 4.3 Storage buckets
| Bucket | Visibility | Contents |
|---|---|---|
| `property-media` | public (CDN) | Optimised photos, drone photos, videos, posters |
| `property-documents` | private | Khatiyan, Jamabandi, mutation, registry, etc. — never served publicly |
| `property-thumbs` | public (optional) | Resized thumbnails if not using transform API |

Media pipeline: client uploads → `media_transform` (Supabase Image Transformations / resizing) → WebP/AVIF → CDN.

### 4.4 ID generation
- Property ID: `CP-BR-0001` (sequence per state code, computed from count + 1 or a dedicated sequence table).
- Lead ID: `CP-LEAD-0045`.

---

## 5. Key Modules

### 5.1 Measurement engine (`lib/measurements`)
Pure TypeScript, unit-tested, shared by `/converter` and property pages.

```ts
interface MeasurementStandard {
  id: string; name: string; district?: string | null;
  kathaSqft: number; bighaKatha: number; decimalSqft: number;
}
// sqftToAll(1500, standard)
// → { sqft, sqm, decimal, dismil, katha, bigha, acre, hectare }
// convert(value, fromUnit, toUnit, standard)
```
Base unit = **square feet**. All units derive from it:
- 1 Acre = 43,560 sq.ft; 1 Hectare = 107,639 sq.ft; 1 sq.m = 10.7639 sq.ft
- 1 Decimal = `standard.decimalSqft` (default 435.6); 1 Dismil ≡ 1 Decimal
- 1 Katha = `standard.kathaSqft` (default 1,361); 1 Bigha = `katha × bighaKatha` (default 20)
- Standards are configurable per district; default = Bihar (Patna) standard.

### 5.2 Analytics
`analytics_events` table; `track()` server helper inserts rows. Client `<AnalyticsTracker/>` fires `page_view` on route change; property page fires `property_view`; buttons fire `whatsapp_click` / `call_click`; filter apply fires `filter_used`; search fires `search`; map fires `map_open` / `directions_click`; enquiry fires `enquiry_submit`; gallery fires `media_view`. UTM params captured from URL and persisted for the session (stored per event).

### 5.3 WhatsApp deep links
`lib/whatsapp.ts`:
```ts
waLink(number, message) → `https://wa.me/${number}?text=${encodeURIComponent(message)}`
```
Pre-filled messages per PRD 7.7; the "interested in CP-BR-0012" message is generated with the property ID.

### 5.4 Media optimisation
- Accept: images (jpg/png/webp/heic), videos (mp4/webm).
- On upload: generate poster for videos, request transformed sizes (`?width=…&format=webp`) via Supabase Image Transformations.
- Client: `<img loading="lazy">` / Next `Image` with priority on hero; video `preload="none"`, poster image, play on tap (no autoplay).

---

## 6. Security Requirements

| ID | Requirement |
|---|---|
| SEC-01 | All admin routes protected by middleware + server-side session check; redirect to `/admin/login`. |
| SEC-02 | Service role key used **server-only**; never imported into client bundles. |
| SEC-03 | RLS on every table; public policies strictly read-only except `leads`/`analytics_events` inserts. |
| SEC-04 | Zod validation on every server action input. |
| SEC-05 | Enquiry form honeypot field + per-IP rate limit (e.g. 5/day). |
| SEC-06 | No PII beyond enquiry fields; documents/coordinates private by default. |
| SEC-07 | CSRF-safe: server actions + SameSite cookies. |
| SEC-08 | Sanitise all user-provided text (plain-text rendering; no raw HTML from admin in public pages). |

---

## 7. Performance Budget (mobile 4G, mid-range Android)

| Metric | Budget |
|---|---|
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| TBT | ≤ 300 ms |
| Page weight (listings) | ≤ 500 KB initial, images lazy |
| Images | WebP/AVIF, responsive srcset, `loading="lazy"` |
| JS | Route-level code splitting; client components only where needed |

## 8. SEO Implementation

- Per-route `generateMetadata` with title, description, canonical, OG, Twitter.
- `sitemap.ts` (public routes + published properties), `robots.ts`.
- Property pages: `Product`/`RealEstateListing` JSON-LD structured data.
- Clean slugs, e.g. `/property/1500-sqft-residential-plot-bihta-patna`.
- OG image per property (drone/primary photo) for WhatsApp/social preview.

## 9. Third-Party Integrations

| Service | Use | Key |
|---|---|---|
| Supabase | DB, Auth, Storage | URL + anon key + service role (server only) |
| Google Maps | Map embed + directions | Optional `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| WhatsApp | wa.me links | Public number env var |
| Analytics (optional) | Plausible / privacy-friendly | Domain env var |

## 10. Environment Variables
See `.env.example`:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE_NUMBER`, `NEXT_PUBLIC_WHATSAPP_MESSAGE_PREFIX`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

## 11. Testing Strategy

| Level | Scope |
|---|---|
| Unit | Measurement engine (all units + custom standards), ID generation, WhatsApp link builder |
| Integration | Server actions (create property incl. child tables, lead pipeline), RLS behaviour |
| E2E (Playwright) | Browse → filter → detail → WhatsApp/enquiry; admin login → wizard → publish → appears publicly |
| Manual checklist | Mobile (Android/iPhone), slow 4G, WhatsApp share preview, admin on phone |

## 12. Deployment

- **Vercel**: preview per PR, production on `main`. Env vars per environment.
- **Supabase**: migrations via `supabase/migrations`; storage buckets + RLS applied.
- **Domain**: `chooseproperty.in`; DNS + Vercel; `www` → apex redirect.
- **CI**: `npm run lint`, `npm run typecheck`, `npm run build` on every PR.

## 13. Dependencies & Versions (baseline)

Next.js 14.2.x, React 18.3.x, TypeScript 5.6.x, Tailwind 3.4.x, @supabase/supabase-js 2.x, @supabase/ssr 0.5.x, zod 3.x, lucide-react.
