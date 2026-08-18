"use server";

// Buyer enquiry server action (FR-ENQ-01…06). Creates a lead + activity +
// analytics event when Supabase is configured; otherwise validates and
// succeeds (demo mode) so the flow works on localhost.

import { enquirySchema } from "@/lib/validation";
import { leadIdFromSequence } from "@/lib/ids";
import { USE_SUPABASE } from "@/lib/data/properties";

export interface EnquiryState {
  ok: boolean;
  message?: string;
}

function readUtm() {
  return { utm_source: null, utm_medium: null, utm_campaign: null };
}

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const raw = Object.fromEntries(formData.entries());

  // Honeypot (NFR-SEC-02): bots fill the hidden "website" field.
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return { ok: true };
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first?.message ?? "Please check the form and try again." };
  }

  if (!USE_SUPABASE) {
    // Demo mode — accept the enquiry locally.
    return { ok: true };
  }

  try {
    const { getSupabaseAdminClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseAdminClient();
    const utm = readUtm();

    const { count } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true });
    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        lead_id: leadIdFromSequence((count ?? 0) + 1),
        name: parsed.data.name,
        phone: parsed.data.phone,
        whatsapp: parsed.data.whatsapp || null,
        property_id: null,
        source: "direct",
        ...utm,
        preferred_contact_method: parsed.data.contact_method || null,
        budget_range: parsed.data.budget_range || null,
        preferred_location: parsed.data.preferred_location || null,
        plot_size: parsed.data.plot_size || null,
        purpose: parsed.data.purpose || null,
        preferred_road_width: parsed.data.preferred_road_width || null,
        purchase_timeline: parsed.data.purchase_timeline || null,
        message: parsed.data.message || null,
      })
      .select()
      .single();
    if (error || !lead) {
      return { ok: false, message: "Could not submit your enquiry. Please try again." };
    }
    await supabase.from("lead_activities").insert({
      lead_id: lead.id,
      activity_type: "enquiry_received",
      note: "Enquiry received via website form",
    });
    await supabase.from("analytics_events").insert({
      event_name: "enquiry_submit",
      page_path: "/",
    });
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
