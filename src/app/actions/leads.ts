"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addLeadActivity(leadId: string, activityType: string, note?: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Get admin ID
  const { data: admin } = await supabase.from("admins").select("id").eq("id", user.id).single();
  if (!admin) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("lead_activities").insert({
    lead_id: leadId,
    activity_type: activityType,
    note: note || null,
    created_by: admin.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/leads/${leadId}`);
  return { success: true };
}

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Update lead status
  const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
  if (error) {
    return { error: error.message };
  }

  // Also log the activity automatically
  await addLeadActivity(leadId, "status_change", `Status updated to ${newStatus}`);

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function convertLeadToBuyer(leadId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Unauthorized" };

  // Fetch lead data
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single();
  if (!lead) return { error: "Lead not found" };

  // Create buyer
  const { error } = await supabase.from("buyers").insert({
    lead_id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
  });

  if (error) return { error: error.message };

  // Update status
  await supabase.from("leads").update({ status: "converted" }).eq("id", leadId);
  await addLeadActivity(leadId, "status_change", "Lead successfully converted to a buyer!");

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  return { success: true };
}
