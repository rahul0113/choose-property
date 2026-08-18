import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";

export default async function AdminPropertiesPage() {
  const supabase = await getSupabaseServerClient();
  
  const { data: properties } = await supabase
    .from("properties")
    .select("id, slug, status, type, location_city, price, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Properties</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage your property listings.</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-paper-line bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-soft text-ink-soft">
            <tr>
              <th className="px-6 py-4 font-medium">Property ID</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-line text-ink">
            {properties?.map((property) => (
              <tr key={property.id} className="hover:bg-paper-soft/50">
                <td className="px-6 py-4 font-medium">
                  {property.slug || property.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 capitalize">{property.type}</td>
                <td className="px-6 py-4">{property.location_city}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      property.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="text-brand hover:text-brand-dark flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!properties || properties.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-ink-soft">
                  No properties found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
