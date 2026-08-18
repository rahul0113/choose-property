# Choose Property — Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | Choose Property — Land & Plot Selling Website |
| **Market** | Bihar, India |
| **Doc version** | 1.0 |
| **Status** | Draft for review |
| **Owner** | Product / Client |

---

## 1. Executive Summary

Choose Property is a **premium, mobile-first land and plot selling website** for a real-estate client operating primarily in Bihar, India. It functions as a **managed property catalogue** — not an open marketplace. The client (admin) controls all listing content; visitors browse properties and contact the client.

The product's core promise: **"Find the right land. Understand every detail before you visit."** Every property page must answer the buyer's important questions (location, exact size, dimensions, road width, frontage, utilities, nearby places, what it looks like from the ground and from above, land classification, documents) so the buyer has confidence **before** making a phone call or site visit.

The site is designed **mobile-first** because the majority of visitors arrive via Android/iPhone browsers, WhatsApp links, social media, and Google search.

---

## 2. Problem Statement

Land buyers in Bihar face a fragmented, opaque market:

- Listings are shared via WhatsApp images and word-of-mouth with **no standardised information**.
- Buyers cannot compare plots (size, road access, utilities) without calling.
- Critical questions (exact dimensions, road frontage, land classification, documents) are answered only after multiple calls/visits.
- Measurement confusion: buyers think in **Katha, Dismil, Decimal, Bigha** while listings often show only square feet — and conversion standards vary by district.
- There is no way for the seller to track who enquired, from which source, and what happened to each lead.

**Choose Property solves this** by making every listing data-rich, standardised, and verifiable, and by turning enquiries into a trackable lead pipeline.

---

## 3. Goals & Non-Goals

### 3.1 Goals
1. Present every property with complete, structured information (measurements, dimensions, road, utilities, classification, documents, media).
2. Provide a **Bihar-aware land measurement system** (Katha/Dismil/Decimal/Bigha) with configurable district standards.
3. Generate qualified leads via **WhatsApp + structured enquiry form**, with full lead lifecycle tracking.
4. Provide the client a **business intelligence dashboard** (which properties/locations/sources generate demand).
5. Be **fast, mobile-first, and SEO-visible** so organic + WhatsApp + social traffic converts.

### 3.2 Non-Goals (v1)
- No open marketplace / no third-party sellers.
- No online payment or booking.
- No automatic property valuation.
- No user accounts for buyers (enquiries are anonymous).
- No public exposure of original legal documents or exact coordinates (when sensitive).

---

## 4. Target Users

### 4.1 Visitor segments
- Land buyers (residential plots, commercial plots)
- Investors
- Local Bihar buyers
- NRIs / investors researching Bihar from abroad
- People arriving from WhatsApp, Google search, social media

### 4.2 Primary device
1. Android phone (primary)
2. iPhone
3. Tablet
4. Laptop / Desktop

### 4.3 Personas

**Persona A — Local Buyer (Ravi, 34, Patna)**
Buys his first residential plot. Uses a mid-range Android phone on 4G. Wants to shortlist 3–4 plots before calling. Trusts listings that show dimensions, road width, and photographs.

**Persona B — NRI Investor (Sunita, 41, Dubai)**
Researches plots in her home district via WhatsApp links shared by family. Needs complete information before flying in. Relies on drone photos, land classification, and document status.

**Persona C — Client/Admin (the business owner)**
Adds properties from their phone. Wants enquiries organised, lead statuses tracked, and insight into which listings generate interest.

---

## 5. Product Philosophy

The website must not simply say *"Beautiful plot available."* It must answer the buyer's important questions:

1. Where exactly is the land?
2. How large is it?
3. What are its exact dimensions?
4. How wide is the road?
5. How much road frontage does it have?
6. How far is it from the main road / highway?
7. Is electricity available?
8. Is water available?
9. Is drainage / sewerage available?
10. What is nearby?
11. What does the land actually look like?
12. What does it look like from above (drone)?
13. What is its land classification?
14. What documents are available?
15. How is the land measured in local Bihar terms (Katha/Dismil/Bigha)?
16. How can the buyer contact the client?

**Design rule:** every question above must be visibly answered on the property detail page, or explicitly marked unknown/pending.

---

## 6. Scope

### 6.1 Public website
| Page | Route |
|---|---|
| Home | `/` |
| All Properties | `/properties` |
| Residential Plots | `/properties/residential` |
| Commercial Plots | `/properties/commercial` |
| Other Land | `/properties/other` |
| Property Details | `/property/[slug]` |
| Land Measurement Converter | `/converter` |
| About | `/about` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Privacy Policy | `/privacy` |
| Terms | `/terms` |

### 6.2 Admin area
| Page | Route |
|---|---|
| Login | `/admin/login` |
| Dashboard | `/admin` |
| Properties list | `/admin/properties` |
| Add Property (wizard) | `/admin/properties/new` |
| Edit Property | `/admin/properties/[id]/edit` |
| Media Library | `/admin/media` |
| Documents | `/admin/documents` |
| Leads | `/admin/leads` |
| Lead detail + timeline | `/admin/leads/[id]` |
| Buyers | `/admin/buyers` |
| Analytics | `/admin/analytics` |
| Settings (incl. measurement standards) | `/admin/settings` |

---

## 7. Functional Requirements

> Requirements are numbered `FR-<area>-<n>` for traceability into TRD and Implementation Plan.

### 7.1 Homepage (`/`)

| ID | Requirement |
|---|---|
| FR-HOME-01 | Hero communicates: *"Find the right land. Understand every detail before you visit."* with CTAs **[Explore Properties]** and **[Contact Us]**. |
| FR-HOME-02 | Hero includes a **visual property search** (keyword + type + district). |
| FR-HOME-03 | **Featured Properties** grid. Each card shows: cover/drone image, Property ID, location, plot size, road width, facing, property type, availability, "Contact for Price". |
| FR-HOME-04 | **"Why Choose Property?"** section: detailed land info, exact dimensions, road/connectivity, ground photos, drone views, measurement support, documentation, direct client communication. |
| FR-HOME-05 | **Land Measurement Tools** promo (Katha, Dismil/Decimal, Bigha, Sq.ft, Sq.m, Acre, Hectare) linking to `/converter`. |
| FR-HOME-06 | **Contact section**: "Looking for a specific plot?" with **[WhatsApp Us] [Call Us] [Enquire Now]**. |

### 7.2 Property listing (`/properties` + type sub-pages)

| ID | Requirement |
|---|---|
| FR-LIST-01 | Searchable catalogue with a **search box** and a **Filters** button opening a **mobile bottom sheet**. |
| FR-LIST-02 | Filters: district, location, property type, plot size range, road width, facing, availability, electricity, water, drainage, distance from main road, land classification, documentation status. |
| FR-LIST-03 | Filters are mobile-first (bottom sheet, large touch targets, apply/reset). |
| FR-LIST-04 | Listing uses lazy-loaded property cards; pagination or "load more". |
| FR-LIST-05 | Each card shows: image, Property ID, title/type, area, location, road width, facing, availability, "Contact for Price", **[View Property]**. |

### 7.3 Property card

| ID | Requirement |
|---|---|
| FR-CARD-01 | Must communicate at a glance: cover image, `CP-BR-0012`, `1,500 sq.ft Residential Plot`, location, road width, facing, utility highlights, "Contact for Price". |
| FR-CARD-02 | **Never expose the actual selling price publicly.** Always "Contact for Price" (price may be stored privately for the admin). |

### 7.4 Property detail page (`/property/[slug]`)

**Section 1 — Hero**
| ID | Requirement |
|---|---|
| FR-DET-01 | Primary drone/land image, title, Property ID, location, area. "Contact for Price". |
| FR-DET-02 | Sticky action bar: **[WhatsApp] [Call Now]** always reachable (mobile). |

**Section 2 — Photography**
| ID | Requirement |
|---|---|
| FR-DET-10 | Gallery with categories: Ground (Front, Rear, Left, Right, Road, Entrance, Boundary, Surroundings, Nearby road, Nearby development) and Drone (top-down, wide aerial, boundary view, road connection, surrounding area, neighbourhood). |
| FR-DET-11 | Video support: drone video, ground walkthrough, road-access video. Poster images; no autoplay. |
| FR-DET-12 | Swipe, full-screen view, zoom, lazy loading, captions, image categories. |

**Section 3 — Plot dimensions**
| ID | Requirement |
|---|---|
| FR-DET-20 | Store & show North/South/East/West dimensions, Road Frontage, Road Width. |
| FR-DET-21 | Generate an **informational plot diagram** (e.g. 50 ft × 30 ft with road at bottom) when data supports it. |
| FR-DET-22 | Diagram carries disclaimer: **"Informational — not a legal survey unless based on verified survey data."** |

**Section 4 — Land measurement (Bihar)**
| ID | Requirement |
|---|---|
| FR-DET-30 | Show area in sq.ft **plus** local units (Decimal, Dismil, Katha, Bigha) using the property's configured measurement standard. |
| FR-DET-31 | Show the **measurement standard used** and an informational notice that conversions vary by local convention and official records. |

**Section 5 — Land classification (Gair Majarua)**
| ID | Requirement |
|---|---|
| FR-DET-40 | Display classification from configurable set: Private/Raiyati, Gair Majarua, Gair Majarua Aam, Gair Majarua Malik, Other, Unknown/Needs Verification. |
| FR-DET-41 | Display **verification status**: Pending / Client-provided / Document-backed / Admin-verified / Officially verified, with source and date. |
| FR-DET-42 | The site must **not** assert legal transferability based on a selected category. |
| FR-DET-43 | Include disclaimer: buyers must independently verify title, classification, ownership, encumbrances, and legal status. |

**Section 6 — Documents**
| ID | Requirement |
|---|---|
| FR-DET-50 | Public page shows a **document checklist** (Land records ✓, Ownership documents ✓, Mutation information ✓) with Verification: Verified / Pending / Not Verified. |
| FR-DET-51 | **Original files stay private** (Supabase Storage, non-public). Admin may share a document privately with an interested buyer. |

**Section 7 — Road & connectivity**
| ID | Requirement |
|---|---|
| FR-DET-60 | Show Road Width, Road Frontage, Road Type, Main Road distance, Highway distance, Access Road Condition, Corner Plot, Number of Road Sides. |
| FR-DET-61 | Connectivity distances to: main road, highway, market, railway station, airport, school, college, hospital, bank, petrol pump, bus stand, major landmark + custom places. |

**Section 8 — Utilities**
| ID | Requirement |
|---|---|
| FR-DET-70 | Structured statuses (Available / Nearby / Not Available / Unknown) for: Electricity, Water, Drainage/Sewerage, Internet, Street Lighting. |

**Section 9 — Location & map**
| ID | Requirement |
|---|---|
| FR-DET-80 | Latitude/longitude, village, panchayat, block, district, state, PIN, full address, nearby landmark, Google Maps URL. |
| FR-DET-81 | Interactive map with **[Get Directions]** (opens Google Maps app). |
| FR-DET-82 | Admin controls **location precision**: exact / approximate / hidden. |

**Section 10 — Contact & enquiry**
| ID | Requirement |
|---|---|
| FR-DET-90 | **[WhatsApp Us]** with pre-filled message containing Property ID (see 7.8). |
| FR-DET-91 | **[Enquire]** opens the structured enquiry form (see 7.9). |

### 7.5 Land measurement system — Bihar (critical)

| ID | Requirement |
|---|---|
| FR-MEAS-01 | Support units: Sq.ft, Sq.m, Decimal, Dismil, Katha, Bigha, Acre, Hectare. |
| FR-MEAS-02 | **No universal Katha/Bigha conversion assumption.** Standards are configurable per state/district/local standard: `1 Katha = __ sq.ft`, `1 Bigha = __ Katha`, `1 Decimal = __ sq.ft`. |
| FR-MEAS-03 | Each property references the standard used; the standard is identifiable on the property page. |
| FR-MEAS-04 | Informational notice: *"Land measurement conversions are informational and may vary by local convention, district, historical usage, or official records. Buyers should verify measurements against applicable official land records/survey documentation."* |
| FR-MEAS-05 | Default Bihar standard: 1 Katha = 1,361 sq.ft; 1 Bigha = 20 Katha; 1 Decimal = 435.6 sq.ft. Admin can add/edit district standards. |
| FR-MEAS-06 | Store **one authoritative base measurement** (area in sq.ft) + the standard used — never store contradictory manually-entered unit values. |

### 7.6 Converter tool (`/converter`)

| ID | Requirement |
|---|---|
| FR-CONV-01 | Input: value, input unit, measurement standard (Bihar / selected district standard). |
| FR-CONV-02 | Output grid: e.g. 1,500 sq.ft ≈ XX Decimal ≈ XX Dismil ≈ XX Katha ≈ XX Bigha ≈ XX Acre ≈ XX sq.m. |
| FR-CONV-03 | Same conversion engine reused by property pages. |

### 7.7 WhatsApp integration

| ID | Requirement |
|---|---|
| FR-WA-01 | Every property has **[WhatsApp Us]** → `https://wa.me/<number>?text=<prefilled>`. |
| FR-WA-02 | Property message: *"Hello Choose Property, I am interested in Property CP-BR-0012. Please share more information about this property."* |
| FR-WA-03 | Enquiry message: *"Hello Choose Property, I am interested in CP-BR-0012. I would like to know the availability, documents, location and other details of this property. Thank you."* |

### 7.8 Buyer enquiry form

| ID | Requirement |
|---|---|
| FR-ENQ-01 | Required: Name, Phone number, Interested property. |
| FR-ENQ-02 | Optional: preferred contact method, WhatsApp number, budget range, preferred location, required plot size, property type, purpose, preferred road width, purchase timeline, message. |
| FR-ENQ-03 | Purpose options: Residential / Commercial / Investment / Agriculture / Other. |
| FR-ENQ-04 | Timeline options: Immediately / Within 1 month / 1–3 months / 3–6 months / 6+ months / Just researching. |
| FR-ENQ-05 | Do **not** collect unnecessary sensitive data. |
| FR-ENQ-06 | Submission becomes a lead (see 7.10) and fires `enquiry_submit` analytics event. |

### 7.9 Lead management

| ID | Requirement |
|---|---|
| FR-LEAD-01 | Every enquiry becomes a lead with ID `CP-LEAD-0045`. |
| FR-LEAD-02 | Lead fields: name, phone, property, source, budget, purpose, purchase timeline, status. |
| FR-LEAD-03 | Status workflow: New → Contacted → Interested → Follow-up → Site Visit → Negotiation → Converted (or → Lost). |
| FR-LEAD-04 | **Lead activity timeline**: e.g. 18 Aug — Enquiry received; 18 Aug — WhatsApp conversation; 19 Aug — Called buyer; 20 Aug — Site visit scheduled; 22 Aug — Site visit completed; 24 Aug — Follow-up. Admin adds notes. |
| FR-LEAD-05 | **Lead source tracking**: Google, Organic search, WhatsApp, Instagram, Facebook, Direct, Referral, Advertisement, Property Page, QR Code. |
| FR-LEAD-06 | UTM parameter capture: `utm_source`, `utm_medium`, `utm_campaign` (e.g. `utm_source=instagram&utm_medium=social&utm_campaign=patna_plots`). |

### 7.10 Analytics & BI

| ID | Requirement |
|---|---|
| FR-ANA-01 | Website analytics: visitors, unique visitors, property views, most-viewed properties, search activity, filter usage, mobile/desktop traffic, traffic sources, WhatsApp clicks, phone clicks, enquiries. |
| FR-ANA-02 | Lead analytics: new, contacted, follow-ups, site visits, negotiations, converted, lost, conversion rate. |
| FR-ANA-03 | Property analytics (per property): views, WhatsApp clicks, call clicks, enquiries, site visits, negotiations. |
| FR-ANA-04 | BI questions: which location gets most interest? which plot size? which road width? which properties get high views but few enquiries? which source generates best buyers? funnel: leads → site visits → negotiations → sales. |
| FR-ANA-05 | Application-level event tracking: `property_view`, `whatsapp_click`, `call_click`, `enquiry_submit`, `filter_used`, `search`, `map_open`, `directions_click`, `media_view`, `page_view`. Privacy-conscious (no cookie wall; minimal data). |

### 7.11 Admin dashboard

| ID | Requirement |
|---|---|
| FR-ADM-01 | Responsive admin panel with sidebar. |
| FR-ADM-02 | Dashboard overview: Properties (Available 38 / Draft 4 / Sold 12), Leads (New 17 / Follow-up 23 / Site Visits 8 / Converted 3), Traffic (Views, WhatsApp clicks, Calls). **[+ Add Property]** button. |

### 7.12 Add/Edit property wizard

| ID | Requirement |
|---|---|
| FR-WIZ-01 | Multi-step wizard (not one giant form): |
| FR-WIZ-01a | Step 1 — Basic Information: Property ID (auto), title, type, description, status, location summary |
| FR-WIZ-01b | Step 2 — Land Area: base area (sq.ft) + measurement standard |
| FR-WIZ-01c | Step 3 — Dimensions: North/South/East/West, Road Frontage, Road Width |
| FR-WIZ-01d | Step 4 — Road & Connectivity: main road, highway, market, school, hospital, railway, airport, custom |
| FR-WIZ-01e | Step 5 — Utilities: electricity, water, drainage, internet, street lighting |
| FR-WIZ-01f | Step 6 — Location: lat/long, address, village, panchayat, block, district, PIN, precision |
| FR-WIZ-01g | Step 7 — Land Classification: classification, verification, source, notes |
| FR-WIZ-01h | Step 8 — Documents: upload securely |
| FR-WIZ-01i | Step 9 — Photos & Drone Media: upload + categorise |
| FR-WIZ-01j | Step 10 — Preview: exactly what the buyer sees |
| FR-WIZ-01k | Step 11 — Publish: [Save Draft] [Preview] [Publish] |

### 7.13 Media upload system

| ID | Requirement |
|---|---|
| FR-MED-01 | Upload from gallery, camera capture, multiple uploads, drag/reorder on supported devices, upload progress, retry failed uploads, delete, rename/caption. |
| FR-MED-02 | Set primary photo; categorise photos (Front/Rear/Left/Right/Road/Boundary/Drone/Video/Other). |
| FR-MED-03 | **Media optimisation**: original → compression → responsive sizes → WebP/AVIF → CDN → device. Videos: poster images, lazy load, no autoplay, streamed at appropriate resolution. |

### 7.14 Sharing & SEO

| ID | Requirement |
|---|---|
| FR-SEO-01 | Unique shareable URL: `chooseproperty.in/property/cp-br-0012`. |
| FR-SEO-02 | Open Graph preview on WhatsApp/social share: drone image, "1,500 sq.ft Residential Plot", "Patna, Bihar", "30 ft Road", "Contact for Price". |
| FR-SEO-03 | Per-page: SEO title, meta description, canonical URL, OG, Twitter card, structured data, sitemap, robots.txt. |
| FR-SEO-04 | Clean URLs e.g. `/property/1500-sqft-residential-plot-bihta-patna`. |
| FR-SEO-05 | Target searches: plots in Patna, land in Bihar, residential plots, commercial plots, localities, plot sizes, road access. No misleading SEO claims. |
| FR-SEO-06 | Property IDs (`CP-BR-0001`) used everywhere: property page, admin, WhatsApp, enquiry, lead, documents, analytics, internal communication. |

### 7.15 Admin authentication & roles

| ID | Requirement |
|---|---|
| FR-AUTH-01 | Email/password login (Supabase Auth) protecting all `/admin/*` routes. |
| FR-AUTH-02 | Roles: owner, admin, editor. Only owner/admin can manage standards & other admins. |
| FR-AUTH-03 | Visitors can never create/publish listings — enforced by RLS + app checks. |

---

## 8. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-MOB-01 | **Mobile-first.** Primary product on small/mid-range Android + iPhone. One-handed operation on property page. |
| NFR-PERF-01 | Fast first load on slow 4G; lazy-loaded images; minimal animation. |
| NFR-PERF-02 | LCP budget: ≤ 2.5 s on mid-range Android / 4G; CLS ≤ 0.1. |
| NFR-UX-01 | Large touch targets (≥ 44 px), clear typography, minimal navigation, sticky CTAs, swipeable galleries, bottom-sheet filters. |
| NFR-ACC-01 | Accessible: semantic HTML, contrast AA, keyboard operable, ARIA where needed. |
| NFR-SEC-01 | Private documents & coordinates never exposed publicly. Admin area fully protected. |
| NFR-SEC-02 | Lead form has basic abuse protection (honeypot + rate limit). |
| NFR-SEC-03 | Enforce RLS on all tables; never trust client-side for admin writes. |
| NFR-I18N-01 | UI in English; key microcopy may include Hindi transliteration where it aids local buyers. |

---

## 9. Content Requirements

- Default copy for all static pages (About, FAQ, Privacy, Terms) provided in implementation.
- Standard disclaimers (measurements, classification, diagrams, documents) as specified above — **non-negotiable**.
- Placeholder photography guidance for client (what to shoot: ground + drone angles).

---

## 10. Success Metrics

| Metric | Target (first 90 days) |
|---|---|
| Property detail page load (LCP) | ≤ 2.5 s mobile 4G |
| Enquiry form completion rate | ≥ 40% of starts |
| WhatsApp clicks per property view | ≥ 5% |
| Leads converted to site visit | ≥ 25% |
| Organic traffic share | Growing month-over-month |
| Admin daily active use | Client logs in ≥ 4×/week |

---

## 11. Out of Scope (v1)

- Open marketplace / seller accounts
- Payments / online booking / token booking
- Property valuation or pricing advice
- Automated legal verification (still manual, admin-entered)
- Native mobile apps (PWA later)

---

## 12. Risks & Open Questions

| Risk | Mitigation |
|---|---|
| Katha/Bigha conversion variance by district | Configurable standards + prominent informational notice + official records disclaimer |
| Admin uploads huge drone videos | Compression pipeline, poster images, streaming, storage quotas |
| Fake/duplicate enquiries | Honeypot, rate limit, source tracking, phone verification (later) |
| Legal exposure from classification claims | Conservative copy, verification statuses, disclaimers; never assert transferability |
| Low-quality listings (missing fields) | Wizard validation with required core fields; "pending verification" states |
