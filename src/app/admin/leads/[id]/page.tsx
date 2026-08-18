import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, User, Calendar, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { LeadManager } from "./LeadManager";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getSupabaseServerClient();
  
  const { data: lead } = await supabase
    .from("leads")
    .select(`
      *,
      property:properties(id, title, property_id, property_type, price_display, slug)
    `)
    .eq("id", params.id)
    .single();

  if (!lead) return notFound();

  const { data: activities } = await supabase
    .from("lead_activities")
    .select(`
      *,
      admin:admins(name, email)
    `)
    .eq("lead_id", params.id)
    .order("created_at", { ascending: false });

  // Has it been converted?
  const { data: buyer } = await supabase.from("buyers").select("id").eq("lead_id", params.id).single();
  const isConverted = !!buyer;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/leads" className="rounded-lg p-2 text-ink-soft hover:bg-paper-soft hover:text-ink transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-ink">{lead.name}</h1>
            <p className="text-sm text-ink-soft">Lead ID: {lead.lead_id}</p>
          </div>
        </div>
        
        {isConverted && (
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Converted Buyer
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Lead Info & Property */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-ink border-b border-paper-line pb-2">Contact Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-ink-soft" />
                <div>
                  <p className="text-sm font-medium text-ink">{lead.phone}</p>
                  <p className="text-xs text-ink-soft">Primary Phone</p>
                </div>
              </div>
              {lead.whatsapp && (
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-ink">{lead.whatsapp}</p>
                    <p className="text-xs text-ink-soft">WhatsApp</p>
                  </div>
                </div>
              )}
              {lead.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-ink-soft" />
                  <div>
                    <p className="text-sm font-medium text-ink">{lead.email}</p>
                    <p className="text-xs text-ink-soft">Email</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-ink-soft" />
                <div>
                  <p className="text-sm font-medium text-ink capitalize">{lead.source}</p>
                  <p className="text-xs text-ink-soft">Lead Source</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-ink-soft" />
                <div>
                  <p className="text-sm font-medium text-ink">{format(new Date(lead.created_at), "PPP")}</p>
                  <p className="text-xs text-ink-soft">Enquiry Date</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-ink border-b border-paper-line pb-2">Requirement Info</h2>
            <div className="space-y-4">
              {lead.property ? (
                <div>
                  <p className="text-xs text-ink-soft mb-1">Enquired Property</p>
                  <Link href={`/admin/properties/${lead.property_id}`} className="block rounded-lg border border-paper-line p-3 hover:border-brand transition-colors">
                    <p className="font-medium text-ink">{lead.property.title}</p>
                    <p className="text-sm text-ink-soft">{lead.property.property_id} • {lead.property.price_display}</p>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-ink-soft italic">General enquiry without a specific property linked.</p>
              )}

              {lead.purpose && (
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Purpose</p>
                  <p className="text-sm font-medium text-ink capitalize">{lead.purpose}</p>
                </div>
              )}
              {lead.budget_range && (
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Budget Range</p>
                  <p className="text-sm font-medium text-ink">{lead.budget_range}</p>
                </div>
              )}
              {lead.preferred_location && (
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Preferred Location</p>
                  <p className="text-sm font-medium text-ink">{lead.preferred_location}</p>
                </div>
              )}
              {lead.message && (
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Message</p>
                  <p className="text-sm text-ink p-3 bg-paper-soft rounded-lg italic">"{lead.message}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Workflow and Timeline */}
        <div className="lg:col-span-2">
          <LeadManager lead={lead} activities={activities || []} isConverted={isConverted} />
        </div>
      </div>
    </div>
  );
}

// Temporary icon component since MessageCircle isn't imported from lucide-react above
function MessageCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
