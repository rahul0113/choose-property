# Choose Property — Application Flow (AppFlow)

| | |
|---|---|
| **Product** | Choose Property |
| **Doc version** | 1.0 |
| **Status** | Draft for review |

This document describes every user journey through the product — visitors and admins — including entry points, decision points, and system actions. Flows reference PRD requirement IDs where relevant.

---

## 1. Flow Map (overview)

```
ENTRY POINTS
  Google search ──┐
  WhatsApp link ──┼──► PUBLIC WEBSITE ──► enquiries ──► ADMIN ──► leads/analytics
  Social media ───┘        │                    │
                           └── property pages    └── WhatsApp / call
```

---

## 2. Public Flows

### F1 — Discover & browse

```
START
  ▼
Home / Properties / Google result
  ▼
[Search box] ────────────────► runs `search` event → filtered listing
  ▼
[Filters] ───► bottom sheet (mobile) / panel (desktop)
     ├─ district / location / type / plot size / road width / facing
     ├─ availability / electricity / water / drainage / distance to main road
     ├─ land classification / documentation status
     └─ [Apply] ──► `filter_used` event → URL params → server-filtered list
  ▼
Property card
  ├─ [View Property] ──► F2
  └─ [WhatsApp] ────────► F5
```

- Listing pages: `/properties`, `/properties/residential`, `/properties/commercial`, `/properties/other`.
- Filters serialise into the URL (`?district=patna&type=residential&…`) so links are shareable and server-renderable.

### F2 — Property detail (the critical flow)

```
START: /property/[slug]
  ▼
Hero: primary drone/land image, title, Property ID (CP-BR-0012), location, area,
     "Contact for Price"            → fires `property_view` (once per visit)
  ▼
Sticky action bar (mobile): [WhatsApp] [Call Now]
  ▼
Gallery (swipeable, fullscreen, zoom, captions, categories)  → `media_view`
  ▼
Plot dimensions + informational diagram (disclaimer shown)
  ▼
Land area in sq.ft + local units (Decimal/Dismil/Katha/Bigha) + standard + notice
  ▼
Land classification + verification status + disclaimers
  ▼
Documentation checklist (private files never shown)
  ▼
Road & connectivity (width, frontage, main road, highway, distances)
  ▼
Utilities (structured statuses)
  ▼
Location + map + [Get Directions]  → `map_open` / `directions_click`
  ▼
[WhatsApp Us]  → F5      [Enquire]  → F4      [Call Now]  → `call_click`
  ▼
END
```

Rules:
- "Contact for Price" everywhere; selling price never public (FR-CARD-02).
- Every buyer question (PRD §5) visibly answered or marked unknown/pending.

### F3 — Land measurement converter

```
START: /converter
  ▼
Enter value + select input unit (Sq.ft/Sq.m/Decimal/Dismil/Katha/Bigha/Acre/Hectare)
  ▼
Select measurement standard (Bihar default / district standard)
  ▼
Output grid: all units ≈ values
  ▼
Informational notice (conversions vary by local convention / official records)
  ▼
END
```

### F4 — Enquiry form

```
START (from property page, contact page, or homepage)
  ▼
Structured form (FR-ENQ-01…05)
  ├─ Required: name, phone, interested property
  ├─ Optional: preferred contact method, WhatsApp, budget range, preferred
  │            location, plot size, purpose, road width, timeline, message
  └─ Honeypot field (hidden)
  ▼
Validate (client + server, zod)
  ├─ Fail ──► inline errors
  └─ Pass
      ▼
Server action: create lead (CP-LEAD-00XX) + fire `enquiry_submit`
  ▼
Success screen: "Thank you — the team will contact you."
  + [WhatsApp Us] shortcut (optional)
  ▼
END
```

- Lead source defaults to `property_page` when opened from a property, else `direct`; UTM params from URL are captured (FR-LEAD-05/06).

### F5 — WhatsApp conversion

```
START: [WhatsApp Us] (property, card, contact, success screen)
  ▼
Build message:
  Property: "Hello Choose Property, I am interested in Property CP-BR-0012.
             Please share more information about this property."
  Enquiry:  "…I am interested in CP-BR-0012. I would like to know the
             availability, documents, location and other details…"
  ▼
Fire `whatsapp_click` (with property code when relevant)
  ▼
Open https://wa.me/<number>?text=<encoded>  (native app / web)
  ▼
END
```

### F6 — Contact & about
`/contact` → form (same as F4) or WhatsApp/Call. `/about`, `/faq`, `/privacy`, `/terms` → static content; privacy/terms linked in footer.

---

## 3. Admin Flows

### A1 — Login & session

```
START: /admin/login
  ▼
Email + password  ──► Supabase Auth signIn
  ├─ Fail ──► error message
  └─ Success
      ▼
Cookie session set; middleware allows /admin/*
  ▼
Redirect → /admin (dashboard)
  ▼
Session expiry / logout → back to /admin/login
```

Guard: `middleware.ts` + server-side session check on every admin page (SEC-01).

### A2 — Add property wizard (11 steps)

```
START: /admin/properties/new  ([+ Add Property])
  ▼
Step 1  Basic Information  (auto Property ID, title, type, description, status)
Step 2  Land Area          (base sq.ft + measurement standard)      [FR-MEAS-06]
Step 3  Dimensions         (N/S/E/W, road frontage, road width)
Step 4  Road & Connectivity(main road, highway, market, school, hospital, railway, airport, custom)
Step 5  Utilities          (electricity, water, drainage, internet, street lighting)
Step 6  Location           (lat/long, address, village, panchayat, block, district, PIN, precision)
Step 7  Land Classification(classification, verification status/source/date, notes)
Step 8  Documents          (private upload, types, optional public flag)
Step 9  Photos & Drone Media(upload, categorise, primary photo, reorder, video posters)
Step 10 Preview            (exact buyer view incl. disclaimers)
Step 11 Publish            [Save Draft] [Preview] [Publish]
  ▼
Server action creates/updates property + all child rows (single transaction)
  ▼
Publish ──► status=published, published_at=now → visible publicly
  ▼
END → redirect to /admin/properties or property page
```

- Validation per step; required: title, type, base area, district.
- Drafts can be saved at any step; publish requires completed core fields.

### A3 — Edit / manage properties

```
/admin/properties
  ├─ table: ID, title, type, status (Draft/Published/Sold), availability, views, enquiries
  ├─ [Edit] ──► wizard prefilled (A2)
  ├─ [Publish/Unpublish] toggle
  ├─ [Mark Sold] ──► availability + status update
  └─ [Delete] (confirm; cascade deletes children)
```

### A4 — Media & documents

```
/admin/media
  ├─ grid of all media; filter by property/category/type
  ├─ upload (gallery/camera/multiple/progress/retry)
  ├─ set primary, caption, categorise, reorder, delete
  └─ optimisation handled on upload (posters, WebP/AVIF, responsive)

/admin/documents
  ├─ private list per property (khatiyan, jamabandi, mutation, registry…)
  ├─ upload to private bucket; `is_public` flag for checklist display
  └─ share privately (copy link with expiry — admin-only signed URL)
```

### A5 — Lead pipeline

```
START: /admin/leads
  ▼
List: ID, name, phone, property, source, budget, purpose, status, date
  ├─ filter by status/source/property; search
  ▼
/leads/[id]
  ├─ Details: enquiry fields + property + source/UTM
  ├─ Status workflow:
  │   New → Contacted → Interested → Follow-up → Site Visit → Negotiation
  │   → Converted | Lost        (each change logged to timeline)
  ├─ Timeline: enquiry_received, whatsapp, called, site_visit_scheduled,
  │            site_visit_completed, follow_up, note
  ├─ [Add note] / [Log activity]
  └─ [Convert to buyer] ──► creates buyer record
```

### A6 — Analytics & BI

```
/admin/analytics
  ├─ Website: visitors, unique visitors, property views, most-viewed,
  │           search activity, filter usage, device split, traffic sources,
  │           WhatsApp clicks, phone clicks, enquiries
  ├─ Leads: funnel counts + conversion rate by status
  ├─ Properties: per-property views/WhatsApp/calls/enquiries/site visits/negotiations
  └─ BI reports: location interest, plot-size demand, road-width demand,
                 high-views-low-enquiries, best sources, site-visit conversion
```

### A7 — Settings

```
/admin/settings
  ├─ Measurement standards: list / add / edit / set default (FR-MEAS-02/05)
  ├─ Site contact: WhatsApp number, phone, message prefix
  └─ Admin users & roles (owner/admin/editor) — owner only
```

---

## 4. Key Decision Points Summary

| Point | Branch | System action |
|---|---|---|
| Public visit | Bot vs human (analytics) | events logged |
| Filter apply | Any filters? | URL params + server query |
| Enquiry submit | Valid? | zod → lead insert + event |
| Admin login | Valid session? | middleware allow/redirect |
| Wizard publish | Core fields complete? | transaction insert + publish |
| Lead status change | Which status? | timeline entry + counter update |

---

## 5. Edge Cases

| Case | Behaviour |
|---|---|
| Property unpublished/draft | 404 for public; visible in admin |
| Sold property | Still visible with "Sold" badge; enquiry allowed ("Notify me if similar") |
| No district standard found | Fall back to default Bihar standard with notice |
| Slow 4G image load | Lazy loading + low-res placeholders; hero gets priority |
| Enquiry spam | Honeypot + rate limit; flagged in lead list |
| Direct visit to /property/xyz (bad slug) | 404 page with search + popular properties |
| WhatsApp number unset in env | Button hidden / falls back to enquiry form |
