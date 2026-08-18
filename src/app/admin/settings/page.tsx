import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminSettingsPage() {
  const supabase = await getSupabaseServerClient();
  
  const { data: standards } = await supabase
    .from("measurement_standards")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name");

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Settings</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage global site configurations and regional measurement standards.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Navigation/Tabs */}
        <div className="space-y-2">
          <button className="w-full text-left rounded-lg bg-brand-soft px-4 py-2 font-medium text-brand-dark">
            Measurement Standards
          </button>
          <button className="w-full text-left rounded-lg px-4 py-2 font-medium text-ink-soft hover:bg-paper-soft hover:text-ink">
            Contact & WhatsApp
          </button>
          <button className="w-full text-left rounded-lg px-4 py-2 font-medium text-ink-soft hover:bg-paper-soft hover:text-ink">
            SEO Defaults
          </button>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-paper-line bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-paper-line p-4 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-ink">Measurement Standards</h2>
                <p className="text-sm text-ink-soft">Configure Katha sizes for different districts.</p>
              </div>
              <Link
                href="/admin/settings/standards/new"
                className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add Standard
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-paper-soft text-ink-soft">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">District</th>
                    <th className="px-6 py-3 font-medium">1 Katha = sq.ft</th>
                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-line">
                  {standards?.map((standard) => (
                    <tr key={standard.id} className="transition-colors hover:bg-paper-soft/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-ink">{standard.name}</span>
                          {standard.is_default && (
                            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">
                              Default
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ink-soft">
                        {standard.district || "Statewide"}
                      </td>
                      <td className="px-6 py-4 font-mono text-ink">
                        {standard.katha_sqft}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/settings/standards/${standard.id}/edit`}
                            className="rounded-lg p-2 text-ink-soft hover:bg-paper-line hover:text-ink transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          {/* We don't allow deleting the default standard easily */}
                          {!standard.is_default && (
                            <form action={async () => {
                              "use server";
                              const supabase = await getSupabaseServerClient();
                              await supabase.from("measurement_standards").delete().eq("id", standard.id);
                              revalidatePath("/admin/settings");
                            }}>
                              <button
                                type="submit"
                                className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!standards?.length && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-ink-soft">
                        No measurement standards found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
