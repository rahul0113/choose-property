# Choose Property — Backend Schema

| | |
|---|---|
| **Product** | Choose Property |
| **Doc version** | 1.0 |
| **Status** | Draft for review |
| **Source of truth** | `supabase/migrations/0001_init.sql` |

---

## 1. Conventions

- **Database**: PostgreSQL 15 (Supabase).
- **Primary keys**: `uuid` default `gen_random_uuid()`.
- **Timestamps**: `timestamptz not null default now()`; `updated_at` maintained by trigger on `properties` and `leads`.
- **Naming**: `snake_case`, plural tables, singular FK columns (`property_id`).
- **Security**: Row Level Security enabled on **every** table; public access strictly read-only except lead/analytics inserts.
- **Money**: prices stored as display text privately (`price_display`); never public.

---

## 2. Entity Relationship (summary)

```
measurement_standards 1───0..* property_measurements
admins       1───0..* properties (created_by)
properties   1───1  property_measurements
properties   1───1  property_locations
properties   1───1  property_utilities
properties   1───1  property_classifications
properties   1───0..* nearby_places
properties   1───0..* property_media
properties   1───0..* property_documents
properties   1───0..* leads (property_id)
leads        1───0..* lead_activities
leads        0..1──1 buyers
admins       1───0..* lead_activities (created_by)
properties   1───0..* analytics_events (property_id, optional)
```

---

## 3. Tables

### 3.1 `admins`
Admin profiles linked to `auth.users`.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | references `auth.users(id)` on delete cascade |
| email | text UNIQUE NOT NULL | |
| name | text | |
| role | text NOT NULL default 'admin' | check in (`owner`,`admin`,`editor`) |
| created_at | timestamptz | |

### 3.2 `measurement_standards`
Configurable local conversion standards (PRD FR-MEAS-02/05).

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text NOT NULL | e.g. "Bihar Standard (Patna)" |
| state | text NOT NULL default 'Bihar' | |
| district | text NULL | null = state-wide |
| katha_sqft | numeric NOT NULL | 1 Katha in sq.ft (default 1361) |
| bigha_katha | numeric NOT NULL default 20 | 1 Bigha in Katha |
| decimal_sqft | numeric NOT NULL default 435.6 | 1 Decimal in sq.ft |
| is_default | boolean NOT NULL default false | exactly one per state |
| created_at | timestamptz | |

### 3.3 `properties`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| property_id | text UNIQUE NOT NULL | human ID `CP-BR-0001` (FR-SEO-06) |
| title | text NOT NULL | |
| slug | text UNIQUE NOT NULL | e.g. `1500-sqft-residential-plot-bihta-patna` |
| description | text | |
| property_type | text NOT NULL | check (`residential`,`commercial`,`agricultural`,`other`) |
| status | text NOT NULL default 'draft' | check (`draft`,`published`,`unpublished`,`sold`) |
| availability | text NOT NULL default 'available' | check (`available`,`sold`,`under_contract`) |
| facing | text | East/West/North/South/Corner… |
| price_display | text NOT NULL default 'Contact for Price' | public display only |
| created_by | uuid | → admins(id) |
| published_at | timestamptz | set on publish |
| created_at / updated_at | timestamptz | trigger on update |

Indexes: `(status)`, `(property_type)`, `(slug)`.

### 3.4 `property_measurements` (1:1)
One authoritative base measurement (FR-MEAS-06).

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| property_id | uuid UNIQUE NOT NULL | → properties(id) on delete cascade |
| area_sqft | numeric NOT NULL | **authoritative** |
| measurement_standard_id | uuid | → measurement_standards(id) |
| north_ft / south_ft / east_ft / west_ft | numeric | plot dimensions |
| road_frontage_ft | numeric | |
| road_width_ft | numeric | |
| plot_diagram_disclaimer | text NOT NULL default | "Informational — not a legal survey…" |

### 3.5 `property_locations` (1:1)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| property_id | uuid UNIQUE NOT NULL | cascade |
| latitude / longitude | numeric | precision controlled below |
| location_precision | text NOT NULL default 'exact' | check (`exact`,`approximate`,`hidden`) (FR-DET-82) |
| village / panchayat / block / district | text | |
| state | text NOT NULL default 'Bihar' | |
| pincode | text | |
| full_address | text | |
| nearby_landmark | text | |
| google_maps_url | text | |

### 3.6 `nearby_places` (1:N)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| property_id | uuid NOT NULL | cascade; indexed |
| place_type | text NOT NULL | main_road, highway, market, railway_station, airport, school, college, hospital, bank, petrol_pump, bus_stand, landmark, custom |
| name | text | |
| distance_km | numeric | |
| distance_text | text | display override e.g. "450 m" |

### 3.7 `property_utilities` (1:1)
| Column | Type | Notes (all check-constrained) |
|---|---|---|
| id | uuid PK | |
| property_id | uuid UNIQUE NOT NULL | cascade |
| electricity | text NOT NULL default 'unknown' | available / nearby / not_available / unknown |
| water | text | same enum |
| drainage | text | same enum |
| internet | text | same enum |
| street_lighting | text | same enum |

### 3.8 `property_classifications` (1:1)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| property_id | uuid UNIQUE NOT NULL | cascade |
| classification | text NOT NULL | `private_raiyati`, `gair_majarua`, `gair_majarua_aam`, `gair_majarua_malik`, `other`, `unknown` (FR-DET-40) |
| verification_status | text NOT NULL default 'pending' | `pending`, `client_provided`, `document_backed`, `admin_verified`, `officially_verified` |
| verification_source | text | |
| verification_date | date | |
| admin_notes | text | internal |

### 3.9 `property_media` (1:N)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| property_id | uuid NOT NULL | cascade; indexed |
| media_type | text NOT NULL | `photo`, `drone_photo`, `video`, `drone_video` |
| category | text NOT NULL default 'general' | front, rear, left, right, road, entrance, boundary, surroundings, nearby_road, nearby_development, general |
| url | text NOT NULL | public CDN URL |
| storage_path | text | bucket path |
| caption / alt_text | text | |
| is_primary | boolean NOT NULL default false | one primary per property |
| sort_order | integer NOT NULL default 0 | |
| created_at | timestamptz | |

### 3.10 `property_documents` (1:N, private)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| property_id | uuid NOT NULL | cascade; indexed |
| document_type | text NOT NULL | khatiyan, jamabandi, mutation, registry, sale_deed, ownership, land_record, tax_receipt, map, other |
| name | text NOT NULL | |
| storage_path | text NOT NULL | in **private** bucket |
| is_public | boolean NOT NULL default false | only drives the public checklist, never the file |
| uploaded_at | timestamptz | |

### 3.11 `leads`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| lead_id | text UNIQUE NOT NULL | `CP-LEAD-0045` |
| name | text NOT NULL | |
| phone | text NOT NULL | |
| whatsapp | text | |
| email | text | |
| property_id | uuid | → properties(id) |
| source | text NOT NULL default 'direct' | google, organic, whatsapp, instagram, facebook, referral, advertisement, property_page, qr_code, direct |
| utm_source / utm_medium / utm_campaign | text | FR-LEAD-06 |
| preferred_contact_method | text | |
| budget_range | text | |
| preferred_location | text | |
| plot_size | text | |
| purpose | text | residential / commercial / investment / agriculture / other |
| preferred_road_width | text | |
| purchase_timeline | text | immediately / 1 month / 1-3 months / 3-6 months / 6+ months / researching |
| message | text | |
| status | text NOT NULL default 'new' | new, contacted, interested, follow_up, site_visit, negotiation, converted, lost |
| created_at / updated_at | timestamptz | trigger on update |

Indexes: `(status)`, `(property_id)`.

### 3.12 `lead_activities` (1:N timeline)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| lead_id | uuid NOT NULL | cascade; indexed |
| activity_type | text NOT NULL | enquiry_received, whatsapp, called, site_visit_scheduled, site_visit_completed, follow_up, note, status_change |
| note | text | |
| created_by | uuid | → admins(id) |
| created_at | timestamptz | |

### 3.13 `buyers`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| lead_id | uuid | → leads(id) |
| name / phone | text NOT NULL | |
| email | text | |
| created_at | timestamptz | |

### 3.14 `analytics_events`
| Column | Type | Notes |
|---|---|---|
| id | bigint identity PK | |
| event_name | text NOT NULL | page_view, property_view, whatsapp_click, call_click, enquiry_submit, filter_used, search, map_open, directions_click, media_view |
| property_id | uuid | optional |
| property_code | text | e.g. CP-BR-0012 |
| page_path | text | |
| referrer | text | |
| utm_source / utm_medium / utm_campaign | text | |
| device | text | mobile / tablet / desktop |
| user_agent | text | |
| meta | jsonb | flexible extras |
| created_at | timestamptz | |

Indexes: `(event_name, created_at desc)`, `(property_id, created_at desc)`, `(created_at desc)`.

---

## 4. Functions, Triggers, Policies

### 4.1 Functions
- `set_updated_at()` — trigger function for `properties`/`leads`.
- `is_published_property(p_id uuid)` — true if property `status = 'published'`; used by public RLS policies.
- `is_admin()` — true if `auth.uid()` exists in `admins`; security definer.

### 4.2 RLS matrix
| Table | Public select | Public insert | Admin (all) |
|---|---|---|---|
| properties | status = 'published' | ✗ | ✓ |
| property_measurements | published ✓ | ✗ | ✓ |
| property_locations | published ✓ | ✗ | ✓ |
| nearby_places | published ✓ | ✗ | ✓ |
| property_utilities | published ✓ | ✗ | ✓ |
| property_classifications | published ✓ | ✗ | ✓ |
| property_media | published ✓ | ✗ | ✓ |
| property_documents | ✗ (never) | ✗ | ✓ |
| measurement_standards | ✓ all | ✗ | ✓ |
| leads | ✗ | ✓ (insert only) | ✓ |
| lead_activities | ✗ | ✗ | ✓ |
| buyers | ✗ | ✗ | ✓ |
| analytics_events | ✗ | ✓ (insert only) | ✓ |
| admins | ✗ | ✗ | ✓ |

---

## 5. Storage

| Bucket | Public? | Notes |
|---|---|---|
| `property-media` | yes | photos, drone photos, videos, posters; served via CDN with Supabase Image Transformations (`?width=…&format=webp`) |
| `property-documents` | **no** | original legal documents; admin-only signed URLs for private sharing |

Path convention: `{bucket}/{propertyId}/{type}-{uuid}.{ext}` e.g. `property-media/CP-BR-0001/drone-8f3a….webp`.

---

## 6. Auth

- Supabase Auth, email/password, admin-only usage.
- Admin rows inserted manually (or via owner bootstrap script) linking `auth.users.id`.
- Sessions via `@supabase/ssr` cookies; `middleware.ts` protects `/admin/*`.

---

## 7. ID Sequences

- `CP-BR-####`: state code `BR` + 4-digit sequence (computed as max existing + 1; advisory lock to avoid races).
- `CP-LEAD-####`: 4-digit sequence on `leads`.

---

## 8. Seed Data

- Default measurement standards (Bihar Patna standard as default + district presets: Patna, Gaya, Muzaffarpur, Darbhanga, Purnia, Bhagalpur).
- No demo properties (client adds real ones).
