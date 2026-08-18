// Demo catalogue — rich, realistic published properties so the site is fully
// viewable without a live Supabase project (Implementation Plan §7: "site
// shippable without real media"). Swapped out for real Supabase rows via
// lib/data/properties.ts once env vars are configured.

import type {
  NearbyPlace,
  Property,
  PropertyBundle,
  PropertyClassification,
  PropertyLocation,
  PropertyMeasurement,
  PropertyMedia,
  PropertyUtilities,
} from "@/types/database";

const img = (id: string, w = 1200, extra = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70${extra}`;

const SAMPLE_VIDEO = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

const LAND_1 = "1500382017468-9049fed747ef"; // green field, path
const LAND_2 = "1500530855697-b586d89ba3ee"; // farm at sunset
const LAND_3 = "1625246333195-78d9c38ad449"; // tractor in field
const LAND_4 = "1625244724120-1fd1d34d00f6"; // aerial farmland
const LAND_5 = "1470071459604-3b5ec3a7fe05"; // rolling hills
const LAND_6 = "1501785888041-af3ef285b470"; // open valley
const LAND_7 = "1469474968028-56623f02e42e"; // mountain meadow
const LAND_8 = "1441974231531-c6227db76b6e"; // forest clearing

let mediaSeq = 0;
function mkMedia(
  propertyId: string,
  mediaType: PropertyMedia["media_type"],
  category: PropertyMedia["category"],
  url: string,
  caption: string,
  isPrimary = false
): PropertyMedia {
  mediaSeq += 1;
  return {
    id: `pm-${propertyId}-${mediaSeq}`,
    property_id: propertyId,
    media_type: mediaType,
    category,
    url,
    storage_path: null,
    caption,
    alt_text: caption,
    is_primary: isPrimary,
    sort_order: mediaSeq,
    created_at: "2026-07-01T10:00:00Z",
  };
}

let placeSeq = 0;
function mkPlace(
  propertyId: string,
  placeType: NearbyPlace["place_type"],
  name: string | null,
  distance_km: number | null,
  distance_text: string | null = null
): NearbyPlace {
  placeSeq += 1;
  return { id: `np-${propertyId}-${placeSeq}`, property_id: propertyId, place_type: placeType, name, distance_km, distance_text };
}

function bundle(
  p: Property,
  extra: Partial<Pick<PropertyBundle, "measurements" | "location" | "nearby_places" | "utilities" | "classification" | "media" | "documents" | "standard">>
): PropertyBundle {
  return {
    property: p,
    measurements: extra.measurements ?? null,
    location: extra.location ?? null,
    nearby_places: extra.nearby_places ?? [],
    utilities: extra.utilities ?? null,
    classification: extra.classification ?? null,
    media: extra.media ?? [],
    documents: extra.documents ?? [],
    standard: extra.standard ?? null,
  };
}

const STANDARD_PATNA = "std-patna";
const STANDARD_GAYA = "std-gaya";
const STANDARD_MUZ = "std-muzaffarpur";
const STANDARD_DARB = "std-darbhanga";
const STANDARD_PURNIA = "std-purnia";

function measurements(
  propertyId: string,
  areaSqft: number,
  standardId: string,
  dims: { n?: number; s?: number; e?: number; w?: number; frontage?: number; road?: number }
): PropertyMeasurement {
  return {
    id: `ms-${propertyId}`,
    property_id: propertyId,
    area_sqft: areaSqft,
    measurement_standard_id: standardId,
    north_ft: dims.n ?? null,
    south_ft: dims.s ?? null,
    east_ft: dims.e ?? null,
    west_ft: dims.w ?? null,
    road_frontage_ft: dims.frontage ?? null,
    road_width_ft: dims.road ?? null,
    plot_diagram_disclaimer:
      "Informational — not a legal survey unless based on verified survey data.",
  };
}

function location(
  propertyId: string,
  data: {
    lat?: number | null;
    lng?: number | null;
    precision?: PropertyLocation["location_precision"];
    village: string;
    block: string;
    district: string;
    pincode: string;
    fullAddress: string;
    landmark: string;
  }
): PropertyLocation {
  return {
    id: `loc-${propertyId}`,
    property_id: propertyId,
    latitude: data.lat ?? null,
    longitude: data.lng ?? null,
    location_precision: data.precision ?? "exact",
    village: data.village,
    panchayat: null,
    block: data.block,
    district: data.district,
    state: "Bihar",
    pincode: data.pincode,
    full_address: data.fullAddress,
    nearby_landmark: data.landmark,
    google_maps_url: data.lat && data.lng ? `https://www.google.com/maps?q=${data.lat},${data.lng}` : null,
  };
}

function utilities(
  propertyId: string,
  u: { electricity?: PropertyUtilities["electricity"]; water?: PropertyUtilities["water"]; drainage?: PropertyUtilities["drainage"]; internet?: PropertyUtilities["internet"]; street_lighting?: PropertyUtilities["street_lighting"] }
): PropertyUtilities {
  return {
    id: `ut-${propertyId}`,
    property_id: propertyId,
    electricity: u.electricity ?? "unknown",
    water: u.water ?? "unknown",
    drainage: u.drainage ?? "unknown",
    internet: u.internet ?? "unknown",
    street_lighting: u.street_lighting ?? "unknown",
  };
}

function classification(
  propertyId: string,
  c: Partial<PropertyClassification> & { classification: PropertyClassification["classification"] }
): PropertyClassification {
  return {
    id: `cl-${propertyId}`,
    property_id: propertyId,
    classification: c.classification,
    verification_status: c.verification_status ?? "pending",
    verification_source: c.verification_source ?? null,
    verification_date: c.verification_date ?? null,
    admin_notes: c.admin_notes ?? null,
  };
}

const documentsFor = (propertyId: string): PropertyBundle["documents"] => [
  { id: `doc-${propertyId}-k`, property_id: propertyId, document_type: "khatiyan", name: "Khatiyan / Land records", storage_path: "private", is_public: true, uploaded_at: "2026-07-01T10:00:00Z" },
  { id: `doc-${propertyId}-j`, property_id: propertyId, document_type: "jamabandi", name: "Jamabandi", storage_path: "private", is_public: true, uploaded_at: "2026-07-01T10:00:00Z" },
  { id: `doc-${propertyId}-m`, property_id: propertyId, document_type: "mutation", name: "Mutation information", storage_path: "private", is_public: true, uploaded_at: "2026-07-01T10:00:00Z" },
];

export const DEMO_BUNDLES: PropertyBundle[] = [
  bundle(
    {
      id: "prop-0001",
      property_id: "CP-BR-0001",
      title: "1,500 sq.ft Residential Plot in Bihta, Patna",
      slug: "1500-sqft-residential-plot-bihta-patna",
      description:
        "Clean, level residential plot in a developing pocket of Bihta with a 30 ft pucca road. Good school and market access, electricity at the pole, and a well-established neighbourhood on three sides. Ideal for a family home or small builder project.",
      property_type: "residential",
      status: "published",
      availability: "available",
      facing: "East",
      price_display: "Contact for Price",
      created_by: null,
      published_at: "2026-07-02T09:00:00Z",
      created_at: "2026-07-01T10:00:00Z",
      updated_at: "2026-07-02T09:00:00Z",
    },
    {
      measurements: measurements("prop-0001", 1500, STANDARD_PATNA, { n: 30, s: 30, e: 50, w: 50, frontage: 30, road: 30 }),
      location: location("prop-0001", {
        lat: 25.556, lng: 84.868, precision: "approximate",
        village: "Bihta", block: "Bihta", district: "Patna", pincode: "801103",
        fullAddress: "Ward 12, Bihta, Patna, Bihar 801103",
        landmark: "Near Bihta Police Station",
      }),
      nearby_places: [
        mkPlace("prop-0001", "main_road", "Bihta main road", 0.15, "200 m"),
        mkPlace("prop-0001", "highway", "NH-98", 1.2),
        mkPlace("prop-0001", "market", "Bihta Market", 2),
        mkPlace("prop-0001", "school", "DAV Public School", 1.5),
        mkPlace("prop-0001", "hospital", "Bihta Referral Hospital", 3),
        mkPlace("prop-0001", "railway_station", "Bihta Railway Station", 1),
        mkPlace("prop-0001", "airport", "Patna Airport", 28),
      ],
      utilities: utilities("prop-0001", { electricity: "available", water: "available", drainage: "nearby", internet: "nearby", street_lighting: "available" }),
      classification: classification("prop-0001", {
        classification: "private_raiyati",
        verification_status: "document_backed",
        verification_source: "Khatiyan + Jamabandi verified with revenue records",
        verification_date: "2026-07-10",
      }),
      media: [
        mkMedia("prop-0001", "drone_photo", "boundary", img(LAND_4, 1200), "Aerial view — full plot boundary from above", true),
        mkMedia("prop-0001", "photo", "front", img(LAND_1, 1200), "Front view from the road"),
        mkMedia("prop-0001", "photo", "road", img(LAND_3, 1200), "30 ft approach road"),
        mkMedia("prop-0001", "photo", "surroundings", img(LAND_5, 1200), "Neighbouring development"),
        mkMedia("prop-0001", "video", "road", SAMPLE_VIDEO, "Drive-through of the approach road"),
      ],
      documents: documentsFor("prop-0001"),
    },
  ),
  bundle(
    {
      id: "prop-0002",
      property_id: "CP-BR-0002",
      title: "2,400 sq.ft Residential Plot near Danapur, Patna",
      slug: "2400-sqft-residential-plot-danapur-patna",
      description:
        "Corner-adjacent residential plot with 40 ft road frontage in a fast-growing area near Danapur Cantonment. Water and electricity connected at the boundary; close to the new highway corridor.",
      property_type: "residential",
      status: "published",
      availability: "available",
      facing: "North",
      price_display: "Contact for Price",
      created_by: null,
      published_at: "2026-07-05T11:30:00Z",
      created_at: "2026-07-04T10:00:00Z",
      updated_at: "2026-07-05T11:30:00Z",
    },
    {
      measurements: measurements("prop-0002", 2400, STANDARD_PATNA, { n: 48, s: 48, e: 50, w: 50, frontage: 40, road: 40 }),
      location: location("prop-0002", {
        lat: 25.626, lng: 85.037, precision: "exact",
        village: "Danapur", block: "Danapur", district: "Patna", pincode: "801503",
        fullAddress: "Saguna More, Danapur, Patna, Bihar 801503",
        landmark: "Near Saguna More Chowk",
      }),
      nearby_places: [
        mkPlace("prop-0002", "main_road", "Saguna – Danapur road", 0.1, "150 m"),
        mkPlace("prop-0002", "highway", "New NH corridor", 2.5),
        mkPlace("prop-0002", "market", "Saguna Market", 1),
        mkPlace("prop-0002", "school", "Kendriya Vidyalaya Danapur", 2),
        mkPlace("prop-0002", "hospital", "Danapur Military Hospital", 3.5),
        mkPlace("prop-0002", "railway_station", "Danapur Junction", 2.2),
        mkPlace("prop-0002", "airport", "Patna Airport", 18),
      ],
      utilities: utilities("prop-0002", { electricity: "available", water: "available", drainage: "nearby", internet: "available", street_lighting: "available" }),
      classification: classification("prop-0002", {
        classification: "private_raiyati",
        verification_status: "officially_verified",
        verification_source: "Verified against village revenue register",
        verification_date: "2026-06-28",
      }),
      media: [
        mkMedia("prop-0002", "drone_photo", "general", img(LAND_2, 1200), "Aerial view of the plot", true),
        mkMedia("prop-0002", "photo", "front", img(LAND_6, 1200), "Front elevation from road"),
        mkMedia("prop-0002", "photo", "boundary", img(LAND_7, 1200), "Boundary pillars on north side"),
        mkMedia("prop-0002", "drone_photo", "nearby_road", img(LAND_8, 1200), "Drone view of the approach road"),
      ],
      documents: documentsFor("prop-0002"),
    },
  ),
  bundle(
    {
      id: "prop-0003",
      property_id: "CP-BR-0003",
      title: "3,600 sq.ft Commercial Plot on Bailey Road, Patna",
      slug: "3600-sqft-commercial-plot-bailey-road-patna",
      description:
        "High-visibility commercial land on one of Patna's busiest corridors. Corner plot with two road sides, ideal for showroom, clinic, or commercial complex. Under contract — enquiries still welcome for similar parcels.",
      property_type: "commercial",
      status: "published",
      availability: "under_contract",
      facing: "Corner",
      price_display: "Contact for Price",
      created_by: null,
      published_at: "2026-07-08T08:00:00Z",
      created_at: "2026-07-06T10:00:00Z",
      updated_at: "2026-07-08T08:00:00Z",
    },
    {
      measurements: measurements("prop-0003", 3600, STANDARD_PATNA, { n: 60, s: 60, e: 60, w: 60, frontage: 60, road: 60 }),
      location: location("prop-0003", {
        lat: 25.609, lng: 85.122, precision: "exact",
        village: "Kidwaipuri", block: "Patna Sadar", district: "Patna", pincode: "800001",
        fullAddress: "Bailey Road, Kidwaipuri, Patna, Bihar 800001",
        landmark: "Opposite Bailey Road metro station",
      }),
      nearby_places: [
        mkPlace("prop-0003", "main_road", "Bailey Road", 0.02, "20 m"),
        mkPlace("prop-0003", "highway", "Patna Ring Road", 4),
        mkPlace("prop-0003", "market", "Kankarbagh Market", 2.5),
        mkPlace("prop-0003", "hospital", "Paras HMRI", 1.8),
        mkPlace("prop-0003", "college", "Patna University", 3),
        mkPlace("prop-0003", "railway_station", "Patna Junction", 4.5),
        mkPlace("prop-0003", "airport", "Patna Airport", 6),
      ],
      utilities: utilities("prop-0003", { electricity: "available", water: "available", drainage: "available", internet: "available", street_lighting: "available" }),
      classification: classification("prop-0003", {
        classification: "gair_majarua_aam",
        verification_status: "client_provided",
        verification_source: "Client records — independent verification advised",
        verification_date: null,
      }),
      media: [
        mkMedia("prop-0003", "drone_photo", "nearby_road", img(LAND_4, 1200), "Corner location on Bailey Road", true),
        mkMedia("prop-0003", "photo", "front", img(LAND_1, 1200), "Street-level view"),
        mkMedia("prop-0003", "photo", "right", img(LAND_2, 1200), "Right side road view"),
        mkMedia("prop-0003", "video", "general", SAMPLE_VIDEO, "360° walkthrough of the corner"),
      ],
      documents: documentsFor("prop-0003"),
    },
  ),
  bundle(
    {
      id: "prop-0004",
      property_id: "CP-BR-0004",
      title: "1 Katha Residential Plot in Magadh Colony, Gaya",
      slug: "1-katha-residential-plot-magadh-colony-gaya",
      description:
        "Exactly 1 Katha (1,361 sq.ft) of clean residential land in a settled colony with pucca roads and street lights. Documents ready, easy registry. Great value for a first plot in Gaya.",
      property_type: "residential",
      status: "published",
      availability: "available",
      facing: "East",
      price_display: "Contact for Price",
      created_by: null,
      published_at: "2026-07-10T10:00:00Z",
      created_at: "2026-07-09T10:00:00Z",
      updated_at: "2026-07-10T10:00:00Z",
    },
    {
      measurements: measurements("prop-0004", 1361, STANDARD_GAYA, { n: 25, s: 25, e: 54, w: 54, frontage: 25, road: 30 }),
      location: location("prop-0004", {
        lat: 24.796, lng: 85.003, precision: "approximate",
        village: "Magadh Colony", block: "Gaya Sadar", district: "Gaya", pincode: "823001",
        fullAddress: "Magadh Colony, Gaya, Bihar 823001",
        landmark: "Near Magadh College gate",
      }),
      nearby_places: [
        mkPlace("prop-0004", "main_road", "Magadh Colony main road", 0.08, "100 m"),
        mkPlace("prop-0004", "market", "Magadh Market", 1.2),
        mkPlace("prop-0004", "school", "DPS Gaya", 2.5),
        mkPlace("prop-0004", "hospital", "Anugrah Narayan Magadh Medical College", 4),
        mkPlace("prop-0004", "railway_station", "Gaya Junction", 6),
        mkPlace("prop-0004", "airport", "Gaya Airport", 10),
      ],
      utilities: utilities("prop-0004", { electricity: "available", water: "available", drainage: "not_available", internet: "nearby", street_lighting: "available" }),
      classification: classification("prop-0004", {
        classification: "private_raiyati",
        verification_status: "document_backed",
        verification_source: "Jamabandi copy verified",
        verification_date: "2026-07-05",
      }),
      media: [
        mkMedia("prop-0004", "drone_photo", "boundary", img(LAND_7, 1200), "Aerial — 1 Katha plot boundaries", true),
        mkMedia("prop-0004", "photo", "front", img(LAND_5, 1200), "Front view"),
        mkMedia("prop-0004", "photo", "road", img(LAND_6, 1200), "Colony road"),
        mkMedia("prop-0004", "photo", "surroundings", img(LAND_3, 1200), "Neighbouring houses"),
      ],
      documents: documentsFor("prop-0004"),
    },
  ),
  bundle(
    {
      id: "prop-0005",
      property_id: "CP-BR-0005",
      title: "2 Katha Agricultural Land in Ahiyapur, Muzaffarpur",
      slug: "2-katha-agricultural-land-ahiyapur-muzaffarpur",
      description:
        "Two Katha of fertile agricultural land on the Muzaffarpur outskirts with canal water access and a farm approach road. Suitable for orchard, nursery, or future residential conversion (subject to local regulations).",
      property_type: "agricultural",
      status: "published",
      availability: "available",
      facing: "South",
      price_display: "Contact for Price",
      created_by: null,
      published_at: "2026-07-12T09:00:00Z",
      created_at: "2026-07-11T10:00:00Z",
      updated_at: "2026-07-12T09:00:00Z",
    },
    {
      measurements: measurements("prop-0005", 2722, STANDARD_MUZ, { n: 55, s: 55, e: 50, w: 50, frontage: 55, road: 20 }),
      location: location("prop-0005", {
        lat: null, lng: null, precision: "hidden",
        village: "Ahiyapur", block: "Ahiyapur", district: "Muzaffarpur", pincode: "843101",
        fullAddress: "Ahiyapur, Muzaffarpur, Bihar 843101",
        landmark: "Near Ahiyapur canal bridge",
      }),
      nearby_places: [
        mkPlace("prop-0005", "main_road", "Muzaffarpur – Sitamarhi road", 1.5),
        mkPlace("prop-0005", "highway", "NH-57", 4),
        mkPlace("prop-0005", "market", "Ahiyapur Haat", 2),
        mkPlace("prop-0005", "school", "Ahiyapur Middle School", 1.2),
        mkPlace("prop-0005", "railway_station", "Muzaffarpur Junction", 12),
      ],
      utilities: utilities("prop-0005", { electricity: "nearby", water: "available", drainage: "not_available", internet: "unknown", street_lighting: "not_available" }),
      classification: classification("prop-0005", {
        classification: "private_raiyati",
        verification_status: "pending",
        verification_source: null,
        verification_date: null,
      }),
      media: [
        mkMedia("prop-0005", "drone_photo", "general", img(LAND_3, 1200), "Aerial view of the farmland", true),
        mkMedia("prop-0005", "photo", "front", img(LAND_2, 1200), "Farm approach"),
        mkMedia("prop-0005", "photo", "surroundings", img(LAND_8, 1200), "Surrounding farmland"),
      ],
      documents: documentsFor("prop-0005"),
    },
  ),
  bundle(
    {
      id: "prop-0006",
      property_id: "CP-BR-0006",
      title: "1,800 sq.ft Residential Plot in Laheriasarai, Darbhanga",
      slug: "1800-sqft-residential-plot-laheriasarai-darbhanga",
      description:
        "Sold. A well-located residential plot in Laheriasarai with all amenities nearby. Kept live for reference — register your interest for similar plots in Darbhanga.",
      property_type: "residential",
      status: "published",
      availability: "sold",
      facing: "West",
      price_display: "Contact for Price",
      created_by: null,
      published_at: "2026-06-20T09:00:00Z",
      created_at: "2026-06-19T10:00:00Z",
      updated_at: "2026-06-20T09:00:00Z",
    },
    {
      measurements: measurements("prop-0006", 1800, STANDARD_DARB, { n: 36, s: 36, e: 50, w: 50, frontage: 36, road: 30 }),
      location: location("prop-0006", {
        lat: 26.148, lng: 85.898, precision: "approximate",
        village: "Laheriasarai", block: "Darbhanga Sadar", district: "Darbhanga", pincode: "846003",
        fullAddress: "Laheriasarai, Darbhanga, Bihar 846003",
        landmark: "Near Laheriasarai railway station",
      }),
      nearby_places: [
        mkPlace("prop-0006", "main_road", "Laheriasarai main road", 0.2),
        mkPlace("prop-0006", "market", "Laheriasarai Market", 1),
        mkPlace("prop-0006", "school", "Laheriasarai High School", 1.5),
        mkPlace("prop-0006", "hospital", "DMCH Darbhanga", 7),
        mkPlace("prop-0006", "railway_station", "Laheriasarai", 0.8),
      ],
      utilities: utilities("prop-0006", { electricity: "available", water: "available", drainage: "nearby", internet: "nearby", street_lighting: "available" }),
      classification: classification("prop-0006", {
        classification: "private_raiyati",
        verification_status: "officially_verified",
        verification_source: "Registry verified at Sub-Registrar, Darbhanga",
        verification_date: "2026-06-10",
      }),
      media: [
        mkMedia("prop-0006", "drone_photo", "general", img(LAND_5, 1200), "Aerial view", true),
        mkMedia("prop-0006", "photo", "front", img(LAND_1, 1200), "Front view"),
      ],
      documents: documentsFor("prop-0006"),
    },
  ),
  bundle(
    {
      id: "prop-0007",
      property_id: "CP-BR-0007",
      title: "Commercial Land near NH-31, Purnia",
      slug: "commercial-land-near-nh31-purnia",
      description:
        "Commercial land with direct NH-31 visibility — 10 decimal with a long frontage. Ideal for fuel station, warehouse, or showroom. Verification of classification is pending; all facts shown as provided by the client.",
      property_type: "commercial",
      status: "published",
      availability: "available",
      facing: "North-East",
      price_display: "Contact for Price",
      created_by: null,
      published_at: "2026-07-14T08:00:00Z",
      created_at: "2026-07-13T10:00:00Z",
      updated_at: "2026-07-14T08:00:00Z",
    },
    {
      measurements: measurements("prop-0007", 4356, STANDARD_PURNIA, { n: 66, s: 66, e: 66, w: 66, frontage: 66, road: 60 }),
      location: location("prop-0007", {
        lat: 25.777, lng: 87.475, precision: "approximate",
        village: "Purnia East", block: "Purnia Sadar", district: "Purnia", pincode: "854301",
        fullAddress: "NH-31, Purnia East, Purnia, Bihar 854301",
        landmark: "12 km from Purnia bus stand",
      }),
      nearby_places: [
        mkPlace("prop-0007", "highway", "NH-31", 0.01, "On NH-31"),
        mkPlace("prop-0007", "main_road", "NH-31 service road", 0.05, "50 m"),
        mkPlace("prop-0007", "market", "Purnia Main Market", 12),
        mkPlace("prop-0007", "bus_stand", "Purnia Bus Stand", 12),
        mkPlace("prop-0007", "railway_station", "Purnia Junction", 14),
        mkPlace("prop-0007", "airport", "Purnia Airport", 20),
      ],
      utilities: utilities("prop-0007", { electricity: "nearby", water: "nearby", drainage: "not_available", internet: "unknown", street_lighting: "not_available" }),
      classification: classification("prop-0007", {
        classification: "gair_majarua_aam",
        verification_status: "client_provided",
        verification_source: "Client records — independent verification advised",
        verification_date: null,
      }),
      media: [
        mkMedia("prop-0007", "drone_photo", "nearby_road", img(LAND_4, 1200), "NH-31 frontage from above", true),
        mkMedia("prop-0007", "photo", "front", img(LAND_6, 1200), "Frontage along NH-31"),
        mkMedia("prop-0007", "photo", "road", img(LAND_7, 1200), "Service road view"),
      ],
      documents: documentsFor("prop-0007"),
    },
  ),
];

export const DEMO_PROPERTIES: Property[] = DEMO_BUNDLES.map((b) => b.property);
