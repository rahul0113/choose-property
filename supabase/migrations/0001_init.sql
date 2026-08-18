-- ============================================================
-- Choose Property — Initial schema
-- Land & plot selling platform for Bihar, India
-- Run this migration in the Supabase SQL editor.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Measurement standards (configurable per district)
-- ------------------------------------------------------------
create table if not exists public.measurement_standards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null default 'Bihar',
  district text,                              -- null = applies across the state
  katha_sqft numeric not null,                -- 1 Katha in square feet
  bigha_katha numeric not null default 20,    -- 1 Bigha in Katha
  decimal_sqft numeric not null default 435.6, -- 1 Decimal in square feet (1/100 acre)
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Admins (mirrors auth.users)
-- ------------------------------------------------------------
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  role text not null default 'admin'
    check (role in ('owner', 'admin', 'editor')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Properties
-- ------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  property_id text not null unique,           -- e.g. CP-BR-0001
  title text not null,
  slug text not null unique,
  description text,
  property_type text not null
    check (property_type in ('residential', 'commercial', 'agricultural', 'other')),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'unpublished', 'sold')),
  availability text not null default 'available'
    check (availability in ('available', 'sold', 'under_contract')),
  facing text,                                 -- East, West, North, South, Corner, etc.
  price_display text not null default 'Contact for Price',
  created_by uuid references public.admins(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_status_idx on public.properties (status);
create index if not exists properties_type_idx on public.properties (property_type);
create index if not exists properties_slug_idx on public.properties (slug);

-- ------------------------------------------------------------
-- Property measurements (one authoritative base measurement)
-- ------------------------------------------------------------
create table if not exists public.property_measurements (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null unique references public.properties(id) on delete cascade,
  area_sqft numeric not null,                 -- authoritative base
  measurement_standard_id uuid references public.measurement_standards(id),
  north_ft numeric,
  south_ft numeric,
  east_ft numeric,
  west_ft numeric,
  road_frontage_ft numeric,
  road_width_ft numeric,
  plot_diagram_disclaimer text not null default
    'Informational — not a legal survey unless based on verified survey data.'
);

-- ------------------------------------------------------------
-- Property locations
-- ------------------------------------------------------------
create table if not exists public.property_locations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null unique references public.properties(id) on delete cascade,
  latitude numeric,
  longitude numeric,
  location_precision text not null default 'exact'
    check (location_precision in ('exact', 'approximate', 'hidden')),
  village text,
  panchayat text,
  block text,
  district text,
  state text not null default 'Bihar',
  pincode text,
  full_address text,
  nearby_landmark text,
  google_maps_url text
);

-- ------------------------------------------------------------
-- Nearby places / connectivity
-- ------------------------------------------------------------
create table if not exists public.nearby_places (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  place_type text not null,  -- main_road, highway, market, railway_station, airport, school, college, hospital, bank, petrol_pump, bus_stand, landmark, custom
  name text,
  distance_km numeric,
  distance_text text
);
create index if not exists nearby_places_property_idx on public.nearby_places (property_id);

-- ------------------------------------------------------------
-- Utilities (structured statuses)
-- ------------------------------------------------------------
create table if not exists public.property_utilities (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null unique references public.properties(id) on delete cascade,
  electricity text not null default 'unknown'
    check (electricity in ('available', 'nearby', 'not_available', 'unknown')),
  water text not null default 'unknown'
    check (water in ('available', 'nearby', 'not_available', 'unknown')),
  drainage text not null default 'unknown'
    check (drainage in ('available', 'nearby', 'not_available', 'unknown')),
  internet text not null default 'unknown'
    check (internet in ('available', 'nearby', 'not_available', 'unknown')),
  street_lighting text not null default 'unknown'
    check (street_lighting in ('available', 'nearby', 'not_available', 'unknown'))
);

-- ------------------------------------------------------------
-- Land classification (Gair Majarua etc.)
-- ------------------------------------------------------------
create table if not exists public.property_classifications (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null unique references public.properties(id) on delete cascade,
  classification text not null
    check (classification in ('private_raiyati', 'gair_majarua', 'gair_majarua_aam', 'gair_majarua_malik', 'other', 'unknown')),
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'client_provided', 'document_backed', 'admin_verified', 'officially_verified')),
  verification_source text,
  verification_date date,
  admin_notes text
);

-- ------------------------------------------------------------
-- Media (photos, drone photos, videos)
-- ------------------------------------------------------------
create table if not exists public.property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  media_type text not null
    check (media_type in ('photo', 'drone_photo', 'video', 'drone_video')),
  category text not null default 'general',
  -- front, rear, left, right, road, entrance, boundary, surroundings,
  -- nearby_road, nearby_development, general
  url text not null,
  storage_path text,
  caption text,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists property_media_property_idx on public.property_media (property_id);

-- ------------------------------------------------------------
-- Documents (stored privately by default)
-- ------------------------------------------------------------
create table if not exists public.property_documents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  document_type text not null,
  -- khatiyan, jamabandi, mutation, registry, sale_deed, ownership,
  -- land_record, tax_receipt, map, other
  name text not null,
  storage_path text not null,
  is_public boolean not null default false,
  uploaded_at timestamptz not null default now()
);
create index if not exists property_documents_property_idx on public.property_documents (property_id);

-- ------------------------------------------------------------
-- Leads (enquiries)
-- ------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null unique,               -- e.g. CP-LEAD-0045
  name text not null,
  phone text not null,
  whatsapp text,
  email text,
  property_id uuid references public.properties(id),
  source text not null default 'direct',
  -- google, organic, whatsapp, instagram, facebook, referral,
  -- advertisement, property_page, qr_code, direct
  utm_source text,
  utm_medium text,
  utm_campaign text,
  preferred_contact_method text,
  budget_range text,
  preferred_location text,
  plot_size text,
  purpose text,
  preferred_road_width text,
  purchase_timeline text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'interested', 'follow_up', 'site_visit', 'negotiation', 'converted', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_property_idx on public.leads (property_id);

-- ------------------------------------------------------------
-- Lead activity timeline
-- ------------------------------------------------------------
create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  activity_type text not null,
  -- enquiry_received, whatsapp, called, site_visit_scheduled,
  -- site_visit_completed, follow_up, note, status_change
  note text,
  created_by uuid references public.admins(id),
  created_at timestamptz not null default now()
);
create index if not exists lead_activities_lead_idx on public.lead_activities (lead_id);

-- ------------------------------------------------------------
-- Buyers (converted/qualified buyers)
-- ------------------------------------------------------------
create table if not exists public.buyers (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id),
  name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Analytics events (application-level tracking)
-- ------------------------------------------------------------
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null,
  -- page_view, property_view, whatsapp_click, call_click, enquiry_submit,
  -- filter_used, search, map_open, directions_click, media_view
  property_id uuid,
  property_code text,
  page_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device text,        -- mobile, tablet, desktop
  user_agent text,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_name_idx on public.analytics_events (event_name, created_at desc);
create index if not exists analytics_events_property_idx on public.analytics_events (property_id, created_at desc);
create index if not exists analytics_events_created_idx on public.analytics_events (created_at desc);

-- ------------------------------------------------------------
-- updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.measurement_standards enable row level security;
alter table public.properties enable row level security;
alter table public.property_measurements enable row level security;
alter table public.property_locations enable row level security;
alter table public.nearby_places enable row level security;
alter table public.property_utilities enable row level security;
alter table public.property_classifications enable row level security;
alter table public.property_media enable row level security;
alter table public.property_documents enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.buyers enable row level security;
alter table public.analytics_events enable row level security;
alter table public.admins enable row level security;

-- Public can only read published properties + related data.
create or replace function public.is_published_property(p_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.properties p
    where p.id = p_id and p.status = 'published'
  );
$$;

-- Anyone (including anon) may view published property data.
create policy "Public read: properties" on public.properties
  for select using (status = 'published');
create policy "Public read: measurements" on public.property_measurements
  for select using (public.is_published_property(property_id));
create policy "Public read: locations" on public.property_locations
  for select using (public.is_published_property(property_id));
create policy "Public read: nearby places" on public.nearby_places
  for select using (public.is_published_property(property_id));
create policy "Public read: utilities" on public.property_utilities
  for select using (public.is_published_property(property_id));
create policy "Public read: classifications" on public.property_classifications
  for select using (public.is_published_property(property_id));
create policy "Public read: media" on public.property_media
  for select using (public.is_published_property(property_id));
create policy "Public read: standards" on public.measurement_standards
  for select using (true);

-- Enquiries: anyone may insert leads (rate limiting should be added in app).
create policy "Public insert: leads" on public.leads
  for insert with check (true);

-- Analytics: anyone may insert events; only admins read.
create policy "Public insert: analytics" on public.analytics_events
  for insert with check (true);

-- Admin access helper: current user is in admins table.
create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.admins a where a.id = auth.uid()
  );
$$;

-- Admin policies (full access for admins on everything, private data stays private otherwise).
do $$
declare
  t text;
begin
  foreach t in array array[
    'properties', 'property_measurements', 'property_locations', 'nearby_places',
    'property_utilities', 'property_classifications', 'property_media',
    'property_documents', 'leads', 'lead_activities', 'buyers', 'admins',
    'measurement_standards', 'analytics_events'
  ] loop
    execute format(
      'create policy "Admin all: %s" on public.%I for all using (public.is_admin()) with check (public.is_admin());',
      t, t
    );
  end loop;
end $$;

-- ------------------------------------------------------------
-- Seed: default Bihar measurement standards
-- ------------------------------------------------------------
insert into public.measurement_standards (name, district, katha_sqft, bigha_katha, decimal_sqft, is_default) values
  ('Bihar Standard (Patna)', null, 1361, 20, 435.6, true),
  ('Patna District', 'Patna', 1361, 20, 435.6, false),
  ('Gaya District', 'Gaya', 1361, 20, 435.6, false),
  ('Muzaffarpur District', 'Muzaffarpur', 1361, 20, 435.6, false),
  ('Darbhanga District', 'Darbhanga', 1361, 20, 435.6, false),
  ('Purnia District', 'Purnia', 1361, 20, 435.6, false),
  ('Bhagalpur District', 'Bhagalpur', 1361, 20, 435.6, false)
on conflict do nothing;
