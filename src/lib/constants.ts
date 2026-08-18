import type {
  Availability,
  Classification,
  PropertyType,
  UtilityStatus,
  VerificationStatus,
  PlaceType,
  MediaCategory,
  MediaType,
} from "@/types/database";

export const PROPERTY_TYPES: PropertyType[] = ["residential", "commercial", "agricultural", "other"];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  residential: "Residential Plot",
  commercial: "Commercial Plot",
  agricultural: "Agricultural Land",
  other: "Other Land",
};

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  available: "Available",
  sold: "Sold",
  under_contract: "Under Contract",
};

export const UTILITY_LABELS: Record<UtilityStatus, string> = {
  available: "Available",
  nearby: "Nearby",
  not_available: "Not Available",
  unknown: "Unknown",
};

export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  private_raiyati: "Private / Raiyati",
  gair_majarua: "Gair Majarua",
  gair_majarua_aam: "Gair Majarua Aam",
  gair_majarua_malik: "Gair Majarua Malik",
  other: "Other",
  unknown: "Unknown / Needs Verification",
};

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  pending: "Pending",
  client_provided: "Client-provided",
  document_backed: "Document-backed",
  admin_verified: "Admin-verified",
  officially_verified: "Officially verified",
};

export const FACINGS = [
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
  "Corner",
] as const;

export const PLACE_TYPE_LABELS: Record<PlaceType, string> = {
  main_road: "Main Road",
  highway: "Highway",
  market: "Market",
  railway_station: "Railway Station",
  airport: "Airport",
  school: "School",
  college: "College",
  hospital: "Hospital",
  bank: "Bank",
  petrol_pump: "Petrol Pump",
  bus_stand: "Bus Stand",
  landmark: "Landmark",
  custom: "Nearby",
};

export const MEDIA_CATEGORY_LABELS: Record<MediaCategory, string> = {
  front: "Front",
  rear: "Rear",
  left: "Left",
  right: "Right",
  road: "Road",
  entrance: "Entrance",
  boundary: "Boundary",
  surroundings: "Surroundings",
  nearby_road: "Nearby Road",
  nearby_development: "Nearby Development",
  general: "General",
};

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  photo: "Photo",
  drone_photo: "Drone Photo",
  video: "Video",
  drone_video: "Drone Video",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  khatiyan: "Khatiyan / Land records",
  jamabandi: "Jamabandi",
  mutation: "Mutation information",
  registry: "Registry",
  sale_deed: "Sale deed",
  ownership: "Ownership documents",
  land_record: "Land record",
  tax_receipt: "Tax receipt",
  map: "Map / Sketch",
  other: "Other document",
};

export const BUDGET_RANGES = [
  "Below ₹5 Lakh",
  "₹5 – 10 Lakh",
  "₹10 – 25 Lakh",
  "₹25 – 50 Lakh",
  "₹50 Lakh – 1 Crore",
  "Above ₹1 Crore",
] as const;

export const PURPOSES = ["Residential", "Commercial", "Investment", "Agriculture", "Other"] as const;

export const PURCHASE_TIMELINES = [
  "Immediately",
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "6+ months",
  "Just researching",
] as const;

export const CONTACT_METHODS = ["WhatsApp", "Phone call", "Email"] as const;

export const ROAD_WIDTH_OPTIONS = ["Below 20 ft", "20 – 30 ft", "30 – 40 ft", "40+ ft"] as const;

export const LEAD_SOURCES = [
  "google",
  "organic",
  "whatsapp",
  "instagram",
  "facebook",
  "referral",
  "advertisement",
  "property_page",
  "qr_code",
  "direct",
] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "interested",
  "follow_up",
  "site_visit",
  "negotiation",
  "converted",
  "lost",
] as const;

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  follow_up: "Follow-up",
  site_visit: "Site Visit",
  negotiation: "Negotiation",
  converted: "Converted",
  lost: "Lost",
};

// Non-negotiable disclaimers (PRD / UI brief §6) — exact copy.
export const DISCLAIMER_MEASUREMENTS =
  "Land measurement conversions are informational and may vary by local convention, district, historical usage, or official records. Buyers should verify measurements against applicable official land records/survey documentation.";

export const DISCLAIMER_DIAGRAM =
  "Informational — not a legal survey unless based on verified survey data.";

export const DISCLAIMER_CLASSIFICATION =
  "Information shown is provided by the client/admin and may be pending verification. Buyers must independently verify title, classification, ownership, encumbrances, and legal status before purchase.";

export const SITE_NAME = "Choose Property";
export const SITE_TAGLINE = "Find the right land. Understand every detail before you visit.";
