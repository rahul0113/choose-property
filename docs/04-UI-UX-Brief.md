# Choose Property — UI/UX Brief

| | |
|---|---|
| **Product** | Choose Property |
| **Doc version** | 1.0 |
| **Status** | Draft for review |

---

## 1. Brand

- **Name**: Choose Property
- **Personality**: Professional, trustworthy, modern, transparent, local-market aware, technology-driven, premium but approachable.
- **Avoid**: the look of generic property listing templates.
- **Voice**: confident, factual, reassuring. Plain language; Hindi transliteration used only where it helps local buyers (e.g. "Katha", "Dismil", "Gair Majarua").

---

## 2. Design Principles

1. **Mobile-first is the product** — every layout is designed for one-handed use on a phone first, then extended to tablet/desktop.
2. **Data builds trust** — surface dimensions, road width, utilities, classification, and document status prominently. Facts beat adjectives.
3. **Every answer visible** — each of the buyer's 16 questions (PRD §5) has a clear place on the property page.
4. **Conservative honesty** — disclaimers for measurements, diagrams, and classification are part of the design, not fine print.
5. **Fast and calm** — minimal motion, lazy media, no popups, no autoplay.

---

## 3. Design Tokens

### 3.1 Colour
| Token | Value | Use |
|---|---|---|
| brand (teal) | `#0f766e` | Primary actions, links, headers, active states |
| brand-light | `#14b8a6` | Hover, highlights |
| brand-soft | `#ccfbf1` | Backgrounds, chips |
| accent (amber) | `#b45309` | WhatsApp/CTA emphasis, "Contact for Price" |
| accent-soft | `#fef3c7` | CTA backgrounds |
| ink | `#1e293b` | Headings, primary text |
| ink-soft | `#475569` | Body text |
| ink-faint | `#94a3b8` | Secondary/labels |
| paper | `#ffffff` / `#f8fafc` | Surfaces |
| line | `#e2e8f0` | Borders, dividers |

Semantic status colours: Available = green (`#16a34a`), Sold = red (`#dc2626`), Under contract = amber, Draft = slate. Utility statuses: Available = green dot, Nearby = amber dot, Not available = red dot, Unknown = grey dot.

### 3.2 Typography
- System sans stack (Roboto / Noto Sans fallback) — no web-font dependency for speed.
- Scale: 12 / 14 / 16 (body) / 18 / 20 / 24 / 30 / 36 px. Mobile hero ≤ 30 px.
- Line height 1.5 (body), 1.2 (headings). Numbers (areas, dimensions) set in tabular figures where available.
- Max reading width ~ 640 px for property copy; cards scale in grids.

### 3.3 Spacing / shape / elevation
- 4-pt spacing grid; page gutters 16 px mobile, 24–32 px desktop.
- Radius: 8 px (cards, inputs), 12 px (sheets/modals), full (chips, buttons pill variant).
- Shadow `card`: subtle `0 1px 3px rgba(15,23,42,.08), 0 4px 14px rgba(15,23,42,.06)`.
- Bottom sheet shadow: `0 -8px 30px rgba(15,23,42,.18)`.

### 3.4 Icons
- lucide-react, 20–24 px stroke icons. Utility dots use filled circles.

---

## 4. Mobile-First Rules

- Touch targets ≥ 44 × 44 px; primary CTA ≥ 48 px tall.
- Sticky bottom action bar on property detail (WhatsApp / Call / Enquire).
- Filters open as a **bottom sheet** with drag handle, Apply/Reset sticky at bottom.
- Galleries swipe horizontally with dot indicators + full-screen mode.
- Forms: single column, large inputs, `inputmode` set correctly (tel/numeric), autocomplete attributes.
- Lazy-load all below-the-fold images; hero gets priority fetch.
- No horizontal scroll anywhere; fluid grids collapse to 1 column on phones.

---

## 5. Page Specs (wireframe-level)

### 5.1 Header (all public pages)
Sticky top bar: logo "Choose Property" (mark: house/plot glyph + wordmark), nav: Home, Properties (dropdown: All / Residential / Commercial / Other), Converter, About, Contact. Mobile: hamburger → slide-over menu with large items + WhatsApp button pinned.

### 5.2 Footer
Brand + tagline; quick links (Properties, Converter, About, Contact, FAQ); legal (Privacy, Terms); contact block (WhatsApp, phone, email); "Land measurement conversions are informational…" micro-disclaimer; copyright.

### 5.3 Homepage (`/`)
1. **Hero** — full-bleed image (drone/land), overlay: "Find the right land. Understand every detail before you visit." CTAs [Explore Properties] [Contact Us]. Search bar (keyword + type + district) in hero.
2. **Featured properties** — horizontal scroll on mobile (snap), grid on desktop. Card = FR-CARD.
3. **Why Choose Property?** — 8 value tiles (detailed land info, exact dimensions, road/connectivity, ground photos, drone views, measurement support, documentation, direct contact).
4. **Land measurement tools** — unit chips (Katha, Dismil/Decimal, Bigha, Sq.ft, Sq.m, Acre, Hectare) → /converter.
5. **Contact CTA band** — "Looking for a specific plot?" [WhatsApp Us] [Call Us] [Enquire Now].

### 5.4 Listing pages (`/properties…`)
- Sticky filter bar: search input + [Filters] button (badge shows active filter count).
- Filter bottom sheet: sections with headings; chips/segmented controls; range sliders for plot size & road width (with preset chips); [Reset] [Apply].
- Cards grid (1 col mobile, 2 tablet, 3–4 desktop). "Load more" button.

### 5.5 Property card (mobile)
```
┌──────────────────────────────────┐
│  DRONE/IMAGE   (4:3, lazy)        │  badge: Sold/Available
│  ID chip: CP-BR-0012              │
├──────────────────────────────────┤
│  1,500 sq.ft Residential Plot     │
│  Patna, Bihar  ·  30 ft Road      │
│  East Facing  ·  ⚡ Electricity    │
│  Contact for Price                │
│  [ View Property ]                │
└──────────────────────────────────┘
```

### 5.6 Property detail (`/property/[slug]`) — single-column, one hand
1. Hero image (priority) + title block: title, ID, location, area, "Contact for Price".
2. Sticky action bar (always visible): [WhatsApp] [Call Now] (+ [Enquire]).
3. Key facts strip: Area, Dimensions, Road width, Facing, Utilities summary (icons).
4. Photo gallery — categories (Ground/Drone/Video) as tab chips; swipeable rows; tap → fullscreen.
5. Plot dimensions + **informational diagram** (N/S/E/W + road at bottom) + disclaimer line.
6. Land area — sq.ft + local units table (Decimal, Dismil, Katha, Bigha) + standard name + notice.
7. Land classification — card with classification + verification status chip (Pending/Verified…) + source/date + disclaimer.
8. Documentation — checklist with ✓ statuses + "Verified/Pending/Not verified" chips.
9. Road & connectivity — two-column fact list; distances as "450 m", "2.4 km".
10. Utilities — 5 rows with status dots + labels.
11. Location & map — address block, map embed, [Get Directions]; location precision handled by admin.
12. [WhatsApp Us] [Enquire] closing band.

### 5.7 Converter (`/converter`)
- Card: value input (big, numeric), unit select, standard select (district-aware). Output grid of all units with ≈ values. Informational notice at bottom.

### 5.8 Enquiry form (modal / page)
- Modal on property page; full page on /contact. Required markers, inline validation, success state with WhatsApp shortcut. Optional fields collapsible under "More details (optional)".

### 5.9 Static pages
About, FAQ (accordion), Privacy, Terms — clean prose, 640 px column, section headings, last-updated date.

### 5.10 Admin (desktop-first, works on tablet/phone)
- Sidebar (collapsible to bottom tabs on mobile): Dashboard, Properties, Media, Documents, Leads, Buyers, Analytics, Settings.
- Dashboard: stat cards (Properties Available/Draft/Sold; Leads New/Follow-up/Site Visits/Converted; Traffic Views/WhatsApp/Calls) + [+ Add Property].
- Wizard: step indicator on top, one section per screen, back/next, per-step validation, sticky [Save Draft] [Preview] [Publish].
- Tables: dense, sortable, filterable; status chips; row actions.
- Lead detail: two-pane (details + timeline) on desktop, stacked on mobile.

---

## 6. Microcopy Guidelines

- **CTAs**: "View Property", "Contact for Price", "WhatsApp Us", "Call Now", "Enquire Now", "Get Directions", "Explore Properties".
- **Price**: always "Contact for Price" publicly.
- **Disclaimers (exact copy, non-negotiable)**:
  - Diagram: *"Informational — not a legal survey unless based on verified survey data."*
  - Measurements: *"Land measurement conversions are informational and may vary by local convention, district, historical usage, or official records. Buyers should verify measurements against applicable official land records/survey documentation."*
  - Classification: *"Information shown is provided by the client/admin and may be pending verification. Buyers must independently verify title, classification, ownership, encumbrances, and legal status before purchase."*
- **Empty states**: "No properties match your filters yet — try widening your search." (with reset action)
- **Success**: "Thank you! The Choose Property team will contact you shortly."

---

## 7. Accessibility

- Semantic landmarks (header/nav/main/footer), single `h1` per page.
- Colour contrast ≥ AA (4.5:1 body, 3:1 large text); status not conveyed by colour alone (dot + label).
- Focus visible states; skip-to-content link; aria labels on icon buttons.
- Reduced-motion: respect `prefers-reduced-motion`.
- Forms: labels associated, errors announced, autocomplete + inputmode set.

---

## 8. Image & Video Guidelines

- Cover images: 4:3 or 16:9; min 1200 px wide; WebP/AVIF.
- Drone photos: wide aerial preferred as hero/OG image.
- Videos: ≤ 30 s highlight clips; poster image; no autoplay.
- Captions + alt text encouraged ("Boundary view from north side").
