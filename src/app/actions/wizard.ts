"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const step1Schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  property_type: z.enum(["residential", "commercial", "agricultural", "other"]),
  description: z.string().optional(),
  availability: z.enum(["available", "sold", "under_contract"]),
  facing: z.string().optional(),
  price_display: z.string().min(1, "Price display is required"),
  open_sites: z.coerce.number().int().min(1).max(99).optional().nullable(),
  amenities: z.array(z.string()).optional().nullable(),
});

export async function saveStep1(prevState: any, formData: FormData) {
  const propertyId = formData.get("propertyId") as string;
  const raw = Object.fromEntries(formData.entries());
  // Handle multi-select checkboxes for amenities
  const rawAmenities = formData.getAll("amenities");
  
  const parsed = step1Schema.safeParse({
    ...raw,
    amenities: rawAmenities.length > 0 ? rawAmenities.map(String) : null,
  });
  
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  let nextPropertyId = propertyId;

  if (propertyId === "new") {
    // Generate human ID like CP-BR-0001
    const { count } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });
      
    const humanId = `CP-BR-${String((count || 0) + 1).padStart(4, "0")}`;
    const slug = `draft-${Date.now()}`; // Temporary slug

    const { data, error } = await supabase
      .from("properties")
      .insert({
        property_id: humanId,
        title: parsed.data.title,
        slug: slug,
        description: parsed.data.description,
        property_type: parsed.data.property_type,
        status: "draft",
        availability: parsed.data.availability,
        facing: parsed.data.facing || null,
        price_display: parsed.data.price_display,
        open_sites: parsed.data.open_sites || null,
        amenities: parsed.data.amenities,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error(error);
      return { error: "Failed to create property: " + (error?.message || "Unknown error") };
    }
    nextPropertyId = data.id;
  } else {
    // Update existing
    const { error } = await supabase
      .from("properties")
      .update({
        title: parsed.data.title,
        description: parsed.data.description,
        property_type: parsed.data.property_type,
        availability: parsed.data.availability,
        facing: parsed.data.facing || null,
        price_display: parsed.data.price_display,
        open_sites: parsed.data.open_sites || null,
        amenities: parsed.data.amenities,
      })
      .eq("id", propertyId);

    if (error) {
      return { error: "Failed to update property: " + error.message };
    }
  }

  redirect(`/admin/properties/${nextPropertyId}/edit?step=2`);
}

const step2Schema = z.object({
  area_sqft: z.coerce.number().min(1, "Area is required"),
  measurement_standard_id: z.string().uuid("Please select a standard"),
});

export async function saveStep2(prevState: any, formData: FormData) {
  const propertyId = formData.get("propertyId") as string;
  const raw = Object.fromEntries(formData.entries());
  
  const parsed = step2Schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Check if property_measurements exists
  const { data: existing } = await supabase
    .from("property_measurements")
    .select("id")
    .eq("property_id", propertyId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("property_measurements")
      .update({
        area_sqft: parsed.data.area_sqft,
        measurement_standard_id: parsed.data.measurement_standard_id,
      })
      .eq("property_id", propertyId);
      
    if (error) return { error: "Failed to update measurements: " + error.message };
  } else {
    const { error } = await supabase
      .from("property_measurements")
      .insert({
        property_id: propertyId,
        area_sqft: parsed.data.area_sqft,
        measurement_standard_id: parsed.data.measurement_standard_id,
        plot_diagram_disclaimer: "Informational — not a legal survey unless based on verified survey data.",
      });
      
    if (error) return { error: "Failed to create measurements: " + error.message };
  }

  redirect(`/admin/properties/${propertyId}/edit?step=3`);
}

const step3Schema = z.object({
  north_ft: z.coerce.number().optional().nullable(),
  south_ft: z.coerce.number().optional().nullable(),
  east_ft: z.coerce.number().optional().nullable(),
  west_ft: z.coerce.number().optional().nullable(),
  road_frontage_ft: z.coerce.number().optional().nullable(),
  road_width_ft: z.coerce.number().optional().nullable(),
});

export async function saveStep3(prevState: any, formData: FormData) {
  const propertyId = formData.get("propertyId") as string;
  const raw = Object.fromEntries(formData.entries());
  
  // Convert empty strings to null before parsing
  Object.keys(raw).forEach((key) => {
    if (raw[key] === "") raw[key] = null as any;
  });

  const parsed = step3Schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("property_measurements")
    .update({
      north_ft: parsed.data.north_ft,
      south_ft: parsed.data.south_ft,
      east_ft: parsed.data.east_ft,
      west_ft: parsed.data.west_ft,
      road_frontage_ft: parsed.data.road_frontage_ft,
      road_width_ft: parsed.data.road_width_ft,
    })
    .eq("property_id", propertyId);
    
  if (error) return { error: "Failed to save dimensions: " + error.message };

  redirect(`/admin/properties/${propertyId}/edit?step=4`);
}

export async function saveStep4(propertyId: string, places: any[]) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Delete existing places to replace them
  await supabase.from("nearby_places").delete().eq("property_id", propertyId);

  if (places.length > 0) {
    const { error } = await supabase.from("nearby_places").insert(
      places.map(p => ({
        property_id: propertyId,
        place_type: p.place_type,
        name: p.name || null,
        distance_km: p.distance_km ? parseFloat(p.distance_km) : null,
        distance_text: p.distance_text || null,
      }))
    );

    if (error) return { error: "Failed to save connectivity: " + error.message };
  }

  // Next.js Server Actions don't support returning `redirect()` when called from an onClick handler directly if it's not a form action that returns a result properly. 
  // We'll return success and redirect on the client, or we can use revalidatePath and return success.
  return { success: true };
}

const step5Schema = z.object({
  electricity: z.enum(["available", "nearby", "not_available", "unknown"]),
  water: z.enum(["available", "nearby", "not_available", "unknown"]),
  drainage: z.enum(["available", "nearby", "not_available", "unknown"]),
  internet: z.enum(["available", "nearby", "not_available", "unknown"]),
  street_lighting: z.enum(["available", "nearby", "not_available", "unknown"]),
});

export async function saveStep5(prevState: any, formData: FormData) {
  const propertyId = formData.get("propertyId") as string;
  const raw = Object.fromEntries(formData.entries());

  const parsed = step5Schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: existing } = await supabase
    .from("property_utilities")
    .select("id")
    .eq("property_id", propertyId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("property_utilities")
      .update(parsed.data)
      .eq("property_id", propertyId);
    if (error) return { error: "Failed to update utilities: " + error.message };
  } else {
    const { error } = await supabase
      .from("property_utilities")
      .insert({
        property_id: propertyId,
        ...parsed.data,
      });
    if (error) return { error: "Failed to create utilities: " + error.message };
  }

  redirect(`/admin/properties/${propertyId}/edit?step=6`);
}

const step6Schema = z.object({
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  location_precision: z.enum(["exact", "approximate", "hidden"]),
  village: z.string().optional(),
  panchayat: z.string().optional(),
  block: z.string().optional(),
  district: z.string().optional(),
  state: z.string().default("Bihar"),
  pincode: z.string().optional(),
  full_address: z.string().optional(),
  nearby_landmark: z.string().optional(),
  google_maps_url: z.string().optional(),
});

export async function saveStep6(prevState: any, formData: FormData) {
  const propertyId = formData.get("propertyId") as string;
  const raw = Object.fromEntries(formData.entries());
  
  Object.keys(raw).forEach((key) => {
    if (raw[key] === "") raw[key] = null as any;
  });

  const parsed = step6Schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: existing } = await supabase
    .from("property_locations")
    .select("id")
    .eq("property_id", propertyId)
    .single();

  // Also update the location_city in properties table for easier querying
  await supabase.from("properties").update({
    location_city: parsed.data.district || parsed.data.village || null
  }).eq("id", propertyId);

  if (existing) {
    const { error } = await supabase
      .from("property_locations")
      .update(parsed.data)
      .eq("property_id", propertyId);
    if (error) return { error: "Failed to update location: " + error.message };
  } else {
    const { error } = await supabase
      .from("property_locations")
      .insert({
        property_id: propertyId,
        ...parsed.data,
      });
    if (error) return { error: "Failed to create location: " + error.message };
  }

  redirect(`/admin/properties/${propertyId}/edit?step=7`);
}

const step7Schema = z.object({
  classification: z.enum([
    "private_raiyati",
    "gair_majarua",
    "gair_majarua_aam",
    "gair_majarua_malik",
    "other",
    "unknown",
  ]),
  verification_status: z.enum([
    "pending",
    "client_provided",
    "document_backed",
    "admin_verified",
    "officially_verified",
  ]),
  verification_source: z.string().optional(),
  admin_notes: z.string().optional(),
});

export async function saveStep7(prevState: any, formData: FormData) {
  const propertyId = formData.get("propertyId") as string;
  const raw = Object.fromEntries(formData.entries());

  const parsed = step7Schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: existing } = await supabase
    .from("property_classifications")
    .select("id")
    .eq("property_id", propertyId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("property_classifications")
      .update(parsed.data)
      .eq("property_id", propertyId);
    if (error) return { error: "Failed to update classification: " + error.message };
  } else {
    const { error } = await supabase
      .from("property_classifications")
      .insert({
        property_id: propertyId,
        ...parsed.data,
      });
    if (error) return { error: "Failed to create classification: " + error.message };
  }

  redirect(`/admin/properties/${propertyId}/edit?step=8`);
}

export async function publishProperty(propertyId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Fetch the current property to generate a slug if it's still a draft slug
  const { data: property } = await supabase
    .from("properties")
    .select("title, slug, location_city")
    .eq("id", propertyId)
    .single();

  if (!property) return { error: "Property not found" };

  let updateData: any = { 
    status: "published",
    published_at: new Date().toISOString()
  };

  // If it still has the temporary draft slug, create a clean one
  if (property.slug.startsWith("draft-")) {
    const baseSlug = (property.title + (property.location_city ? ` ${property.location_city}` : ""))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    // Add a random hash to ensure uniqueness
    const randomHash = Math.random().toString(36).substring(2, 6);
    updateData.slug = `${baseSlug}-${randomHash}`;
  }

  const { error } = await supabase
    .from("properties")
    .update(updateData)
    .eq("id", propertyId);

  if (error) return { error: "Failed to publish: " + error.message };

  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/admin/properties");

  redirect(`/admin/properties`);
}
