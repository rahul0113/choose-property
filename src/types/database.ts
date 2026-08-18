// Row types mirroring supabase/migrations/0001_init.sql (snake_case = DB column names).

export type PropertyType = "residential" | "commercial" | "agricultural" | "other";
export type PropertyStatus = "draft" | "published" | "unpublished" | "sold";
export type Availability = "available" | "sold" | "under_contract";
export type UtilityStatus = "available" | "nearby" | "not_available" | "unknown";
export type LocationPrecision = "exact" | "approximate" | "hidden";
export type Classification =
  | "private_raiyati"
  | "gair_majarua"
  | "gair_majarua_aam"
  | "gair_majarua_malik"
  | "other"
  | "unknown";
export type VerificationStatus =
  | "pending"
  | "client_provided"
  | "document_backed"
  | "admin_verified"
  | "officially_verified";
export type MediaType = "photo" | "drone_photo" | "video" | "drone_video";
export type MediaCategory =
  | "front"
  | "rear"
  | "left"
  | "right"
  | "road"
  | "entrance"
  | "boundary"
  | "surroundings"
  | "nearby_road"
  | "nearby_development"
  | "general";
export type PlaceType =
  | "main_road"
  | "highway"
  | "market"
  | "railway_station"
  | "airport"
  | "school"
  | "college"
  | "hospital"
  | "bank"
  | "petrol_pump"
  | "bus_stand"
  | "landmark"
  | "custom";
export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "follow_up"
  | "site_visit"
  | "negotiation"
  | "converted"
  | "lost";

export interface MeasurementStandard {
  id: string;
  name: string;
  state: string;
  district: string | null;
  katha_sqft: number;
  bigha_katha: number;
  decimal_sqft: number;
  is_default: boolean;
}

export interface Admin {
  id: string;
  email: string;
  name: string | null;
  role: "owner" | "admin" | "editor";
  created_at: string;
}

export interface Property {
  id: string;
  property_id: string;
  title: string;
  slug: string;
  description: string | null;
  property_type: PropertyType;
  status: PropertyStatus;
  availability: Availability;
  facing: string | null;
  price_display: string;
  open_sites: number | null;
  amenities: string[] | null;
  created_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyMeasurement {
  id: string;
  property_id: string;
  area_sqft: number;
  measurement_standard_id: string | null;
  north_ft: number | null;
  south_ft: number | null;
  east_ft: number | null;
  west_ft: number | null;
  road_frontage_ft: number | null;
  road_width_ft: number | null;
  plot_diagram_disclaimer: string;
}

export interface PropertyLocation {
  id: string;
  property_id: string;
  latitude: number | null;
  longitude: number | null;
  location_precision: LocationPrecision;
  village: string | null;
  panchayat: string | null;
  block: string | null;
  district: string | null;
  state: string;
  pincode: string | null;
  full_address: string | null;
  nearby_landmark: string | null;
  google_maps_url: string | null;
}

export interface NearbyPlace {
  id: string;
  property_id: string;
  place_type: PlaceType;
  name: string | null;
  distance_km: number | null;
  distance_text: string | null;
}

export interface PropertyUtilities {
  id: string;
  property_id: string;
  electricity: UtilityStatus;
  water: UtilityStatus;
  drainage: UtilityStatus;
  internet: UtilityStatus;
  street_lighting: UtilityStatus;
}

export interface PropertyClassification {
  id: string;
  property_id: string;
  classification: Classification;
  verification_status: VerificationStatus;
  verification_source: string | null;
  verification_date: string | null;
  admin_notes: string | null;
}

export interface PropertyMedia {
  id: string;
  property_id: string;
  media_type: MediaType;
  category: MediaCategory;
  url: string;
  storage_path: string | null;
  caption: string | null;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface PropertyDocument {
  id: string;
  property_id: string;
  document_type: string;
  name: string;
  storage_path: string;
  is_public: boolean;
  uploaded_at: string;
}

export interface Lead {
  id: string;
  lead_id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  property_id: string | null;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  preferred_contact_method: string | null;
  budget_range: string | null;
  preferred_location: string | null;
  plot_size: string | null;
  purpose: string | null;
  preferred_road_width: string | null;
  purchase_timeline: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Buyer {
  id: string;
  lead_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  created_at: string;
}

export interface AnalyticsEvent {
  id: number;
  event_name: string;
  property_id: string | null;
  property_code: string | null;
  page_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  device: string | null;
  user_agent: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
}

// Denormalised bundle used by public pages (single fetch per property).
export interface PropertyBundle {
  property: Property;
  measurements: PropertyMeasurement | null;
  location: PropertyLocation | null;
  nearby_places: NearbyPlace[];
  utilities: PropertyUtilities | null;
  classification: PropertyClassification | null;
  media: PropertyMedia[];
  documents: PropertyDocument[]; // public-facing checklist entries only
  standard: MeasurementStandard | null;
}
