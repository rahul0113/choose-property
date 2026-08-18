import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Search, Filter, MessageSquare, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const supabase = await getSupabaseServerClient();
  
  const statusFilter = searchParams.status || "all";
  const searchQuery = searchParams.search || "";

  let query = supabase.from("leads").select(`
    *,
    property:properties(title, property_id)
  `).order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%`);
  }

  const { data: leads } = await query;

  const STATUS_COLORS: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    interested: "bg-orange-100 text-orange-700",
    follow_up: "bg-purple-100 text-purple-700",
    site_visit: "bg-indigo-100 text-indigo-700",
    negotiation: "bg-pink-100 text-pink-700",
    converted: "bg-green-100 text-green-700",
    lost: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Lead Pipeline</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage incoming enquiries, schedule site visits, and convert leads to buyers.
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <form className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            name="search"
            defaultValue={searchQuery}
            placeholder="Search leads by name, phone, or ID..."
            className="w-full rounded-lg border border-paper-line bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-brand"
          />
          {statusFilter !== "all" && <input type="hidden" name="status" value={statusFilter} />}
        </form>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["all", "new", "contacted", "interested", "site_visit", "negotiation", "converted", "lost"].map((s) => (
            <Link
              key={s}
              href={`/admin/leads?status=${s}${searchQuery ? `&search=${searchQuery}` : ""}`}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-brand text-white"
                  : "bg-white border border-paper-line text-ink-soft hover:bg-paper-soft hover:text-ink"
              }`}
            >
              {s.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-paper-line bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-soft text-ink-soft">
              <tr>
                <th className="px-6 py-3 font-medium">Lead Info</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Interest</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Received</th>
                <th className="px-6 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-line">
              {leads?.map((lead) => (
                <tr key={lead.id} className="transition-colors hover:bg-paper-soft/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-ink">{lead.name}</div>
                    <div className="text-xs text-ink-soft">{lead.lead_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-ink">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                    {lead.email && (
                      <div className="mt-1 flex items-center gap-2 text-ink-soft text-xs">
                        <MessageSquare className="h-3 w-3" />
                        {lead.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {lead.property ? (
                      <div className="text-ink max-w-[200px] truncate" title={lead.property.title}>
                        <Link href={`/admin/properties/${lead.property_id}`} className="hover:text-brand hover:underline">
                          {lead.property.property_id}
                        </Link>
                      </div>
                    ) : (
                      <div className="text-ink-soft">General Enquiry</div>
                    )}
                    {(lead.preferred_location || lead.plot_size) && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
                        <MapPin className="h-3 w-3" />
                        {lead.preferred_location} {lead.plot_size && `• ${lead.plot_size}`}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {lead.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink-soft whitespace-nowrap">
                    {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="rounded-lg bg-paper-soft px-3 py-1.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand hover:text-white border border-paper-line hover:border-brand"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {!leads?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-ink-soft">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
