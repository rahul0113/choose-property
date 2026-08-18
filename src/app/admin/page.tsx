import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Users, Home, Eye, TrendingUp, BarChart3, MapPin } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await getSupabaseServerClient();
  
  // Basic stats
  const { count: propertiesCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });
    
  const { count: leadsCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  const { count: pageViews } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("event_name", "page_view");

  const { count: buyersCount } = await supabase
    .from("buyers")
    .select("*", { count: "exact", head: true });

  // Funnel Data
  const { data: leads } = await supabase.from("leads").select("status, source, preferred_location");
  
  const funnel = {
    new: 0,
    contacted: 0,
    interested: 0,
    site_visit: 0,
    negotiation: 0,
    converted: 0,
    lost: 0,
  };
  
  const sources: Record<string, number> = {};
  const locations: Record<string, number> = {};

  leads?.forEach(lead => {
    // Funnel
    if (lead.status in funnel) {
      funnel[lead.status as keyof typeof funnel]++;
    }
    // Sources
    const source = lead.source || "unknown";
    sources[source] = (sources[source] || 0) + 1;
    // Locations
    if (lead.preferred_location) {
      const loc = lead.preferred_location;
      locations[loc] = (locations[loc] || 0) + 1;
    }
  });

  // Sort locations by demand
  const topLocations = Object.entries(locations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topSources = Object.entries(sources)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-ink-soft">Analytics, lead funnel, and BI reports.</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-soft">Total Properties</p>
            <p className="mt-2 text-3xl font-bold text-ink">{propertiesCount || 0}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-brand-soft flex items-center justify-center">
            <Home className="h-6 w-6 text-brand-dark" />
          </div>
        </div>
        <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-soft">Total Leads</p>
            <p className="mt-2 text-3xl font-bold text-ink">{leadsCount || 0}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-soft">Page Views</p>
            <p className="mt-2 text-3xl font-bold text-ink">{pageViews || 0}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Eye className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-soft">Converted Buyers</p>
            <p className="mt-2 text-3xl font-bold text-ink">{buyersCount || 0}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Funnel */}
        <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 border-b border-paper-line pb-4">
            <BarChart3 className="h-5 w-5 text-ink-soft" />
            <h2 className="text-lg font-semibold text-ink">Lead Funnel</h2>
          </div>
          <div className="space-y-4 pt-2">
            {[
              { label: "New Leads", count: funnel.new, color: "bg-blue-500" },
              { label: "Contacted", count: funnel.contacted, color: "bg-yellow-500" },
              { label: "Site Visit", count: funnel.site_visit, color: "bg-indigo-500" },
              { label: "Negotiation", count: funnel.negotiation, color: "bg-pink-500" },
              { label: "Converted", count: funnel.converted, color: "bg-green-500" },
            ].map((stage, i, arr) => {
              const max = Math.max(...arr.map(s => s.count), 1);
              const percentage = (stage.count / max) * 100;
              return (
                <div key={stage.label}>
                  <div className="mb-1 flex justify-between text-sm font-medium text-ink">
                    <span>{stage.label}</span>
                    <span>{stage.count}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-paper-soft">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demand & Sources */}
        <div className="space-y-6 lg:col-span-1">
          {/* Top Locations Demand */}
          <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-paper-line pb-4">
              <MapPin className="h-5 w-5 text-ink-soft" />
              <h2 className="text-lg font-semibold text-ink">Location Demand</h2>
            </div>
            <div className="space-y-3 pt-2">
              {topLocations.length > 0 ? (
                topLocations.map(([loc, count], index) => (
                  <div key={loc} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink capitalize">
                      {index + 1}. {loc}
                    </span>
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">
                      {count} enquiries
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-soft italic">Not enough data yet.</p>
              )}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-paper-line pb-4">
              <Users className="h-5 w-5 text-ink-soft" />
              <h2 className="text-lg font-semibold text-ink">Top Sources</h2>
            </div>
            <div className="space-y-3 pt-2">
              {topSources.length > 0 ? (
                topSources.map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink capitalize">
                      {source.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm font-bold text-ink">
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-soft italic">Not enough data yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
