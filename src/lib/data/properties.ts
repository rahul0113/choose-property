// Public data access for properties.
// If Supabase env vars are configured we query the database (RLS exposes only
// published rows); otherwise we serve the offline demo catalogue so the site
// runs on localhost:3000 with no external dependencies.

import type {
  Availability,
  PropertyBundle,
  PropertyType,
} from "@/types/database";
import { DEMO_BUNDLES } from "@/lib/data/demo";
import { getStandard } from "@/lib/measurements/standards";

export const USE_SUPABASE =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface ListingFilters {
  q?: string;
  type?: PropertyType;
  district?: string;
  minArea?: number;
  maxArea?: number;
  roadWidth?: number;
  facing?: string;
  availability?: Availability;
  electricity?: boolean;
  water?: boolean;
  drainage?: boolean;
  openSites?: number;
  amenities?: string[];
}

function normalize(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function getArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return v.split(",").filter(Boolean);
}

export function parseListingFilters(searchParams: Record<string, string | string[] | undefined>): ListingFilters {
  const num = (v: string | undefined) => {
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const bool = (v: string | undefined) => v === "1" || v === "true" || v === "yes";
  return {
    q: normalize(searchParams.q)?.trim() || undefined,
    type: normalize(searchParams.type) as PropertyType | undefined,
    district: normalize(searchParams.district)?.trim() || undefined,
    minArea: num(normalize(searchParams.min_area)),
    maxArea: num(normalize(searchParams.max_area)),
    roadWidth: num(normalize(searchParams.road_width)),
    facing: normalize(searchParams.facing)?.trim() || undefined,
    availability: normalize(searchParams.availability) as Availability | undefined,
    electricity: normalize(searchParams.electricity) ? bool(normalize(searchParams.electricity)) : undefined,
    water: normalize(searchParams.water) ? bool(normalize(searchParams.water)) : undefined,
    drainage: normalize(searchParams.drainage) ? bool(normalize(searchParams.drainage)) : undefined,
    openSites: num(normalize(searchParams.open_sites)),
    amenities: getArray(searchParams.amenities).length > 0 ? getArray(searchParams.amenities) : undefined,
  };
}

export function countActiveFilters(f: ListingFilters): number {
  let n = 0;
  if (f.q) n += 1;
  if (f.type) n += 1;
  if (f.district) n += 1;
  if (f.minArea) n += 1;
  if (f.maxArea) n += 1;
  if (f.roadWidth) n += 1;
  if (f.facing) n += 1;
  if (f.availability) n += 1;
  if (f.electricity) n += 1;
  if (f.water) n += 1;
  if (f.drainage) n += 1;
  if (f.openSites) n += 1;
  if (f.amenities && f.amenities.length > 0) n += f.amenities.length;
  return n;
}

/** All bundles with `status = 'published'` (RLS-equivalent rule). */
function publishedOnly(bundles: PropertyBundle[]): PropertyBundle[] {
  return bundles.filter((b) => b.property.status === "published");
}

function applyFilters(bundles: PropertyBundle[], f: ListingFilters): PropertyBundle[] {
  const q = f.q?.toLowerCase();
  return bundles.filter((b) => {
    const p = b.property;
    const loc = b.location;
    if (f.type && p.property_type !== f.type) return false;
    if (f.district && loc?.district !== f.district) return false;
    if (f.facing && p.facing !== f.facing) return false;
    if (f.availability && p.availability !== f.availability) return false;
    const area = b.measurements?.area_sqft;
    if (f.minArea && (area == null || area < f.minArea)) return false;
    if (f.maxArea && (area == null || area > f.maxArea)) return false;
    if (f.roadWidth && (b.measurements?.road_width_ft == null || b.measurements.road_width_ft < f.roadWidth)) return false;
    const util = b.utilities;
    if (f.electricity && util?.electricity !== "available") return false;
    if (f.water && util?.water !== "available") return false;
    if (f.drainage && util?.drainage !== "available") return false;
    // Open sites filter
    if (f.openSites != null && (p.open_sites == null || p.open_sites < f.openSites)) return false;
    // Amenities filter (must have ALL selected amenities)
    if (f.amenities && f.amenities.length > 0) {
      if (!p.amenities || p.amenities.length === 0) return false;
      const hasAll = f.amenities.every(a => p.amenities!.includes(a));
      if (!hasAll) return false;
    }
    if (q) {
      const haystack = [
        p.title,
        p.description,
        p.property_id,
        loc?.district,
        loc?.village,
        loc?.block,
        loc?.nearby_landmark,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

async function bundlesFromSupabase(): Promise<PropertyBundle[]> {
  const { getSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await getSupabaseServerClient();

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error || !properties) return [];

  const ids = properties.map((p) => p.id);
  if (ids.length === 0) return [];

  const fetchRows = async <T,>(table: string): Promise<Map<string, T[]>> => {
    const { data, error: e } = await supabase.from(table).select("*").in("property_id", ids);
    const map = new Map<string, T[]>();
    if (e || !data) return map;
    for (const row of data as Array<Record<string, unknown>>) {
      const key = String(row.property_id);
      const list = map.get(key) ?? [];
      list.push(row as T);
      map.set(key, list);
    }
    return map;
  };

  const [measurements, locations, nearby, utilities, classifications, media] = await Promise.all([
    fetchRows("property_measurements"),
    fetchRows("property_locations"),
    fetchRows("nearby_places"),
    fetchRows("property_utilities"),
    fetchRows("property_classifications"),
    fetchRows("property_media"),
  ]);

  const { data: standards } = await supabase.from("measurement_standards").select("*");
  const stdMap = new Map((standards ?? []).map((s) => [s.id, s]));

  return properties.map((p) => ({
    property: p,
    measurements: measurements.get(p.id)?.[0] ?? null,
    location: locations.get(p.id)?.[0] ?? null,
    nearby_places: nearby.get(p.id) ?? [],
    utilities: utilities.get(p.id)?.[0] ?? null,
    classification: classifications.get(p.id)?.[0] ?? null,
    media: (media.get(p.id) ?? []).sort((a, b) => a.sort_order - b.sort_order),
    documents: [], // private — never exposed publicly (RLS)
    standard: measurements.get(p.id)?.[0]?.measurement_standard_id ? stdMap.get(measurements.get(p.id)![0].measurement_standard_id!) ?? null : null,
  }));
}

async function allBundles(): Promise<PropertyBundle[]> {
  if (USE_SUPABASE) {
    const rows = await bundlesFromSupabase();
    if (rows.length > 0) return rows;
  }
  // Attach the standard to each demo bundle (kept null in the data file).
  return DEMO_BUNDLES.map((b) => ({
    ...b,
    standard: b.standard ?? getStandard(b.measurements?.measurement_standard_id),
  }));
}

export async function getPublishedProperties(filters: ListingFilters = {}): Promise<PropertyBundle[]> {
  const bundles = await allBundles();
  return applyFilters(publishedOnly(bundles), filters);
}

export async function getFeaturedProperties(limit = 3): Promise<PropertyBundle[]> {
  const bundles = await allBundles();
  return publishedOnly(bundles)
    .filter((b) => b.property.availability === "available")
    .slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<PropertyBundle | null> {
  const bundles = await allBundles();
  const found = bundles.find((b) => b.property.slug === slug && b.property.status === "published");
  if (!found) return null;
  return { ...found, standard: found.standard ?? getStandard(found.measurements?.measurement_standard_id) };
}

export async function getDistricts(): Promise<string[]> {
  const bundles = await allBundles();
  const districts = new Set<string>();
  for (const b of bundles) {
    if (b.location?.district) districts.add(b.location.district);
  }
  return Array.from(districts).sort();
}

/** Public-facing document checklist (files themselves stay private — FR-DET-50/51). */
export function getPublicDocumentChecklist(bundle: PropertyBundle): Array<{ name: string; status: "verified" | "pending" | "not_verified" }> {
  const statusOf = (type: string): "verified" | "pending" | "not_verified" => {
    const doc = bundle.documents.find((d) => d.document_type === type && d.is_public);
    if (!doc) return "not_verified";
    const v = bundle.classification?.verification_status;
    if (v === "officially_verified" || v === "document_backed") return "verified";
    if (v === "client_provided" || v === "admin_verified") return "pending";
    return "pending";
  };
  return [
    { name: "Land records (Khatiyan)", status: statusOf("khatiyan") },
    { name: "Ownership documents (Jamabandi)", status: statusOf("jamabandi") },
    { name: "Mutation information", status: statusOf("mutation") },
  ];
}
